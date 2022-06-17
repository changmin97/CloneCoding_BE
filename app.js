require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.port;
const cors = require('cors');
const connect = require("./schemas/index.js");
const morgan = require('morgan');
const helmet = require('helmet');

connect();
//라우터
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const commentsRouter = require("./routes/comments");

//미들웨어
app.use(express.json());
app.use(cors());
app.use(helmet())
app.use(morgan('tiny'))

app.use(
  "/api",
  express.urlencoded({ extended: false }),
  [postsRouter],
  [commentsRouter]
);
app.use(
  "/user",
  express.urlencoded({ extended: false }),
  [usersRouter]
);


app.listen(port,()=>{
    console.log(`${port}번 포트로 서버가 열렸습니다.`)
})