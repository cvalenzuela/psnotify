/*
Send a SMS whenever your new job finishes 
*/

const path = require('path');
const os = require('os');
const fs = require('fs');
const paperspace = require('paperspace-node')();
const twilio = require('twilio');
const prompt = require('prompt');
const colors = require("colors/safe");
const PSUser = require('../node_modules/paperspace-node/lib/userConfig');

prompt.message = colors.cyan("---->");

const configDir = path.resolve(os.homedir(), '.paperspace');
const configFileName = path.resolve(configDir, 'config.json');

// Check if user is signed in Paperspace
const verifyPaperspaceUser = (done) => {
  const PSUsername = PSUser.getName();
  const PSKey = PSUser.getApiKey();
  if (!PSUsername || !PSKey) {
    console.log('You are not logged in into Paperspace, please login!');
    prompt.start();
    prompt.get(['Paperspace Email', 'Paperspace Password', 'Paperspace API Token'], (err, results) => {
      paperspace.login.user({
        email: results['Paperspace Email'],
        password: results['Paperspace Password'],
        apiToken: results['Paperspace API Token']
      }, (err, res) => {
        if (err) {
          console.eror(`There was an error login into Paperspace ${err}`);
          return;
        }
        console.log('You are now logged in into Paperspace');
        done();
      });
    });
  } else {
    done();
  }
}

// Check if user is signed in in Twilio
const verifyTwilioUser = (done) => {
  const configFile = JSON.parse(fs.readFileSync(configFileName, 'utf8'));
  if (!configFile.twilio) {
    configFile.twilio = {};
    console.log('Please configure your Twilio account.');
    prompt.start();
    prompt.get(['Twilio Account Sid', 'Twilio Token', 'Twilio From Number', 'Your Phone Number'], (err, results) => {
      configFile.twilio.accountSid = results['Twilio Account Sid'];
      configFile.twilio.authToken = results['Twilio Token'];
      configFile.twilio.fromNumber = results['Twilio From Number'];
      configFile.twilio.toNumber = results['Your Phone Number'];
      fs.writeFileSync(configFileName, JSON.stringify(configFile, null, 2) + '\n');
      done();
    });
  } else {
    done();
  }
}

const sendMessage = (message, jobId) => {
  const configFile = JSON.parse(fs.readFileSync(configFileName, 'utf8'));
  const client = new twilio(configFile.twilio.accountSid, configFile.twilio.authToken);
  client.messages.create({
    body: message,
    to: configFile.twilio.toNumber,
    from: configFile.twilio.fromNumber
  });
}

const waitForJobStatusToChange = (jobId, jobName) => {
  console.log(`All set! You will receive an SMS when your ${jobId} is ready`);
  paperspace.jobs.waitfor({ jobId, state: 'Stopped' }, (err, res) => {
    sendMessage(`Yo! Your Paperspace ${jobName} (id: ${jobId}) is completed!`, jobId);
  });
  paperspace.jobs.waitfor({ jobId, state: 'Failed' }, (err, res) => {
    if (err) {
      sendMessage(`Ups! something went wrong with ${jobName} (${jobId}): ${err}`, jobId);
    }
  });
}

const setTwilio = (options) => {
  verifyPaperspaceUser(() => {
    const configFile = JSON.parse(fs.readFileSync(configFileName, 'utf8'));
    configFile.twilio = options;
    fs.writeFileSync(configFileName, JSON.stringify(configFile, null, 2) + '\n');
    console.log('All Set!');
  })
}

const init = (jobId) => {
  verifyPaperspaceUser(() => {
    verifyTwilioUser(() => {
      if (jobId === 'config') {
        console.log('All set!');
      } else {
        paperspace.jobs.show({ jobId }, (err, res) => {
          if (!res.name) {
            console.log(`${jobId} is not a valid job Id.`);
          } else {
            waitForJobStatusToChange(jobId, res.name);
          }
        });
      }
    })
  });
}

// From spawn
// const args = process.argv;
// init(args[2]);

exports.init = init;
exports.setTwilio = setTwilio;