const fs = require("fs");
let userrawdata = fs.readFileSync('user.json');
let user = JSON.parse(userrawdata);

const arr1 = user.filter(d => d.username === "jaisirisak");
console.log(arr1);