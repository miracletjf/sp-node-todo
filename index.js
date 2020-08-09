const { program } = require('commander');

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
  });

// 清除 todo
program
  .command('clear')
  .description('clear todo list')
  .action(() => {
    console.log('clear todo list');
  });

program.parse(process.argv);

if (process.argv.length === 2) {
  console.log('show all')
}
