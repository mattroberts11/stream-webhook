require("dotenv").config({ path: __dirname + "/.env" });

const express = require('express');

const app = express();

const port = process.env["PORT"];
const app_key = process.env["API_KEY"];
const secret = process.env["API_SECRET"];

const StreamChat = require("stream-chat").StreamChat;

const client = StreamChat.getInstance(app_key, secret);

console.log(app_key, secret);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req, res) => {
  res.send('in the Chat webhook handler')
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    console.log(body);
  });
})

app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})