import readline from 'readline';
import fs from 'fs';
import _ from 'lodash';

const CONFIGURATION_FILE = './config.json';

export default function loadConfiguration() {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const defaultCfg = {
    owner: 'craft-ai',
    name: 'craft-ai-starterkit-nodejs',
    version: 'master',
    appId: 'MY_APP_ID',
    appSecret: 'MY_APP_SECRET',
  };

  console.log('Please enter your craft ai project informations (press <ENTER> to use the default value)');
  return new Promise((resolve, reject) => fs.readFile(
    CONFIGURATION_FILE,
    (err, data) => {
      if (err) {
        resolve(defaultCfg);
      }
      else {
        resolve(_.defaults(JSON.parse(data), defaultCfg));
      }
    }))
    .then((config) => new Promise((resolve, reject) => rl.question(
      ` * Project owner: (${config.owner}) `,
      answer => resolve(_.isEmpty(answer) ? config : _.set(config, 'owner', answer))
    )))
    .then((config) => new Promise((resolve, reject) => rl.question(
      ` * Project name: (${config.name}) `,
      answer => resolve(_.isEmpty(answer) ? config : _.set(config, 'name', answer))
    )))
    .then((config) => new Promise((resolve, reject) => rl.question(
      ` * Version: (${config.version}) `,
      answer => resolve(_.isEmpty(answer) ? config : _.set(config, 'version', answer))
    )))
    .then((config) => new Promise((resolve, reject) => rl.question(
      ` * Application ID: (${config.appId}) `,
      answer => resolve(_.isEmpty(answer) ? config : _.set(config, 'appId', answer))
    )))
    .then((config) => new Promise((resolve, reject) => rl.question(
      ` * Application Secret: (${config.appSecret}) `,
      answer => resolve(_.isEmpty(answer) ? config : _.set(config, 'appSecret', answer))
    )))
    .then((config) => new Promise((resolve, reject) => rl.question(
      ` * Intent Client ID: (${config.intentClientId}) `,
      answer => resolve(_.isEmpty(answer) ? config : _.set(config, 'intentClientId', answer))
    )))
    .then((config) => new Promise((resolve, reject) => rl.question(
      ` * Intent Client Secret: (${config.intentClientSecret}) `,
      answer => resolve(_.isEmpty(answer) ? config : _.set(config, 'intentClientSecret', answer))
    )))
    .then((config) => {
      rl.close();
      return new Promise((resolve, reject) => fs.writeFile(
        CONFIGURATION_FILE,
        JSON.stringify(config, null, 2),
        (err) => {
          if (err) {
            reject(err);
          }
          console.log(`Configuration saved to '${CONFIGURATION_FILE}', next time you won't have to enter anything.`);
          resolve(config);
      }));
    });
};
