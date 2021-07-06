const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./utils/db');

const invalidRouteHandler = require('./middlewares/invalid-route-handler');
const authCheck = require('./middlewares/auth-check');
const errorHandler = require('./middlewares/error-handler');

const postRouter = require('./routes/post.router');
const authRouter = require('./routes/auth.router');
const profileRouter = require('./routes/profile.router');
const connectionRouter = require('./routes/connection.router');

const app = express();

db.init();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({
    message: "Hello Express app"
  });
});

app.use('/auth',authRouter);
app.use('/post', authCheck, postRouter);
app.use('/profile', authCheck, profileRouter);
app.use('/connection', authCheck, connectionRouter);

app.use(invalidRouteHandler);
app.use(errorHandler);

app.listen(3000, () => {
  console.log('server started');
});