const fs = require('fs');
const { POINTS_FILE, PENDING_REQUESTS_FILE, PENDING_SPENDING_REQUESTS_FILE } = require('./config');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const splitMessage = (message) => {
    const chunks = [];
    for (let i = 0; i < message.length; i += 4096) {
        chunks.push(message.substring(i, i + 4096));
    }
    return chunks;
};

const loadFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath));
    }
    return {};
};

const saveFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data));
};

const loadPoints = () => loadFile(POINTS_FILE);
const savePoints = (data) => saveFile(POINTS_FILE, data);
const loadPendingRequests = () => loadFile(PENDING_REQUESTS_FILE);
const savePendingRequests = (data) => saveFile(PENDING_REQUESTS_FILE, data);
const loadPendingSpendingRequests = () => loadFile(PENDING_SPENDING_REQUESTS_FILE);
const savePendingSpendingRequests = (data) => saveFile(PENDING_SPENDING_REQUESTS_FILE, data);

module.exports = {
    sleep,
    splitMessage,
    loadPoints,
    savePoints,
    loadPendingRequests,
    savePendingRequests,
    loadPendingSpendingRequests,
    savePendingSpendingRequests,
};