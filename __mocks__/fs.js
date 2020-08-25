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

let writeMockData = {}

fs.setWriteFileMock = (path, fn) => {
  return writeMockData[path] = fn
}

fs.writeFile = (path, data, callback) => {
  if (path in writeMockData) {
    writeMockData[path](path, data, callback)
  } else {
    _fs.writeFile(path, data, callback)
  }
}

fs.clearData = () => {
  readMockData = {}
}

module.exports = fs
