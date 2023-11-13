const address_model = require('../models/address');

async function check_fee(privateKey,toAddress,amount) {
    const TronWeb = require('tronweb');
    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider("https://api.trongrid.io");
    const solidityNode = new HttpProvider("https://api.trongrid.io");
    const eventServer = new HttpProvider("https://api.trongrid.io");
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer,privateKey);

    const usdt_contract_tron = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

    try {
        const addressObj = tronWeb.address.fromPrivateKey(privateKey);
        const address = tronWeb.address.fromHex(addressObj);
 
        var functions = 'transfer(address,uint256)';
        var options = {};
        var parameter = [{
            type: 'address',
            value: toAddress
        }, {
            type: 'uint256',
            value: Number(amount)*1000000
        }];
        var issuerAddress = tronWeb.address.toHex(address);

        const tx = await tronWeb.transactionBuilder.triggerSmartContract(usdt_contract_tron, functions,options,parameter,issuerAddress);    
        const signature = await tronWeb.trx.sign(tx.transaction);
        var bandwidth = estimateBandwidth(signature); //bandwidth sử dụng
        const txConstant = await tronWeb.transactionBuilder.triggerConstantContract(usdt_contract_tron, functions,options,parameter,issuerAddress);
        var energy_used = txConstant.energy_used; //energy sử dụng
        var TRXFees = (bandwidth*1000 + energy_used*420)/Math.pow(10,6); //phí TRX
        console.log("fee: ",TRXFees);
        return {
            address: address,
            toAddress:toAddress,
            amount:amount,
            TRXFees: TRXFees
        };
    } catch (error) {
        console.error('Error in getAddressFromPrivateKey:', error);
        throw error; // Throw the error to be handled where this function is called
    }
}

module.exports = function(app) {
    app.post('/usdt/fee', async (req, res) => {
        const toAddress = req.body.toAddress;
        const amount = req.body.amount.replace(/,/g, "");;

        try {
            if(req.cookies.sid){
                const existingAddress = await address_model.find({sid:req.cookies.sid});
                if (existingAddress.length == 1) {
                    if (req.cookies.session_id) {
                        const data = await address_model.findOne({ sid: req.cookies.sid, token: req.cookies.session_id }).exec();
                        if (data) {
                            var privateKey = data[0].privateKey[0]
                            return home(privateKey,toAddress,amount);
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
            res.render('usdt_fee', { error: error.message });
        }
        
        async function home(privateKey,toAddress,amount){
            // Validate walletData here
            if(privateKey !== "" &&toAddress !== "" &&amount !== "" && !isNaN(amount)){
                const data = await check_fee(privateKey,toAddress,amount);
                var renderData = {
                    address: data.address,
                    toAddress: data.toAddress,
                    amount: data.amount,
                    TRXFees: data.TRXFees
                }
                res.render('home', renderData);
            }else{
                res.render('usdt_fee', { error: "error data" });
            }
        }
        
    })
}

{
    a:"a",
    b:"b",
    wallet[
        {
            trx:"abv",
            usdt: "abv"
        },
        {
            trx:"abav",
            usdt: "aabv"
        }
        
    ]
}