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
})
