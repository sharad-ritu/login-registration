const express = require('express');
const app = express();
const {engine} = require('express-handlebars');
require('dotenv').config();

const connectDb = require('./db/connect');
const routes = require('./routes/routes');
const errorhandler= require('./middleware/error-handler');
const trim = require('./middleware/trim');
const { sessionMiddleware, limiter } = require('./middleware/rate-limit');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));

app.use(limiter);
app.use(sessionMiddleware);
app.use(trim);
app.use('/', routes);
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