import express from 'express';
import Tweeter from './tweeter'
require('dotenv').config();

const app = express();
const port = process.env.PORT;
app.get('/tweet/tweet', (req, res) => {
  Tweeter.tweet();
  res.send('done')
});
app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
