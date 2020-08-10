const fs = require('fs')
const path = require('path')
const homeDir = process.env.HOME || require('os').homedir()
const dbPath = path.join(homeDir, '.todo')

function read () {
  return new Promise((resolve, reject) => {
    fs.readFile(dbPath, { flag: 'a+' }, (err, data) => {
      if (err) return reject(err)
      return resolve(JSON.parse(data.toString() || '[]'))
    });
  })

}
function write (text) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dbPath, text, err => {
      if (err) return reject(err);
      return resolve()
    })
  })
}

module.exports = {read, write}

