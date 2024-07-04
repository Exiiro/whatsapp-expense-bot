require('dotenv').config();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const qrcode = require('qrcode-terminal');
const { handleMessages } = require('./commands');
const { reminderMessage, adviceMessage, userPoints } = require('./config');
const cron = require('./cron');

const startSock = async () => {
    console.log('Starting WhatsApp socket...');
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    console.log('Auth state loaded');

    const sock = makeWASocket({
        logger: P({ level: 'info' }),
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            qrcode.generate(qr, { small: true });
            console.log('QR code received, scan it using your WhatsApp');
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                startSock();
            }
        } else if (connection === 'open') {
            console.log('opened connection');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        await handleMessages(sock, m.messages[0]);
    });

    cron.setupCronJobs(sock);
};

startSock();