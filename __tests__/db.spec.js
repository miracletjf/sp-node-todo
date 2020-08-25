const db = require('../db')
const fs = require('fs')
jest.mock('fs')

describe('db', () => {
  beforeEach(()=> {
    fs.clearData()
  })
  it('can be read', async () => {
    const data = [{name: 'xxx', age: 20}]
    fs.setReadFileMock('/xxx', null, JSON.stringify(data))
    const list = await db.read('/xxx')
    expect(list).toEqual(data)
  })
  it('can be write', async () => {
    let fakeData
    fs.setWriteFileMock('/yyy',(path, data, callback) => {
      fakeData = data
      callback(null)
    })
    const list = [{name: 'ggg', age: 16}, {name: 'sss', age: 24}]
    await db.write(list, '/yyy')
    expect(fakeData).toBe(JSON.stringify(list))
  })
})
