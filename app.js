require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
const connect = require("./database/database.js");
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
app.use(helmet.xssFilter())
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

// 서버 에러 처리
app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});


app.listen(PORT,()=>{
    console.log(`${PORT}번 포트로 서버가 열렸습니다.`)
})