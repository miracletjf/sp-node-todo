const { program } = require('commander');
const inquirer = require('inquirer')
const db = require('./db')

// 新增 todo
program
  .command('add')
  .description('add a task')
  .action(async ({ args }) => {
    const task = args.join(' ')
    try {
      const todoList = await db.read()
      todoList.push({title: task, isFinish: false})
      await db.write(JSON.stringify(todoList))
      console.log('操作成功！')
    } catch (e) {
      console.log('操作失败！')
    }
  });

// 清除 todo
program
  .command('clear')
  .description('clear todo list')
  .action(async () => {
    try {
      await db.write('[]')
      console.log('操作成功！')
    } catch (e) {
      console.log('操作失败！')
    }
  });

program
  .command('ls')
  .description('show all list')
  .action(async () => {
    db.read().then(todoList => {
      console.log('show all')
      console.log(todoList)
      askQuestionForListOperate(todoList)
    }).catch(() => {
      console.log('操作失败！')
    })
  });

function askQuestionForListOperate (todoList) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'key',
        message: '你想要执行的操作是？',
        choices: [
          {
            name: '退出',
            value: -1
          },
          ...todoList.map((item, index) => ({
            name: `[${item.isFinish ? 'X':'_'}] ${index + 1} ${item.title}`,
            value: index
          })),
          {
            name: '+ 创建任务',
            value: -2
          }
        ],
      }
    ])
    .then((answers) => {
      const key = answers.key
      if (key === -1) {
        return false
      }
      if (key === -2) {
        executeCreate(todoList)
      }
    });
}

function executeCreate (todoList) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'How many do you need?'
      }
    ])
    .then((answers) => {
      if (answers.title.toString().trim()) {
        todoList.push({title: answers.title, isFinish: false})
        db.write(JSON.stringify(todoList))
      }
    });
}



program.parse(process.argv);
