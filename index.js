const db = require('./db')
const inquirer = require('inquirer')


module.exports.add = async function (task) {
  if (!task.trim()) throw new Error('参数错误！')
  const todoList = await db.read()
  todoList.push({title: task, isFinish: false})
  await db.write(todoList)
}

module.exports.clear = async function () {
  await db.write([])
}

module.exports.showAll = async function () {
  const todoList = await db.read()
  printTaskList(todoList)
}

function printTaskList (todoList) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'index',
        message: '你想要执行的操作是？',
        choices: [
          {name: '退出', value: -2},
          ...todoList.map((item, index) => ({
            name: `[ ${item.isFinish ? 'X':'_'} ] （${index + 1}）${item.title}`,
            value: index
          })),
          {name: '+ 创建任务', value: -1}
        ],
      }
    ])
    .then((answers) => {
      const index = answers.index
      if (index > -1) return askForAction(todoList, index)
      if( index === -1) return executeCreate(todoList)
    });
}

function executeCreate (todoList) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: '请输入任务名称'
      }
    ])
    .then(async (answers) => {
      try {
        const title = answers.title.toString().trim()
        if (title) {
          todoList.push({title: answers.title, isFinish: false})
          await db.write(todoList)
          console.log('操作成功！')
        } else {
          console.log('任务名称输入有误，请重试！')
        }
      } catch (e) {
        console.log('操作失败！')
      } finally {
        printTaskList(todoList)
      }

    });
}


function askForAction (todoList, index) {
  const actions = {markAsDone, markAsUndone, updateTitle, remove}
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: '请选择执行的操作',
        choices: [
          { name: '退出', value: 'quite' },
          { name: '已完成', value: 'markAsDone' },
          { name: '未完成', value: 'markAsUndone' },
          { name: '改标题', value: 'updateTitle' },
          { name: '删除', value: 'remove' }
        ]
      }
    ])
    .then(async (answers) => {
      const action = actions[answers.action]
      await action && action(todoList, index)
      printTaskList(todoList)
    });
}

function markAsDone(todoList, index) {
  todoList[index].isFinish = true
  return db.write(todoList)
}
function markAsUndone(todoList, index) {
  todoList[index].isFinish = false
  return db.write(todoList)
}
async function updateTitle(todoList, index) {
  await inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: '请输入新任务名'
      }
    ])
    .then(async (answers) => {
      const title = answers.title.toString().trim()
      if (title) {
        todoList[index].title = title
        await db.write(todoList)
      }
    });
}
function remove(todoList, index) {
  todoList.splice(index, 1)
  return db.write(todoList)
}
