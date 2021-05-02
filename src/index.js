require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const config = require('./db/config');
const { connect, connection } = require('mongoose');

connect(config.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('connected...'));

const app = express();

app.use(cors({ origin: process.env.CORS }));
app.use(express.json());
app.use('/', routes);

app.listen(process.env.PORT, () => {
  console.log('working...');
});
