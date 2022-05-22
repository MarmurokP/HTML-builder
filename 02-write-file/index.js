const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });
const util = require('util');

const question = util.promisify(rl.question).bind(rl);
const filePath = path.normalize('02-write-file/text.txt');


fs.writeFile(filePath, '', (err) => {
  console.error(err);
});

async function promtExmpl() {
  try {
    const answer = await question(
      'Enter text:\n',
    );
    if (answer === 'exit') {
      process.exit();
    } else {
      fs.appendFile(filePath, `${`${answer}\n`}`, (err) => {
        console.error(err);
      });
    }
    promtExmpl();
  } catch (err) {
    console.error(err);
  }
}
promtExmpl();

process.on('exit', () => {
  console.log('Promt finished');
});