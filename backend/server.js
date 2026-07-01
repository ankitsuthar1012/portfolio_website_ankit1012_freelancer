const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        }
    }
}));

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:3000'],
    methods: ['GET', 'POST'],
}));

// Rate limiting for API routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '..')));

// =============================================
// API ROUTES
// =============================================

// Contact form endpoint
app.post('/api/contact', apiLimiter, async (req, res) => {
    try {
        const { name, email, service, budget, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required.' });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        // Length validation
        if (name.length > 100 || email.length > 100 || message.length > 2000) {
            return res.status(400).json({ error: 'Input exceeds maximum length.' });
        }

        // Sanitize inputs
        const sanitized = {
            name: sanitize(name),
            email: sanitize(email),
            service: sanitize(service || ''),
            budget: sanitize(budget || ''),
            message: sanitize(message),
            timestamp: new Date().toISOString(),
            ip: req.ip
        };

        // Store message (in-memory for demo; replace with DB in production)
        messages.push(sanitized);

        // Optional: Send email notification
        if (process.env.NOTIFICATION_EMAIL) {
            await sendNotificationEmail(sanitized);
        }

        console.log(`[${sanitized.timestamp}] New contact from: ${sanitized.name} (${sanitized.email})`);

        res.status(200).json({
            success: true,
            message: 'Message received! I\'ll get back to you within 24 hours.'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

// Get all messages (protected - admin only)
app.get('/api/messages', (req, res) => {
    const adminKey = req.headers['x-admin-key'];

    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json({ messages, total: messages.length });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// =============================================
// IN-MEMORY STORAGE (Replace with DB for production)
// =============================================
const messages = [];

// =============================================
// EMAIL NOTIFICATION (Optional - configure in .env)
// =============================================
async function sendNotificationEmail(data) {
    // Using nodemailer if configured
    try {
        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.NOTIFICATION_EMAIL,
            subject: `New Portfolio Contact: ${data.name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Service:</strong> ${data.service || 'Not specified'}</p>
                <p><strong>Budget:</strong> ${data.budget || 'Not specified'}</p>
                <p><strong>Message:</strong></p>
                <p>${data.message}</p>
                <hr>
                <p><small>Received at: ${data.timestamp}</small></p>
            `,
        });

        console.log('Notification email sent successfully');
    } catch (error) {
        console.warn('Email notification failed (non-critical):', error.message);
    }
}

// =============================================
// HELPERS
// =============================================
function sanitize(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}

// =============================================
// START SERVER
// =============================================
app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════╗
    ║   Portfolio Server Running!              ║
    ║   Local:  http://localhost:${PORT}       ║
    ║   Status: Ready to accept connections    ║
    ╚══════════════════════════════════════════╝
    `);
});

module.exports = app;
