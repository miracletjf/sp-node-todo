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
        name: 'index',
        message: '你想要执行的操作是？',
        choices: [
          {
            name: '退出',
            value: -2
          },
          ...todoList.map((item, index) => ({
            name: `[${item.isFinish ? 'X':'_'}] ${index + 1} ${item.title}`,
            value: index
          })),
          {
            name: '+ 创建任务',
            value: -1
          }
        ],
      }
    ])
    .then((answers) => {
      const index = answers.index
      if (index > -1) {
        ackQuestionFormItemOperate(todoList, index)
      }
      if( index === -1) {
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
        message: '请输入任务名称'
      }
    ])
    .then((answers) => {
      const title = answers.title.toString().trim()
      if (title) {
        todoList.push({title: answers.title, isFinish: false})
        db.write(JSON.stringify(todoList))
      }
    });
}

function ackQuestionFormItemOperate (todoList, index) {
  const actions = {markAsDone, markAsUndone, updateTitle, remove}
  inquirer
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
    .then((answers) => {
      const action = actions[answers.action]
      action && action(todoList, index)
    });
}

function markAsDone(todoList, index) {
  todoList[index].isFinish = true
  db.write(JSON.stringify(todoList))
}
function markAsUndone(todoList, index) {
  todoList[index].isFinish = false
  db.write(JSON.stringify(todoList))
}
function updateTitle(todoList, index) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: '请输入新任务名'
      }
    ])
    .then((answers) => {
      const title = answers.title.toString().trim()
      if (title) {
        todoList[index].title = title
        db.write(JSON.stringify(todoList))
      }
    });
}
function remove(todoList, index) {
  todoList.splice(index, 1)
  db.write(JSON.stringify(todoList))
}

program.parse(process.argv);
