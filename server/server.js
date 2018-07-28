
const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
  console.log('Server is up!');
});



// import path from 'path'
// import Express from 'express'
// import httpProxy from 'http-proxy'
// import compression from 'compression'
// import connectHistoryApiFallback from 'connect-history-api-fallback'
// import config from '../config/config'
// import path from 'path'


// const port = config.port;

// const app = new Express();


// app.use('/api',(req,res)=>{
//     proxy.web(req,res,{target:targetUrl})
// });

// app.use('/',Express.static(path.join(__dirname,"..",'build')));
// // app.use('/', connectHistoryApiFallback());

// const targetUrl = `http://${config.apiHost}:${config.apiPort}`;
// const proxy = httpProxy.createProxyServer({
//     target:targetUrl
// });


// app.listen(port,(err)=>{
//     if(err){
//         console.error(err)
//     }else{
//         console.log(`===>open http://${config.host}:${config.port} in a browser to view the app`);
//     }
// });