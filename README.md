# WhatsApp Expense Bot

## Description
WhatsApp Expense Bot is designed to help manage user points, provide financial advice, and handle reminders and rewards within a WhatsApp group. This bot uses the Baileys library for WhatsApp Web API, integrates OpenAI for financial advice, and supports various commands for users and admins.

## Features
- Manage user points based on expenses.
- Provide daily financial advice using OpenAI.
- Send monthly reminders for payments.
- Redeem points for rewards with admin approval.
- Admin functionalities to manage reminders, approve requests, and adjust points.

## Installation

### Prerequisites
- Node.js
- npm (Node Package Manager)
- WhatsApp account

### Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/Exiiro/whatsapp-expense-bot.git
    cd whatsapp-expense-bot/expense-bot
    ```

2. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    OPENAI_API_KEY=your_openai_api_key
    ADMIN_ID=000000000000@s.whatsapp.net
    GROUP_ID=000000000000-0000000000@g.us
    ```

3. Initialize the project and install dependencies:
    ```bash
    npm init -y
    npm install @whiskeysockets/baileys @hapi/boom pino qrcode-terminal node-cron dotenv openai
    ```

4. Start the bot:
    ```bash
    node index.js
    ```

## Usage

### Commands
- `!إيداع [amount]`: Deposit points based on the specified amount. The request will be sent to the admin for approval.
- `!نقاطي`: Check your current points.
- `!تذكير`: Send the reminder message to the group (admin only).
- `!نصيحة`: Get the daily financial advice.
- `!أرسل_التذكير`: Admin command to send the reminder to the group.
- `!أرسل_النصيحة`: Admin command to send the daily advice to the group.
- `!تغيير_التذكير [message]`: Admin command to change the reminder message.
- `!مكافأة [reward]`: Redeem points for a specified reward. The request will be sent to the admin for approval.

### Admin Approvals
When a user requests to deposit points or redeem a reward, the admin will receive a private message with a prompt to approve or deny the request. Based on the admin's decision, the points will be adjusted accordingly.

## Disclaimer
This project is not final and is currently under development. NOT FULLY WORKING YET!!!.

## License
This project is licensed under the GPL-3.0 License.
