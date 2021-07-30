const express = require('express');
const axios = require('axios');

const app = express();
const ExpressError = require("./expressError");
app.use(express.json());

app.get("/", function(req,res){
  return res.send("<h1>Hello world!</h1>")
});

app.post('/', function(req, res, next) {
  try {
    const devList = req.body.developers;
    console.log(`devList: ${devList}`)
    let results = devList.map( dev => {
      link = `https://api.github.com/users/${dev}`;
      console.log(link);
      return axios.get(link)
        .then(res => {
          console.log(`res.data from axios.get: ${res.data}`);
          return res.data;
        })
        .catch( e=>console.error(e) );
    });

    Promise.all(results)
      .then( res => console.log(`res from promise ${res}`));

    console.log(`results: ${results}`)
    const output = results.map( (user) => ({ name: user.name, bio: user.bio }));
    console.log(`output: ${output}`)
    return res.json(output);
  } catch {
    next();
  }
});

app.listen(3000, ()=> {
  console.log("Starting up on port 3000");
});