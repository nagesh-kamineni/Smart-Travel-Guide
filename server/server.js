import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Development user/reset store. Users are persisted so restarting the server
// does not erase registered accounts. For production, use a real database.
const dataDir = path.join(__dirname, "data");
const usersFile = path.join(dataDir, "users.json");
const packagesFile = path.join(dataDir, "packages.json");
const bookingsFile = path.join(dataDir, "bookings.json");
fs.mkdirSync(dataDir, { recursive: true });
for (const file of [usersFile, packagesFile, bookingsFile]) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "[]", "utf8");
}

function loadUsers() {
  try {
    const raw = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    return new Map(Object.entries(raw));
  } catch {
    return new Map();
  }
}

function saveUsers() {
  fs.writeFileSync(usersFile, JSON.stringify(Object.fromEntries(users), null, 2), "utf8");
}
function loadJsonArray(file) {
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(raw) ? raw : [];
  } catch { return []; }
}
function saveJsonArray(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2), "utf8");
}

const users = loadUsers();
const resetTokens = new Map();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

function emailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, emailConfigured: emailConfigured() });
});

app.post("/api/signup", (req, res) => {
  const { name, email, phone, dob, gender, state, address, travelTypes, budget, interests, guideBio, guideExpertise, languages, experience, qualification, additionalInterests, password, role } = req.body;
  const accountRole = role === "guide" ? "guide" : "user";

  const commonValid = name && email && phone && dob && gender && state && address && password;
  const guideValid = guideBio && guideExpertise && languages && experience;
  const travellerValid = Array.isArray(travelTypes) && travelTypes.length > 0 && budget;
  if (!commonValid || (accountRole === "guide" ? !guideValid : !travellerValid)) {
    return res.status(400).json({ message: "Please complete all required fields for your selected account type." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (users.has(normalizedEmail)) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  // Demo only: password is stored as a hash rather than plain text.
  const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
  users.set(normalizedEmail, {
    name, email: normalizedEmail, phone, dob, gender, state, address,
    travelTypes: Array.isArray(travelTypes) ? travelTypes : [], budget: budget || "", interests: interests || "",
    guideBio: guideBio || "", guideExpertise: guideExpertise || "", languages: languages || "", experience: experience || "", qualification: qualification || "", additionalInterests: additionalInterests || "",
    role: accountRole, passwordHash
  });
  saveUsers();

  res.status(201).json({ message: "Account created successfully." });
});


app.put("/api/profile", (req, res) => {
  const { email, name, phone, dob, gender, state, address, travelTypes, budget, interests, guideBio, guideExpertise, languages, experience, qualification, additionalInterests } = req.body;
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const user = users.get(normalizedEmail);
  if (!user) return res.status(404).json({ message: "Account not found." });
  if (!name || !phone || !dob || !gender || !state || !address) return res.status(400).json({ message: "Please complete the required personal information." });
  if (user.role === "guide" && (!guideBio || !guideExpertise || !languages || !experience)) return res.status(400).json({ message: "Please complete the required guide profile information." });
  Object.assign(user, { name, phone, dob, gender, state, address, travelTypes: Array.isArray(travelTypes) ? travelTypes : user.travelTypes || [], budget: budget || user.budget || "", interests: interests || "", guideBio: guideBio || "", guideExpertise: guideExpertise || "", languages: languages || "", experience: experience || "", qualification: qualification || "", additionalInterests: additionalInterests || "" });
  saveUsers();
  const { passwordHash: _, ...safeUser } = user;
  res.json({ message: "Profile updated successfully.", user: safeUser });
});

app.post("/api/login", (req, res) => {
  const { email, password, role } = req.body;
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const user = users.get(normalizedEmail);

  if (!user) return res.status(401).json({ message: "No account found with this email. Please sign up first." });

  const accountRole = user.role || "user";
  if (role && accountRole !== role) {
    return res.status(403).json({ message: `This account is registered as a ${accountRole === "guide" ? "Local Guide" : "Traveller"}. Please select the correct account type.` });
  }

  const passwordHash = crypto.createHash("sha256").update(String(password || "")).digest("hex");
  if (passwordHash !== user.passwordHash) return res.status(401).json({ message: "Incorrect password." });

  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// Package and booking data is persisted on the server so traveller bookings
// are visible to the Local Guide even when the two accounts use different browsers.
app.get("/api/guide/packages", (req, res) => {
  const guideEmail = String(req.query.guideEmail || "").trim().toLowerCase();
  const all = loadJsonArray(packagesFile);
  res.json(guideEmail ? all.filter(p => String(p.guideEmail || "").toLowerCase() === guideEmail) : all);
});

app.post("/api/guide/packages", (req, res) => {
  const pkg = req.body || {};
  if (!pkg.guideEmail || !pkg.name || !pkg.startDate || !pkg.endDate || !pkg.price || !pkg.description || !Array.isArray(pkg.places) || !pkg.places.length) {
    return res.status(400).json({ message: "Please complete all package details and select at least one place." });
  }
  const all = loadJsonArray(packagesFile);
  const record = { ...pkg, id: pkg.id || crypto.randomUUID(), createdAt: pkg.createdAt || new Date().toISOString() };
  all.unshift(record);
  saveJsonArray(packagesFile, all);
  res.status(201).json({ package: record });
});

app.delete("/api/guide/packages/:id", (req, res) => {
  const all = loadJsonArray(packagesFile);
  saveJsonArray(packagesFile, all.filter(p => p.id !== req.params.id));
  res.json({ message: "Package deleted." });
});

app.get("/api/bookings", (req, res) => {
  const guideEmail = String(req.query.guideEmail || "").trim().toLowerCase();
  const travellerEmail = String(req.query.travellerEmail || "").trim().toLowerCase();
  let all = loadJsonArray(bookingsFile);
  if (guideEmail) all = all.filter(b => String(b.guideEmail || "").toLowerCase() === guideEmail);
  if (travellerEmail) all = all.filter(b => String(b.travellerEmail || "").toLowerCase() === travellerEmail);
  res.json(all);
});

app.post("/api/bookings", (req, res) => {
  const booking = req.body || {};
  if (!booking.packageId || !booking.guideEmail || !booking.travellerEmail || !booking.packageName) {
    return res.status(400).json({ message: "Booking information is incomplete." });
  }
  const all = loadJsonArray(bookingsFile);
  const activeForPackage = all.filter(b => b.packageId === booking.packageId && b.status !== "Cancelled");
  if (activeForPackage.some(b => String(b.travellerEmail).toLowerCase() === String(booking.travellerEmail).toLowerCase())) {
    return res.status(409).json({ message: "You have already booked this package." });
  }
  if (booking.maxTravellers && activeForPackage.length >= Number(booking.maxTravellers)) {
    return res.status(409).json({ message: "This package is fully booked." });
  }
  const record = { ...booking, id: booking.id || crypto.randomUUID(), status: booking.status || "Confirmed", bookedAt: booking.bookedAt || new Date().toISOString() };
  all.unshift(record);
  saveJsonArray(bookingsFile, all);
  res.status(201).json({ booking: record });
});

app.post("/api/forgot-password", async (req, res) => {
  const normalizedEmail = String(req.body.email || "").trim().toLowerCase();
  const user = users.get(normalizedEmail);

  // This app is being used as a local project, so give a clear result.
  // Do not claim that an email was sent when there is no registered account.
  if (!user) {
    return res.status(404).json({ message: "No account found with this email. Please sign up first." });
  }

  if (!emailConfigured()) {
    return res.status(503).json({
      message: "Email service is not configured. Add SMTP settings to server/.env first."
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  resetTokens.set(token, {
    email: normalizedEmail,
    expiresAt: Date.now() + 15 * 60 * 1000
  });

  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: normalizedEmail,
      subject: "Smart Travel Guide — Reset Your Password",
      text: `Hello ${user.name},\n\nUse this link to reset your Smart Travel Guide password:\n${resetUrl}\n\nThis link expires in 15 minutes.\n\nIf you did not request this, you can ignore this email.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:28px;color:#10264a">
          <h2 style="color:#1465f5">Smart Travel Guide</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to reset your password.</p>
          <p><a href="${resetUrl}" style="display:inline-block;background:#1465f5;color:#fff;padding:12px 22px;border-radius:7px;text-decoration:none">Reset Password</a></p>
          <p>This link expires in <strong>15 minutes</strong>.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>`
    });

    res.json({ message: "Reset link sent successfully." });
  } catch (err) {
    console.error("Email send failed:", err);
    resetTokens.delete(token);
    res.status(500).json({ message: "Could not send the reset email. Check your SMTP settings." });
  }
});

app.post("/api/reset-password", (req, res) => {
  const { token, password } = req.body;
  const record = resetTokens.get(token);

  if (!record || record.expiresAt < Date.now()) {
    resetTokens.delete(token);
    return res.status(400).json({ message: "This reset link is invalid or has expired." });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ message: "Password must contain at least 8 characters." });
  }

  const user = users.get(record.email);
  if (!user) return res.status(400).json({ message: "Account no longer exists." });

  user.passwordHash = crypto.createHash("sha256").update(password).digest("hex");
  saveUsers();
  resetTokens.delete(token);
  res.json({ message: "Password updated successfully." });
});

app.listen(PORT, () => {
  console.log(`Smart Travel Guide API running at http://localhost:${PORT}`);
});
