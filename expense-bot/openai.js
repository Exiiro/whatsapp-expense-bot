const OpenAI = require('openai');
const { OPENAI_API_KEY } = require('./config');

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

const getDailyAdvice = async (retryCount = 0) => {
    try {
        console.log('Fetching daily advice from OpenAI...');
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'أعطني نصيحة يومية لإدارة المال تتكون من جمله واحدة.' }],
            max_tokens: 100,
            temperature: 0.7,
        });

        const advice = response.choices[0].message.content.trim();
        console.log('Fetched advice:', advice);
        return advice;
    } catch (error) {
        console.error('Error fetching advice from OpenAI:', error.status, error.message);
        if (error.status === 429 && retryCount < 5) {
            const waitTime = Math.pow(2, retryCount) * 1000;
            console.log(`Retrying in ${waitTime / 1000} seconds...`);
            await sleep(waitTime);
            return getDailyAdvice(retryCount + 1);
        }
        return 'نصيحة اليوم لإدارة المال: قم بتحديد ميزانية شهرية والتزم بها لتجنب الإنفاق الزائد.';
    }
};

module.exports = { getDailyAdvice };