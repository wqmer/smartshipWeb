
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