const fs = require('fs')
const path = require('path')
const homeDir = process.env.HOME || require('os').homedir()
const dbPath = path.join(homeDir, '.todo')

function read (path = dbPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { flag: 'a+' }, (err, data) => {
      if (err) return reject(err)
      return resolve(JSON.parse(data.toString() || '[]'))
    });
  })

}
function write (list, path = dbPath) {
  return new Promise((resolve, reject) => {
    if (!list instanceof Array) {
      return reject(new Error('数据写入类型有误，请检查后再试！'))
    }
    fs.writeFile(path, JSON.stringify(list), err => {
      if (err) return reject(err);
      return resolve()
    })
  })
}

module.exports = {read, write}

