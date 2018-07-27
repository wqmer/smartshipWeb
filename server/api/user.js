import Express from 'express'
import {responseClient} from '../util'
import Balance from '../../mongoDB/models'
import bodyParser from 'body-parser'
const router = Express.Router();

// get all balance
router.get('/getAllBalance', (req, res) => {
    Balance.find({}).then( data => {
      responseClient(res, 200, 0, 'Get request successfully', data);
    } , (e) => {
      responseClient(res);
    });
});


// get one balance
router.get('/getBalance/:id', (req, res) => {
    var id = req.params.id;  
    Balance.findOne({name: id}).then((data) => {
      responseClient(res, 200, 0, 'Get request successfully', data);
    } , (e) => {
      responseClient(res);
    });
});
  

// deposit
router.post('/deposit', (req, res) => {
     const coinType = req.body.name ;
     const despoitAmount = req.body.amount
     Balance.findOneAndUpdate({name:coinType},{ $inc: {amount:despoitAmount} },{new: true})
       .then(result=>{
           responseClient(res, 200, 0,'Deposit successfully',result)
       }).cancel(err=>{
       console.log(err);
       responseClient(res);
   });
});


// withdraw
router.post('/withdraw', (req, res) => {
      const coinType = req.body.name ;
      const despoitAmount = -req.body.amount
      Balance.findOneAndUpdate({name:coinType},{ $inc: {amount:despoitAmount} },{new: true})
        .then(result=>{
            responseClient(res, 200, 0,'Deposit successfully',result)
        }).cancel(err=>{
        console.log(err);
        responseClient(res);
    });
});


// update one currency
// app.patch('/updateCurrency/:id', (req, res) => {
//   var id = req.params.id;


//  Currency.findByIdAndUpdate(id, req.body, {new: true}).then((currency) => {
//     if (!currency) {
//       return res.status(404).send();
//     }

//     res.send({currency});
//   }).catch((e) => {
//     res.status(400).send();
//   })
// });

module.exports = router;