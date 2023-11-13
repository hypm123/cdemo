const TronWeb = require('tronweb');

module.exports = function(app) {
    app.post('/usdt/fee', async (req, res) => {
        const toAddressTron = req.body.toAddress;
        const amount_tron = req.body.amount;
        if(req.cookies.sid){
            const existingAddress = await address_model.find({sid:req.cookies.sid});
            if (existingAddress.length == 1) {
                if (req.cookies.session_id) {
                    try {
                        const data = await address_model.findOne({ sid: req.cookies.sid, token: req.cookies.session_id }).exec();
                        if (data) {
                            var privateKeyTron = data[0].privateKey[0]
                            return home();
                        } else {
                            res.status(404).send({ kq: 0, msg: 'No data found' });
                        }
                    } catch (error) {
                        console.error(error);
                        res.render('import_wallet', { error: error.message });
                    }
                } else {
                    res.render('en_first');
                }
            }else{
                res.clearCookie('sid');
                return res.redirect('/home');
            }
        }else{
            var currentTime = new Date();
            var currentTimeString = currentTime.toISOString();
            var sid = currentTimeString + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const existingAddress = await address_model.findOne({sid:req.cookies.sid});
            if (!existingAddress) {
                const newObj = {
                    sid:sid
                };
                await address_model.create(newObj);
                res.cookie('sid', sid, { expires: new Date(253402300000000), httpOnly: true }); // Thời gian sống gần vô hạn
                return res.redirect('/home');
            }else{
                res.clearCookie('sid');
                return res.redirect('/home');
            }
        }
        async function home(){
            
        }
       
    });
};
