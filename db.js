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
function write (list) {
  return new Promise((resolve, reject) => {
    if (!list instanceof Array) {
      return reject(new Error('数据写入类型有误，请检查后再试！'))
    }
    fs.writeFile(dbPath, JSON.stringify(list), err => {
      if (err) return reject(err);
      return resolve()
    })
  })
}

module.exports = {read, write}

