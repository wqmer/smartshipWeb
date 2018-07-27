import Express from 'express'
import {responseClient} from '../util'
import Balance from '../../mongoDB/models'
import bodyParser from 'body-parser'
const router = Express.Router();

router.post('/addcrypto', (req, res) => {
    let balance = new Balance({
        name : req.body.name,
        amount: 0
    });
        balance.save().then( data=>{
        responseClient(res,200,0,'add new crypto successfully', data)
    }).cancel(err=>{
        console.log(err);
        responseClient(res);
    });
});


module.exports = router;