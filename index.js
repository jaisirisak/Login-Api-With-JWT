const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const fs = require("fs");
const jwt = require("jwt-simple");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;

const app = express();
const secretKey = "LoginKey";
let userrawdata = fs.readFileSync("user.json");
let user = JSON.parse(userrawdata);
let menurawdata = fs.readFileSync("menu.json");
let menuList = JSON.parse(menurawdata);
let username = ""
app.use(bodyParser.json());

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: secretKey
};

const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
  const arr1 = user.filter(d => d.username === payload.sub);
  if (arr1.length > 0) {
    done(null, true);
  } else {
    done(null, false);
  }
});

passport.use(jwtAuth);
const requireJWTAuth = passport.authenticate("jwt", { session: false });

app.post("/getMenuList", requireJWTAuth, (req, res) => {
  username = req.body.username;
  const arrmenu = menuList.filter(d => d.username === username);
  if (arrmenu.length > 0) {
    res.send(arrmenu[0].menu);
  } else {
    res.send("Dont have Username");
  }
});

const loginMiddleWare = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  const arruserlogin = user.filter(d => d.username === username);
  if (arruserlogin.length > 0) {
    if (arruserlogin[0].password === password) {
      next();
    } else {
      res.send("Wrong password");
    }
  } else {
    res.send("Wrong username and password");
  }
};
app.post("/login", loginMiddleWare, (req, res) => {
  let username = req.body.username;
  const payload = {
    sub: username,
    iat: new Date().getTime()
  };
  res.send(jwt.encode(payload, secretKey));
});

app.listen(3000);
console.log(`listening on port 3000`);
