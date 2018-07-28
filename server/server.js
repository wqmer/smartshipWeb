const path = require('path');
const express = require('express');
const compression = require ('compression')
const httpProxy = require ('http-proxy')
const connectHistoryApiFallback = require('connect-history-api-fallback')
const config = require('../config/config')

const publicPath = path.join(__dirname, '..', 'public');
const app = express();
const port = process.env.PORT || 3000;

const proxy = httpProxy.createProxyServer({ target:config.apiUrl, changeOrigin: true});

app.use(express.static(publicPath));

app.use('/api',(req,res)=> proxy.web(req,res,{target: config.apiUrl})   );

app.use(compression());

app.use('/', connectHistoryApiFallback());

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});//this router place in the final lane


app.listen(port, () => {
  console.log(`Server is up on port : ${port}`);
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