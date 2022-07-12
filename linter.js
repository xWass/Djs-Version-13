const fs = require('fs');
const child_process = require('child_process');

const slash = fs.readdirSync('./slashcmds').filter((file) => file.endsWith('.js'));
const legacy = fs.readdirSync('./legacycmds').filter((file) => file.endsWith('.js'));

for (const file of slash) {
  child_process.exec(`npx eslint ./slashcmds/${file} --fix`);
}

for (const file of legacy) {
  child_process.exec(`npx eslint ./legacycmds/${file} --fix`);
}
