const { program } = require('commander');
const db = require('./db')

// program
//   .option('-d, --debug', 'output extra debugging')
//   .option('-s, --small', 'small pizza size')
//   .option('-p, --pizza-type <type>', 'flavour of pizza');
//
//
// if (program.debug) console.log(program.opts());
// console.log('pizza details:');
// if (program.small) console.log('- small pizza size');
// if (program.pizzaType) console.log(`- ${program.pizzaType}`);

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
    }).catch(() => {
      console.log('操作失败！')
    })
  });

program.parse(process.argv);
