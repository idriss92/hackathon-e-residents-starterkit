import fetch from 'isomorphic-fetch';
import format from 'string-format';
import _ from 'lodash';
import Moment from 'moment';

export var actionTable = {
  'Compute':{'start':Compute},
  'IntentGetStreamData':{'start':IntentGetStreamData},
  'IntentGetPartsStream':{'start':IntentGetPartsStream},
  'Log':{'start':Log}
};

const intent_auth_url = 'https://apidalkia.hubintent.com/oauth/token';
const intent_api_url = 'https://apidalkia.hubintent.com/api/datahub/v1/';

let intent_token;

// Intent API helpers

function GenerateIntentToken(id, secret) {
  let req = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&client_id='
      + id
      + '&client_secret='
      + secret
  };
  return fetch(intent_auth_url, req)
  .then(res => res.json())
  .then(json => json.access_token)
  .catch(ex =>
    console.log('failed to generate access token:', ex)
  );
}

function RefreshToken(id, secret) {
  return new Promise((resolve, reject) => {
    IntentRequest('', id, secret)
    .then(res => {
      if (res.status === 401) {
        console.log('Connection to the Intent API: generating authentication token');
        GenerateIntentToken(id, secret)
        .then(token => resolve(token))
        .catch(ex => {
          console.log('authentication failed:', ex);
          reject(ex);
        });
      }
      else
        resolve(intent_token);
    });
  });
}

function IntentRequest(path, id, secret) {
  let req = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + intent_token
    }
  };
  return fetch(intent_api_url + path, req);
}

// Intent API actions

function IntentGetPartsStream(requestId, agentId, input, success, failure) {
  let part;
  RefreshToken(input.client_id, input.client_secret)
  .then((response) => {
    intent_token = response;
  })
  .then(() => IntentRequest('parts/' + input.ref, input.client_id, input.client_secret))
  .then(res => res.json())
  .then(json => {
    part = json;
    return IntentRequest('parts/' + input.ref + '/streams', input.client_id, input.client_secret);
  })
  .then(res => res.json())
  .then(json => {
    Promise.all(
      _.map(json, (val, key) => {
        return IntentRequest('streams/' + val, input.client_id, input.client_secret)
        .then(res => res.json())
        .then(json => {
          let r = _.omit(json, 'address');
          r.data = {timestamp: 0, value: 0};
          return r;
        });
      })
    )
    .then( (prt) => {
      part['streams'] = prt;
      success({result: part});
    });
  })
}

function IntentGetStreamData(requestId, agentId, input, success, failure) {
  let start = Moment(input.stream.data.timestamp).format('YYYY-MM-DDTHH:mm:ss');
  let end = Moment(input.time).format('YYYY-MM-DDTHH:mm:ss');
  RefreshToken(input.client_id, input.client_secret)
  .then((response) => {
    intent_token = response;
  })
  .then(() => {
    return IntentRequest('streams/' + input.stream.streamId + '/snapshot?startTime=' + start + '&endTime=' + end + '&page=1&countByPage=744', input.client_id, input.client_secret)
    .then(res => res.json())
    .then(json => {
      return _.reduce(json.data, (res, val) => {
        return val.timestamp > res.timestamp ? val : res ;
      },input.stream.data);
    })
    .then(data => {
      success({data: data});
    });
  });
}

// Generic actions

function Compute(requestId, agentId, input, success, failure) {
  let res = eval(format( input.expression, input ));
  success({result:res});
}

function Log(requestId, agentId, input, success, failure) {
  console.log ('[craft]', format( input.message, input ) );
  success();
}
