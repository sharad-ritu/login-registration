const errorhandler = (err, req, res, next) => {
    console.log(err);
    if (err.code === 11000) {
        // Duplicate key error, check which field caused the violation
        const duplicateField = Object.keys(err.keyPattern)[0];

        if (duplicateField === 'username') {
            res.status(400).json({ error: 'Username is already in use.' });
        } else if (duplicateField === 'email') {
            res.status(400).json({ error: 'Email is already in use.' });
        } else {
          // Handle other types of unique index violations or unknown field
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = errorhandler;