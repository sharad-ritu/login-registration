const rateLimit = require('express-rate-limit');
const session = require('express-session');

const getKey = (req) => {
    return `${req.ip}-${req.headers['user-agent']}`;
};

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    keyGenerator: getKey, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
});

module.exports = { limiter, sessionMiddleware };