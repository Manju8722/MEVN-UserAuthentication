const express = require('express');
const env = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const path = require('path');
const optionsCors = require('./config/cors');
const connectDB = require('./config/database');
const credentials = require('./middleware/credentials');
const errorsHandler = require('./middleware/error_handler');
const authorisation = require('./middleware/authorisation');
const router = require('./routes/api/auth');

const app = express();

connectDB();

// allow credentials    
app.use(credentials);

app.use(cors(optionsCors));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.json());

app.use('/static', express.static(path.join(__dirname, 'public',)));


app.use(errorsHandler);

// routers handeler
app.use(authorisation);

app.use('/routes/api', router);

// not exist request handler

app.all('*', (req, res) => {

    if (req.accepts('application/json')) {
        res.status(404).json({ "error": "uri handler not found" });
    }
    else {
        res.status(404).send('404 data not found');
    }
})

const port = 3500;

// exceutes once database connection is established 
mongoose.connection.once('open', () => {
    console.log("database connection succesfully established");
    app.listen(port, () => {
        console.log("listening on port" + port);
    })

})
