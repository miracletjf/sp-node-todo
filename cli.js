const { program } = require('commander');
const api = require('./index')

// 新增 todo
program
  .command('add')
  .description('add a task')
  .action(async ({ args }) => {
    const task = args.join(' ')
    api.add(task).then(() => {
      console.log('添加成功！')
    }).catch(() => {
        console.log('添加失败！')
      })
  });

// 清除 todo
program
  .command('clear')
  .description('clear todo list')
  .action(() => {
    api.clear().then(() => console.log('操作成功！'))
      .catch(() => console.log('操作失败！'))
  });

program
  .command('ls')
  .description('show all list')
  .action( () => {
    void api.showAll()
  });

program.parse(process.argv);
