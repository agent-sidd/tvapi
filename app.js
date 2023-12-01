const express = require('express');
const bodyParser = require('body-parser');
const parser = require('iptv-playlist-parser')
const fs  =  require('fs')
const axios = require('axios');


const app = express();
const PORT = process.env.PORT || 3000;
// Middleware to parse JSON in requests
app.use(bodyParser.json());

app.get('/', (req,res)=>{
   res.send("tvAPI");
})
app.get('/getlistbycnt', async (req, res) => {
    const uri = 'https://iptv-org.github.io/iptv/countries/'+req.query.cat+'.m3u'; 
    console.log(uri)
  
    try {
      // Make an HTTP GET request to the URI
      const response = await axios.get(uri, { responseType: 'stream' });
  
      // Pipe the response stream to a file (e.g., save it locally)
      const filePath = 'downloadedFile.txt';
      const fileStream = fs.createWriteStream(filePath);
      response.data.pipe(fileStream);
  
      // Wait for the file to finish writing
      await new Promise((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
      });
  
    
    } catch (error) {
      console.error('Error fetching or saving file:', error);
      
    }
    
    const fileContent = fs.readFileSync('downloadedFile.txt', 'utf-8')
    const result = parser.parse(fileContent)
    const regex = /(\[[^\]]+\]|\([^\)]+\))/g;
    const jsonData= []; 
    result.items.forEach((it)=>{
     var name  = it.name.replace(regex, '') 
     var group = it.group.title
     var logo = it.tvg.logo
     var tvurl= it.url 
     var item = {
     name:`${name}`,
     group:`${group}`,
     logo:`${logo}`,
     tvurl:`${tvurl}`,
     };
     jsonData.push(item)
    })
   res.json(jsonData)
  });
  //get by cat
  app.get('/getlistbycat', async (req, res) => {
    const uri = 'https://iptv-org.github.io/iptv/categories/'+req.query.cat+'.m3u'; 
    console.log(uri)
  
    try {
      // Make an HTTP GET request to the URI
      const response = await axios.get(uri, { responseType: 'stream' });
  
      // Pipe the response stream to a file (e.g., save it locally)
      const filePath = 'downloadedFile.txt';
      const fileStream = fs.createWriteStream(filePath);
      response.data.pipe(fileStream);
  
      // Wait for the file to finish writing
      await new Promise((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
      });
  
    
    } catch (error) {
      console.error('Error fetching or saving file:', error);
      
    }
    
   const fileContent = fs.readFileSync('downloadedFile.txt', 'utf-8')
    
    const result = parser.parse(fileContent)
    const regex = /(\[[^\]]+\]|\([^\)]+\))/g;
    const jsonData= []; 
    result.items.forEach((it)=>{
     var name  = it.name.replace(regex, '') 
     var group = it.group.title
     var logo = it.tvg.logo
     var tvurl= it.url 
     var item = {
     name:`${name}`,
     group:`${group}`,
     logo:`${logo}`,
     tvurl:`${tvurl}`,
     };
     jsonData.push(item)
    })
   res.json(jsonData)
  });
// Start the server
const awake= async()=>{
  const resp =  await fetch('https://tvapi275.onrender.com')
  return resp;
}
setInterval(()=>{
  awake()
}, 5000)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
