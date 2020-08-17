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
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'index',
            message: 'What do you want to do?',
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
          console.log(answers)
        });
    }).catch(() => {
      console.log('操作失败！')
    })
  });

program.parse(process.argv);
