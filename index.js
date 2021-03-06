require("dotenv").config();
let express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    dbConfig = require('./db/database'),
    Bcrypt = require('bcryptjs');

// Connecting mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true
}).then(() => {
        console.log('Database connected')
    },
    error => {
        console.log('Database could not be connected : ' + error)
    }
)


// Setting up express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

// Api root
const loginRoute = require('./Login/login.routes');
app.use('/admin', loginRoute);

const cofirespaceroute = require('./cofirespace/cofirespace.routes');
app.use('/admin', cofirespaceroute)

// const bookingRoute = require('./booking/booking.routes');
// app.use('/users', bookingRoute)

const usersRoute = require('./customers/users.routes');
app.use('/users', usersRoute)

// const emailRoute = require('./emailverifucation/email.routes');
// app.use('/email', emailRoute)

app.route('/hashpassword/:id').get((req,res) => {
    let password = req.params.id;
    res.json({
        hash: Bcrypt.hashSync(password, 10)
    })
})
// Create port
const port = process.env.PORT || 8080;

// Conectting port
const server = app.listen(port, () => {
    console.log('server is listening on the port ',process.env.PORT)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Index Route
app.get('/', (req, res) => {
    console.log("Welcome")
    res.send('invaild endpoint');
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});

// Static build location
app.use(express.static(path.join(__dirname, 'dist')));

