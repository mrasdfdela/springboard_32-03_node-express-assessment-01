const axios = require("axios");
const fs = require("fs");

function readUrls(path) {
  fs.readFile(path, "utf8", async (err, data) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    const urls = data.toString().split("\n");

    urls.forEach( async (url) => {
      html = await getHtml(url);
      if (html) {
        fileName = hostName(url);
        console.log(fileName);
        fs.writeFile(`file${fileName}.txt`, html.data, "utf8", (err) => {
          if (err) {
            console.error(err);
            process.exit(1);
          }
          console.log(`Wrote to ${fileName}.txt`);
        });
      }
    });
  });
}

async function getHtml(url){
  try {
    html = await axios.get(url);
    return html
  } catch(e) {
    console.log(`Couldn't download ${url}`)
    return false;
  }
}

function hostName(url){
  noHttp = url.split("//")[1];
  host = noHttp.split("/")[0];
  return host
};

let path = process.argv[2];
readUrls(path)