const argv = require('optimist').alias('e', 'email').alias('p', 'password').argv;
const rpio = require('rpio');

// Setup PIN
const GPIO_PIN = 7; // "GPCLK0"
rpio.open(GPIO_PIN, rpio.OUTPUT, rpio.LOW);

function lightOn(turnOn) {
  const value = (turnOn) ? rpio.HIGH : rpio.LOW;
  rpio.write(GPIO_PIN, value);
}

// Setup Wire
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
    lightOn(turnOn);
  }
});

bot
  .listen()
  .then(() => console.log(`Bot is online... Client ID: ${bot.context.clientID}`))
  .catch((error) => console.error(error.message));