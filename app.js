const express = require('express');
const app = express();
const {create} = require('express-handlebars');
require('dotenv').config();

const connectDb = require('./db/connect');
const routes = require('./routes/routes');
const errorhandler= require('./middleware/error-handler');

app.use(express.json());
// Set up Handlebars as the template engine
const hbs = create({ /* config */ });

// Register `hbs.engine` with the Express app.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

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