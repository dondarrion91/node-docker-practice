const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const cors = require("cors");
const RedisStore = require("connect-redis")(session);

const app = express();
const port = process.env.PORT || 3000;
const {
  SECRET,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_IP,
  REDIS_URL,
  REDIS_PORT,
} = require("./config/config");

const redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  main().catch((err) => {
    console.log(err);
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

app.enable("trust proxy");
app.use(cors());
app.use(
  session({
    store: new RedisStore({
      client: redisClient,
    }),
    secret: SECRET,
    cookie: {
      maxAge: 60000,
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
    },
  })
);

app.use(express.json());

async function main() {
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
  });

  console.log("Connected to mongo");
}

app.get("/api/v1/", (req, res) => {
  res.send("<h1>Welcome to the blog api man now!!!!!!!!</h1>");
  console.log("Yea it run!")
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, () => console.log(`listening on port ${port}`));
