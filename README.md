# Paperspace SMS Notification

> A small library that uses Twilio to send an SMS when a job finishes running in Paperspace. 

<p align="center">
    <img src="static/demo.svg">
</p>

## Usage

1) Install the package. You should also have the [Paperpsace API](https://www.paperspace.com/api) installed.
```
npm install -g psnotify
```

2) Sign up for [Twilio](). You will need to [get a number]((https://support.twilio.com/hc/en-us/articles/223135247-How-to-Search-for-and-Purchase-Twilio-Phone-Numbers-from-Console))(cost = $1) and [Token and Auth Keys](https://support.twilio.com/hc/en-us/articles/223136027-Auth-Tokens-and-how-to-change-them) for your account.

3) Config psnotify, run:

```
psnotify config
```

<p align="center">
    <img src="static/settwilio.svg">
</p>

4) Run a Paperspace Job and enable `psnotify`

```
paperspace jobs create --container Test-Container --machineType C2 --command 'ls' --project 'Traininig takes time'
```

Once your job is running you will get a `jobId`, use that as the argument to enable the notification.

```
psnotify YOUR_JOB_ID
```

5) Get an SMS when your job is ready!

<p align="center">
    <img width=400 src="static/sms.jpg">
</p>

If you have not set up your Paperspace account, `psnotify` will prompt you to do so. You can also set up Twilio credentials like this:

```
psnotify twilio --accountSid XXX --authToken YYY --toNumber +123456789 --fromNumber +123456789
```

## License

MIT