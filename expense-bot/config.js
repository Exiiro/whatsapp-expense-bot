require('dotenv').config();

const POINTS_FILE = './data/points.json';
const PENDING_REQUESTS_FILE = './data/pending_requests.json';
const PENDING_SPENDING_REQUESTS_FILE = './data/pending_spending_requests.json';

const ADMIN_ID = process.env.ADMIN_ID;
const GROUP_ID = process.env.GROUP_ID;

const reminderMessage = 'تذكير شهري: يرجى دفع نفقاتك هذا الشهر قبل يوم 10 لتجنب الطرد من القبيله.';
let adviceMessage = 'نصيحة اليوم لإدارة المال: قم بتحديد ميزانية شهرية والتزم بها لتجنب الإنفاق الزائد.';

module.exports = {
    POINTS_FILE,
    PENDING_REQUESTS_FILE,
    PENDING_SPENDING_REQUESTS_FILE,
    ADMIN_ID,
    GROUP_ID,
    reminderMessage,
    adviceMessage
};