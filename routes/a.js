const address_model = require('../models/address');
module.exports = function(app) {
    app.post('/import-wallet', async (req, res) => {
        const walletData = req.body.input;
        const name = req.body.name;
        const pass = req.body.pass;
        const re_pass = req.body.re_pass;
        try {
            if(req.cookies.sid){
                const existingAddress = await address_model.find({sid:req.cookies.sid});
                if (existingAddress.length == 1 && existingAddress[0].wallet.address.length > 10) {
                    if (req.cookies.session_id) {
                        const data = await address_model.findOne({ sid: req.cookies.sid, token: req.cookies.session_id }).exec();
                        if (data) {
                            return home();
                        } else {
                            res.status(404).send({ kq: 0, msg: 'No data found' });
                        }
                    }
                }else{
                    res.clearCookie('sid');
                    return res.redirect('/home');
                }
            }else{
                res.clearCookie('sid');
                return res.redirect('/home');
            }
        }catch (error) {
            console.error(error);
            res.render('import_wallet', { error: error.message });
        }
        
        async function home(privateKey,toAddress,amount){
            // Validate walletData here
            if(privateKey !== "" &&toAddress !== "" &&amount !== "" && name.length<30 && pass ==re_pass){
                
            }else{
                res.render('import_wallet', { error: "error data" });
            }
        }
    })
}