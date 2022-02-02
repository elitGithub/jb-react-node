require('./db/mongoose');
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const port = process.env.PORT || 3006;
const { requestLogger, errorsLogger, logEvents } = require('./middleware/logEvents');
const rootRouter = require('./routes/root');
const usersRouter = require('./routes/users');
const vacationsRouter = require('./routes/vacations');

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(requestLogger);
app.use(passport.initialize());
app.use(passport.session());
const whiteList = ['http://127.0.0.1:3000', 'http://127.0.0.1', 'http://localhost:3500', 'http://localhost:3000'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS policy.'));
        }
    },
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'build/')));
app.use(rootRouter);
app.use('/api/users/', usersRouter);
app.use(vacationsRouter);

app.all('*', (req, res) => {
    res.redirect('/');
});

app.use(errorsLogger);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${ port }`)
});
