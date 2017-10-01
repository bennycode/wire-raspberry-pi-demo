const argv = require('optimist').alias('e', 'email').alias('p', 'password').argv;

const {Account} = require('@wireapp/core');
const {StoreEngine} = require('@wireapp/store-engine');

const login = {
  email: argv.email,
  password: argv.password,
};

const path = `${process.cwd()}/temp/${login.email}`;
const engine = new StoreEngine.FileEngine(path, {fileExtension: '.json'});

const bot = new Account(login, engine);

bot.on(Account.INCOMING.TEXT_MESSAGE, ({conversation, content}) => {
  const sequence = '/';

  if (content.startsWith(sequence)) {
    const begin = content.indexOf(sequence) + sequence.length;
    const command = content.substr(begin).toLowerCase();
    const turnOn = (command === 'on') ? true : false;
    if (turnOn) {
      bot.sendTextMessage(conversation, 'Light on!');
    } else {
      bot.sendTextMessage(conversation, 'Light off!');
    }
  }
});

bot
  .listen()
  .then(() => console.log(`Bot is online... Client ID: ${bot.context.clientID}`))
  .catch((error) => console.error(error.message));