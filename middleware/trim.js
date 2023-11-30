const trim = (req, res, next) => {
    for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].replace(/\s+/g, '');
        }
    }
    next();
};

module.exports = trim;