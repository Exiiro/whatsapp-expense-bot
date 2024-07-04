const { ADMIN_ID, GROUP_ID, reminderMessage, adviceMessage, userPoints } = require('./config');
const { getDailyAdvice } = require('./openai');
const {
    sendLongMessage,
    saveUserPoints,
    loadPendingRequests,
    savePendingRequests,
    loadPendingSpendingRequests,
    savePendingSpendingRequests
} = require('./utils');

// Function to handle incoming messages
const handleMessages = async (sock, msg) => {
    const { from, text } = extractMessageDetails(msg);
    const pendingRequests = loadPendingRequests();
    const pendingSpendingRequests = loadPendingSpendingRequests();

    if (!msg.key.fromMe && msg.message) {
        // Handle deposit request
        if (text.startsWith('!إيداع')) {
            const parts = text.split(' ');
            const amount = parseFloat(parts[1]);
            const points = addPoints(from, amount);
            if (from !== ADMIN_ID) {
                await sock.sendMessage(ADMIN_ID, {
                    text: `طلب إيداع من المستخدم ${from} بمبلغ ${amount} ريال، للحصول على ${points} نقطة. \nهل توافق؟ ارسل "نعم" أو "لا" للموافقة أو الرفض.`
                });
                pendingSpendingRequests[from] = { amount, points };
                savePendingSpendingRequests(pendingSpendingRequests);
            } else {
                userPoints[from] = (userPoints[from] || 0) + points;
                saveUserPoints(userPoints);
                await sock.sendMessage(from, { text: `تمت إضافة ${points} نقطة لنفقاتك الإضافية.` });
            }
        // Handle user's points request
        } else if (text === '!نقاطي') {
            const points = userPoints[from] || 0;
            await sock.sendMessage(from, { text: `لديك ${points} نقطة.` });
        // Handle reminder message
        } else if (text === '!تذكير') {
            await sock.sendMessage(from, { text: reminderMessage });
        // Handle daily advice
        } else if (text === '!نصيحة') {
            const advice = await getDailyAdvice();
            await sendLongMessage(sock, from, advice);
        // Send reminder to group
        } else if (text === '!أرسل_التذكير') {
            if (from === ADMIN_ID) {
                await sock.sendMessage(GROUP_ID, { text: reminderMessage });
                await sock.sendMessage(ADMIN_ID, { text: 'تم إرسال التذكير إلى القروب بنجاح.' });
            } else {
                await sock.sendMessage(from, { text: 'ليس لديك الصلاحية لإرسال التذكير إلى القروب.' });
            }
        // Send daily advice to group
        } else if (text === '!أرسل_النصيحة') {
            if (from === ADMIN_ID) {
                const advice = await getDailyAdvice();
                await sendLongMessage(sock, GROUP_ID, advice);
                await sock.sendMessage(ADMIN_ID, { text: 'تم إرسال النصيحة إلى القروب بنجاح.' });
            } else {
                await sock.sendMessage(from, { text: 'ليس لديك الصلاحية لإرسال النصيحة إلى القروب.' });
            }
        // Handle reward request
        } else if (text.startsWith('!مكافأة')) {
            const parts = text.split(' ');
            const reward = parts[1];
            const response = handleRewardRequest(from, reward);
            await sock.sendMessage(from, { text: response });
            await sock.sendMessage(ADMIN_ID, {
                text: `تم تقديم طلب مكافأة ${reward} من المستخدم ${from}. \nهل توافق؟ ارسل "نعم" أو "لا" للموافقة أو الرفض.`
            });
            pendingRequests[from] = { reward };
            savePendingRequests(pendingRequests);
        // Handle adding points
        } else if (text.startsWith('!إضافة_نقاط')) {
            if (from === ADMIN_ID) {
                const parts = text.split(' ');
                const user = parts[1];
                const points = parseFloat(parts[2]);
                userPoints[user] = (userPoints[user] || 0) + points;
                saveUserPoints(userPoints);
                await sock.sendMessage(from, { text: `تم إضافة ${points} نقطة للمستخدم ${user}.` });
            } else {
                await sock.sendMessage(from, { text: 'ليس لديك الصلاحية لإضافة نقاط.' });
            }
        // Handle subtracting points
        } else if (text.startsWith('!طرح_نقاط')) {
            if (from === ADMIN_ID) {
                const parts = text.split(' ');
                const user = parts[1];
                const points = parseFloat(parts[2]);
                userPoints[user] = (userPoints[user] || 0) - points;
                saveUserPoints(userPoints);
                await sock.sendMessage(from, { text: `تم طرح ${points} نقطة من المستخدم ${user}.` });
            } else {
                await sock.sendMessage(from, { text: 'ليس لديك الصلاحية لطرح نقاط.' });
            }
        // Handle admin approvals
        } else if (from === ADMIN_ID) {
            if (text.toLowerCase() === 'نعم') {
                const pendingUsers = Object.keys(pendingRequests).concat(Object.keys(pendingSpendingRequests));
                for (const user of pendingUsers) {
                    if (pendingRequests[user]) {
                        const response = approveRewardRequest(user);
                        await sock.sendMessage(ADMIN_ID, { text: response });
                    }
                    if (pendingSpendingRequests[user]) {
                        const response = approveSpendingRequest(user);
                        await sock.sendMessage(ADMIN_ID, { text: response });
                    }
                }
            } else if (text.toLowerCase() === 'لا') {
                const pendingUsers = Object.keys(pendingRequests).concat(Object.keys(pendingSpendingRequests));
                for (const user of pendingUsers) {
                    if (pendingRequests[user]) {
                        await sock.sendMessage(user, { text: 'تم رفض طلب المكافأة الخاص بك.' });
                        delete pendingRequests[user];
                        savePendingRequests(pendingRequests);
                    }
                    if (pendingSpendingRequests[user]) {
                        await sock.sendMessage(user, { text: 'تم رفض طلب المصروفات الخاص بك.' });
                        delete pendingSpendingRequests[user];
                        savePendingSpendingRequests(pendingSpendingRequests);
                    }
                }
            }
        }
    }
};

// Extracts message details
const extractMessageDetails = (msg) => {
    const from = msg.key.remoteJid;
    const text = msg.message.conversation || '';
    return { from, text };
};

// Adds points to a user
const addPoints = (user, amount) => {
    const points = Math.floor(amount / 100) * 150;
    userPoints[user] = (userPoints[user] || 0) + points;
    saveUserPoints(userPoints);
    return points;
};

// Handles reward request
const handleRewardRequest = (user, reward) => {
    // Handle reward request logic
    return `تم تقديم طلب مكافأة ${reward} من المستخدم ${user}.`;
};

// Approves reward request
const approveRewardRequest = (user) => {
    // Approve reward request logic
    delete pendingRequests[user];
    savePendingRequests(pendingRequests);
    return `تمت الموافقة على مكافأة المستخدم ${user}.`;
};

// Approves spending request
const approveSpendingRequest = (user) => {
    // Approve spending request logic
    delete pendingSpendingRequests[user];
    savePendingSpendingRequests(pendingSpendingRequests);
    return `تمت الموافقة على المصروفات الخاصة بالمستخدم ${user}.`;
};

module.exports = { handleMessages };