const { format } = require('date-fns');
const { v4: uuid } = require('uuid');


const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const CustomEmitter = require("./CustomEmitter");
const customEmitter = new CustomEmitter();

const logEvents = async (message) => {
    const dateTime = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\r\n`;
    console.log(logItem);
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', 'eventLog.log'), logItem);
    } catch (err) {
        console.error(err);
    }
}

const logErrors = async (errorMessage) => {
    const dateTime = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${errorMessage}\r\n`;
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', 'errorsLog.log'), logItem);
    } catch (err) {
        console.error(err);
    }
}

const requestLogger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`);
    next();
}

const errorsLogger = (err, req, res, next) => {
    logErrors(`${err.name}: ${err.message}`);
    next();
}

customEmitter.on('log', message => logEvents(message));
customEmitter.on('error', message => logErrors(message));

module.exports = { requestLogger, customEmitter, errorsLogger };