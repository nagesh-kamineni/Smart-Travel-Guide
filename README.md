# Smart Travel Guide — React + Express

## Run the project

Open two terminals in the project folder.

### Terminal 1 — backend
```bash
npm install
npm run server
```

### Terminal 2 — React
```bash
npm run dev
```

Open:
`http://localhost:5173`

You can also install `concurrently` and run:
```bash
npm run dev:full
```

## Real Forgot Password Email

The project now includes a real Express + Nodemailer email-reset flow.

### Gmail setup

1. Use a Gmail account that you control.
2. Turn on 2-Step Verification for that Google account.
3. Create a Google App Password.
4. Copy `server/.env.example` to `server/.env`.
5. Fill in:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_16_character_google_app_password
MAIL_FROM=Smart Travel Guide <yourgmail@gmail.com>
FRONTEND_URL=http://localhost:5173
```
6. Restart `npm run server`.

When a registered user enters their email on Forgot Password, the backend sends a real reset email. The link opens `/reset-password?token=...`, where the user sets a new password.

### Important
Do NOT put your normal Gmail password in `.env`. Use a Google App Password.

The current backend stores users and reset tokens in memory for development. Restarting the backend clears them. For a production project, connect this API to a database and use a stronger password hashing method such as bcrypt/Argon2 plus persistent reset-token storage.
