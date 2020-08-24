const fs = jest.genMockFromModule('fs')
const _fs = jest.requireActual('fs')

let readMockData = {}

fs.setReadFileMock = (path, err, data) => {
  readMockData[path] = [err, data]
}
fs.readFile = (path, options, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = null
  }
  if (path in readMockData) {
    callback(...readMockData[path])
  } else {
    _fs.readFile(path, options, callback)
  }
}

fs.clearData = () => {
  readMockData = {}
}

module.exports = fs
