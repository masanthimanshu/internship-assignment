import express from "express";
import fs from "node:fs";
import sendOtp from "./sendOtp.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

// Reading Mock Database

const obj = JSON.parse(fs.readFileSync("./database.json"));
const id = obj.data.length + 1;

// Temporary Array

var temp = { data: [] };

// Signup Function

function signup(name, email, pass) {
  obj.data.push({
    id,
    name,
    email,
    pass,
  });
  fs.writeFile("./database.json", JSON.stringify(obj), (err) => {
    if (err) {
      return err;
    }
  });
  return obj;
}

// Login Function

function login(email, pass) {
  for (let i = 0; i < obj.data.length; i++) {
    if (obj.data[i].email == email) {
      if (obj.data[i].pass == pass) {
        return { message: "Login Successfull" };
      } else {
        return { message: "Login Failed" };
      }
    } else {
      continue;
    }
  }
  return { message: "Login Failed" };
}

// Forget Password Function

function forgetPass(otp, email) {
  for (let i = 0; i < obj.data.length; i++) {
    if (obj.data[i].email == email) {
      var num = obj.data[i].id;
      temp.data.push({
        num,
        otp,
        email,
      });
      var msg = sendOtp(otp, email);

      fs.writeFile("./temp.json", JSON.stringify(temp), (err) => {
        if (err) {
          console.log(err);
        }
      });

      return msg;
    }
  }
}

// REST API Routes

app.post("/signup", (req, res) => {
  const { name } = req.body;
  const { email } = req.body;
  const { pass } = req.body;

  const otp = Math.round(Math.random() * 999999);

  temp.data.push({
    name,
    email,
    pass,
    otp,
  });

  const msg = sendOtp(otp, email);

  fs.writeFile("./temp.json", JSON.stringify(temp), (err) => {
    if (err) {
      console.log(err);
    }
  });

  res.send(msg);
});

app.post("/verify-signup", (req, res) => {
  const { otp } = req.body;
  var msg;

  const temp = JSON.parse(fs.readFileSync("./temp.json"));

  const name = temp.data[0].name;
  const email = temp.data[0].email;
  const pass = temp.data[0].pass;

  if (otp == temp.data[0].otp) {
    msg = signup(name, email, pass);
  } else {
    msg = { message: "Incorrect OTP" };
  }

  res.send(msg);
});

app.post("/login", (req, res) => {
  const { email } = req.body;
  const { pass } = req.body;

  const loginvar = login(email, pass);
  res.send(loginvar);
});

app.post("/forget", (req, res) => {
  const { email } = req.body;
  const otp = Math.round(Math.random() * 999999);

  const msg = forgetPass(otp, email);
  res.send(msg);
});

app.post("/verify-forget", (req, res) => {
  const { otp } = req.body;
  const { pass } = req.body;

  var tabid;

  const temp = JSON.parse(fs.readFileSync("./temp.json"));

  if(otp == temp.data[0].otp) {
    tabid = temp.data[0].num - 1 ;

    obj.data[tabid].pass = pass;

    fs.writeFile("./database.json", JSON.stringify(obj), (err) => {
      if (err) {
        return err;
      }
    });
  }

  res.send (obj.data[tabid]);
});

app.listen(port, () => {
  console.log(`Active On Port ${port}`);
});
