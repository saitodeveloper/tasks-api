const path = require('path')
require('dotenv').config({
    path: path.resolve(`${__dirname}/../.env`)
})
const url = process.env['MONGO_URL']
const databaseName = process.env['MONGO_DB']

const config = {
    mongodb: {
        url,
        databaseName,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    migrationsDir: './migrations',
    changelogCollectionName: "changelog",
    migrationFileExtension: ".js",
    useFileHash: false,
    moduleSystem: 'commonjs'
}

module.exports = config
