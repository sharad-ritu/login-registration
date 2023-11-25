const express = require('express');
const app = express();
const {engine} = require('express-handlebars');
require('dotenv').config();

const connectDb = require('./db/connect');
const routes = require('./routes/routes');
const errorhandler= require('./middleware/error-handler');

app.use(express.json());

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

// Example: Setting Content-Type header for CSS files
app.use(express.static('public'));

app.use('/', routes);
app.get('/index', (req, res) => {
    res.render('index', { layout: false});
});
app.use(errorhandler);

const port = 5000;

const start = async () => {
    try {
        await connectDb(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();