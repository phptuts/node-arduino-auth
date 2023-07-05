var express = require("express");
var dotenv = require("dotenv");
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Board, Led } = require("johnny-five");
const board = new Board();
let led;

dotenv.config();

const { sequelize, UserModel } = require("./db");

var app = express();
app.use(express.json());

async function auth(req, res, next) {
  const token = req.headers?.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send("");
  }
  const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
  var user = await UserModel.findByPk(payload.userId);
  if (user) {
    next();
    return;
  }
  res.status(403).send("");
}

app.post("/users", async (req, res) => {
  const { password, email } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  await UserModel.create({ password: hashPassword, email });

  res.status(201).send({ email });
});

app.post("/login", async (req, res) => {
  const { password, email } = req.body;
  var user = await UserModel.findOne({ where: { email } });

  if (!user) {
    res.status(401).send({ msg: "failed to auth." });
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(401).send({ msg: "failed to auth." });
    return;
  }

  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    userId: user.id,
  };

  const token = jwt.sign(data, jwtSecretKey);

  res.send({ token });
});

app.get("/led/:state", auth, (req, res) => {
  if (req.params.state === "on") {
    led.on();
  } else {
    led.off();
  }
  res.send("ok");
});

board.on("ready", () => {
  // Create a standard `led` component instance
  led = new Led(13);

  app.listen(3000, async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: true });
      console.log("working");
    } catch (e) {
      console.log(e, "error");
    }
  });
});
