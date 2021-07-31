const express = require('express');
const axios = require('axios');

const app = express();
const ExpressError = require("./expressError");
app.use(express.json());

app.get("/", function(req,res){
  return res.send("<h1>Hello world!</h1>")
});

app.post('/', async function(req, res, next) {
  try {
    const devList = req.body.developers;
    // devList.forEach( dev => console.log(dev))
    // console.log(`devList: ${devList}`)

    // let results = devList.map( async (dev) => {
    //   link = `https://api.github.com/users/${dev}`;
    //   console.log(link);
    //   return await axios.get(link)
    //     .then(res => {
    //       console.log(`res.data from axios.get: ${res.data}`);
    //       return res.data;
    //     })
    //     .catch( e=>console.error(e) );
    // });
    devPromises = createDevPromises(devList);
    



    // let devPromises = [];
    // for (let i=0; i<devList.length; i++){
    //   // console.log(`devList length: ${devList.length}`);
    //   devPromises.push(
    //     axios.get(`https://api.github.com/users/${devList[i]}`)
    //     );
    //   }
      
    // console.log(`devPromises length: ${devPromises.length}`);
      
    let devResponses = await createDevResponses(devPromises);
    



    // devPromises = await axios.get(`https://api.github.com/users/${devList[0]}`);

    // console.log(`results: ${devPromises}`);
    // console.log(`results data: ${devPromises.data}`);
    // const output = devPromises.map((result) => ({
    //   name: result.data.name,
    //   bio: result.data.bio,
    // }));
    // console.log(`output: ${output}`)

    const output = await userData(devResponses);
    console.log(`output: ${output[0]}`)
    console.log(`output: ${output[1]}`)
    return res.json(output);
  } catch {
    next();
  }
});

app.listen(3000, ()=> {
  console.log("Starting up on port 3000");
});

function createDevPromises(devList) {
  let arr = [];
  for (let i = 0; i < devList.length; i++){
    link = `https://api.github.com/users/${devList[i]}`;
    console.log(`link: ${link}`)
    arr.push(axios.get(link));
  }
  return arr;
}
async function createDevResponses(promises){
  arr =[];
  await Promise.all(promises)
    .then((res) => {
      // console.log(`res from promise ${res}`)
      res.forEach((response) => {
        // console.log(response.data);
        arr.push(response);
      });
    })
    .catch((err) => console.log(err));
  return arr;
}

function userData(responses) {
  return responses.map( (res)=> {
    console.log(`userData: ${res}`)
    return {
     "bio": res.data.bio,
     "name": res.data.name
    }
  });
}
