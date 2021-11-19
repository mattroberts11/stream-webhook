const express = require('express');
const cors = require('cors');
const StreamChat = require('stream-chat').StreamChat;

require('dotenv').config({ path: '../.env' })

const app = express();
const port = 4000;

const appKey = process.env.REACT_APP_STREAM_API_KEY;
const secret = process.env.REACT_APP_STREAM_API_SECRET;
// Initialize Stream chat server client
// https://getstream.io/chat/docs/javascript/tokens_and_authentication/?language=javascript
const serverClient = StreamChat.getInstance(appKey, secret);

app.use(cors());
app.use(express.json());

app.get('/server', (req, res) => {
    // Server running test
    res.send(`Hola Mundo!`);
})

app.post('/token', async (req, res) => {
    console.log('REQUEST', req.body);
    // get the userId from the front end body
    const { userId } = req.body;

    const token = serverClient.createToken(
        userId,
        // Math.floor(Date.now() / 1000) + (60 * 60) // expires in 1 hr
    );
    
    try {
        res.status(200).send(token);
    } catch (err) {
        res.status(500).send("Error getting token", err);
    }
})

app.post('/delete-user', (req, res) => {

  console.log("delete user request", req.body);
  
  const { userId } = req.body;

  const destroyUser = async (userId) => {
    return await serverClient.deleteUser(userId, {
      delete_conversation_channels: true, 
      mark_messages_deleted: true, 
      hard_delete: true,
    })
  }

  try {
    destroyUser(userId)
      // .then( response => console.log("DELETE USER RESPONSE", response))
      .then( response => res.status(200).send(response))
      
  } catch (err) {
    res.status(500).send('Error deleting user', err)
  }

})

app.listen(port, () => {
    console.log(`webhooks app listening on port ${port}`);
})
