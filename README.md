# whatsapp-expense-bot
This project is a WhatsApp bot designed to help manage group expenses and provide daily financial advice. The bot is built using the Baileys library for WhatsApp Web API and the OpenAI API for generating financial advice.


## License
  
  **This project is licensed under the GPL-3.0 License.**



## Features

- **Deposit Points:** Members can deposit money and earn points
- **Check Points:** Members can check their points balance
- **Send Reminders:** Admin can send reminders to the group
- **Daily Financial Advice:** The bot sends daily financial advice to the group
- **Redeem Points:** Members can redeem their points for rewards, subject to admin approval
- **Admin Commands:** Admin can approve or reject deposit and redemption requests, and add or subtract points for any user


## Commands

### Member Commands

- `!إيداع`: Deposit money and earn points
- `!نقاطي`: Check your points balance
- `!نصيحة`: Get the daily financial advice
- `!مكافأة`: Request a reward

### Admin Commands

- `!تذكير`: Send the reminder message to the group
- `!أرسل_التذكير`: Send the reminder message to the group
- `!أرسل_النصيحة`: Send the financial advice message to the group
- `!إضافة_نقاط` : Add points to a user
- `!طرح_نقاط `: Subtract points from a user
## Requirements

- Node.js
- npm
- Baileys
- OpenAI API Key

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Exiiro/whatsapp-expense-bot.git
   cd whatsapp-expense-bot
   ```

2. Install dependencies:

   ```sh
    npm install
   ```

3. Create a .env file in the root directory and add your OpenAI API key

      
   ```sh
    OPENAI_API_KEY=your-openai-api-key
   ```

4. Run the bot
   
   ```sh
    node index.js
   ```


   
