const address_model = require('../../../../models/address');
module.exports = function(app) {
    app.get('/wallet/list', async (req, res) => {
        try {
            if(req.cookies.sid){
                const data = await address_model.find({sid:req.cookies.sid});
                if (data.length == 1 && data[0].wallet.address.length > 10) {
                    var renderData = data[0].wallet_list

                    var renderData = renderData.map(item => ({
                        name_wl: item.name_wl,
                        address: item.address
                    }));
                    res.render('home/1/wallet_change/wallet_list', renderData);
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
