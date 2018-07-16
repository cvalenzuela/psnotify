#!/usr/bin/env node

const psnotify = require('../lib/index.js');

const args = process.argv.splice(process.execArgv.length + 2);
const jobOrConfig = args[0];

if (jobOrConfig && jobOrConfig.includes('twilio')) {
  const options = {};
  options[args[1].substring(2)] = args[2];
  options[args[3].substring(2)] = args[4];
  options[args[5].substring(2)] = args[6];
  options[args[7].substring(2)] = args[8];
  if (options.fromNumber && options.toNumber && options.authToken && options.accountSid) {
    psnotify.setTwilio(options);
  } else {
    console.log('The Twilio arguments are not valid');
  }
} else {  
  psnotify.init(jobOrConfig);
}