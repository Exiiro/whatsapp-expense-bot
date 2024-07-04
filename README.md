# WhatsApp Bot Project

## Description
This is a WhatsApp bot designed to manage user points, provide daily financial advice, and handle reminders and rewards. The bot interacts with OpenAI to generate daily advice and allows for admin-controlled point deposits and rewards.

## Features
- **Daily Financial Advice**: Get daily financial advice through OpenAI.
- **Monthly Reminders**: Sends monthly reminders to the group.
- **Point System**: Users can deposit points, view their points, and redeem rewards.
- **Admin Controls**: Admin can approve deposits, manage points, and send reminders and advice to the group.

## Commands
- `!إيداع [amount]`: Request to deposit points.
- `!نقاطي`: Check your points.
- `!تذكير`: Get the reminder message.
- `!نصيحة`: Get the daily advice message.
- `!أرسل_التذكير`: Admin command to send the reminder to the group.
- `!أرسل_النصيحة`: Admin command to send the advice to the group.
- `!مكافأة [reward]`: Request a reward.

## Admin Commands
- `!إضافة_نقاط [user] [points]`: Add points to a user.
- `!طرح_نقاط [user] [points]`: Subtract points from a user.
- Approval: Admin can approve or reject requests by responding with "نعم" or "لا".

## Requirements
- Node.js
- WhatsApp account
- OpenAI API key

## Installation
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up your `.env` file with your OpenAI API key, admin ID, and group ID.
4. Run the bot: `node index.js`.

## Disclaimer
This project is not final and is currently under development. Use it at your own risk.

## License
This project is licensed under the GPL-3.0 License.
