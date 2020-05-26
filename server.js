const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

const shoplist_routes = require('./routes/shoppingList_Route');
const indexRoute = require('./routes/user_Route')



//mongoose
mongoose.connect(process.env.DATABASE_URL11 /*CHANGEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE */ || 'mongodb://localhost/New_shoppingList_App', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

mongoose.connection.on('connected', () =>{
    console.log('Mongoose is connected!')
});


//Data parsing
app.use(cors());
app.use(express.json()); // json body parser
app.use(express.urlencoded({extended: false})); //if using proxy server to send json packages

//HTTP request logger
app.use(morgan('tiny'));
app.use('/api', shoplist_routes);
app.use('/', indexRoute);

if (process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


app.listen(PORT, console.log(`Server is listering ${PORT}`));

// from package.json in client/package.json to have to connection to server.
// ,
//   "proxy": "http://localhost:8000"

//"heroku-postbuild": "npm run install-client && npm run build"
//"build": "cd client && npm run build",
// "build": "cd client && npm run build",
// "install-client": "cd client && npm install",