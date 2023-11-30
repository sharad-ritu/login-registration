const errorhandler = (err, req, res, next) => {
    const errors = {};
    if (err.code === 11000) {
        const { username, password, email, age } = req.body;
        // Duplicate key error, check which field caused the violation
        const duplicateField = Object.keys(err.keyPattern)[0];

        if (duplicateField === 'username') {
            // res.status(400).json({ error: 'Username is already in use.' });
            errors.username = 'Username is already in use.';
            return res.status(400).render('register', { errors, username, password, email, age });
        } else if (duplicateField === 'email') {
            errors.email = 'Email is already in use.';
            return res.status(400).render('register', { errors, username, password, email, age });
        } else {
          // Handle other types of unique index violations or unknown field
            return res.status(500).send('Internal Server Error');
        }
    } 
    else if (err.message === 'Invalid credentials') {
        if (err.id === 'INVALID_PASSWORD') {
            errors.invalid_pass = 'Incorrect password.';
        } 
        else if (err.id === 'USER_NOT_FOUND') {
            errors.invalid_user = 'User not found.';
        }

        errors.remainingAttempts = `Attempts Remaining: ${err.remainingAttempts}`;
        const { username, password } = req.body;
        return res.status(400).render('login', { errors, username, password });
    }
    else {
        res.status(400).json({ msg: err});
    }
};

module.exports = errorhandler;