const path = require('path')
const winston = require('winston')

function makeLogger (level, format, file) { // <1>
    return {
        level: level,
        format: makeFormat(format),
        transports: [
            makeTransportFile(file),
            ...(process.env.LOG_CONSOLE === '1' ? [makeTransportConsole()] : [])
        ],
    }
}

function makeFormat (format) { // <2>
    if (format === 'json') {
        return makeFormatJson()
    } else if (format === 'raw') {
        return makeFormatRaw()
    } else {
        throw new TypeError(`invalid format: '${format}'`)
    }
}

function makeFormatJson (level, file, format) { // <3>
    return winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    )
}

function makeFormatRaw (level, file, format) { // <4>
    return winston.format.printf(({message}) => message)
}

function makeTransportFile (filename) { // <5>
    const dirname = process.env.LOG_DIRNAME || path.join(process.cwd(), 'log')

    if (process.env.LOG_ROTATION === '1') {
        return new winston.transports.File({
            dirname,
            filename,
            maxsize: 10 * 1024 * 1024,
            maxFiles: 10,
            tailable: true,
        })
    } else {
        return new winston.transports.File({
            dirname,
            filename,
        })
    }
}

function makeTransportConsole () { // <6>
    return new winston.transports.Console({
        format: makeFormatRaw(),
    })
}

module.exports.makeLogger = makeLogger
module.exports.makeFormat = makeFormat
module.exports.makeFormatJson = makeFormatJson
module.exports.makeFormatRaw = makeFormatRaw
module.exports.makeTransportFile = makeTransportFile
module.exports.makeTransportConsole = makeTransportConsole
