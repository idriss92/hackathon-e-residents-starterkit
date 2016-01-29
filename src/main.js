import craftai from 'craft-ai';
import {actionTable} from './actions';
import loadCfg from './loadCfg';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import Moment from 'moment';

const intent_auth_url = 'https://apidalkia.hubintent.com/oauth/token';
const intent_api_url = 'https://apidalkia.hubintent.com/api/datahub/v1/';

let time = 1420064000000;

function registerActions(instance) {
  return Promise.all(
    _.map(actionTable, (obj, key)=>{
      return instance.registerAction(key, obj.start, obj.cancel);
    })
  );
}

loadCfg()
.then(config => craftai(_.merge(config, {destroyOnExit: false}), {time: time, client_id: config.intentClientId, client_secret: config.intentClientSecret}))
.then(instance => {
  console.log(`'${instance.id}' successfully created!`);
  return instance.createAgent('bts/IntentExample.bt', {})
    .then(agent => console.log(`agent #${agent.id} created.`))
    .then(() => registerActions(instance))
    .then(() => {
      instance.update(500)
      setInterval(() => {
        time = time + 432000000; // add 5 days every tick
        instance.updateInstanceKnowledge({time: time, isoTime: Moment(time).format('YYYY-MM-DDTHH:mm:ss')}, 'merge');
      }, 500)
    })
    .catch((err) => {
      console.log(`Error during the instance lifetime, check 'https://workbench.craft.ai/instances/${instance.cfg.owner}/${instance.cfg.name}/${instance.cfg.version}/${instance.id}/monitor' for further information.`);
      console.log(err);
    });
})
.catch((err) => {
  console.log(err);
});
