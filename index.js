const { program } = require('commander');
const fs = require('fs')
const path = require('path')
const homeDir = process.env.HOME || require('os').homedir()
const dbPath = path.join(homeDir, '.todo')

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
  .action(({ args }) => {
    const task = args.join(' ')
    console.log('add a task');
    console.log(task)

    fs.readFile(dbPath, { flag: 'a+' }, (err, data) => {
      if (err) throw err;
      const todoStr = data.toString() || '[]'
      const todoList = JSON.parse(todoStr)
      console.log(todoList)
      todoList.push({
        title: task,
        isFinish: false
      })
      fs.writeFile(dbPath, JSON.stringify(todoList), err => {
        if (err) throw err;
        console.log('success')
      })
    });
  });

// 清除 todo
program
  .command('clear')
  .description('clear todo list')
  .action(() => {
    fs.writeFile(dbPath, '[]', err => {
      if (err) throw err;
      console.log('success')
      fs.readFile(dbPath, (error, data) => {
        if (error) throw error;
        console.log(data.toString())
      })
    })
  });

program.parse(process.argv);

if (process.argv.length === 2) {
  console.log('show all')
}
