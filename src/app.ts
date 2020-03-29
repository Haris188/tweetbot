import express from 'express';
import Tweeter from './tweeter'
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.get('/tweet/tweet', (req, res) => {
  Tweeter.tweet();
  res.send('done')
});
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
