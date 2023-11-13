const TronWeb = require('tronweb');
// Gọi bcryptjs
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const address_model = require('../models/address');

// Định nghĩa hàm này một cách độc lập
async function getAddressFromPrivateKey(privateKey) {
    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider("https://api.trongrid.io");
    const solidityNode = new HttpProvider("https://api.trongrid.io");
    const eventServer = new HttpProvider("https://api.trongrid.io");
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer,privateKey);

    const usdt_contract_tron = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

    try {
        console.log('Checking private key:', privateKey);
        const addressObj = tronWeb.address.fromPrivateKey(privateKey);
        console.log('Address object:', addressObj);
        const address = tronWeb.address.fromHex(addressObj);
        console.log('Address:', address);

        const abiContract = await tronWeb.trx.getContract(usdt_contract_tron);
        const contract = tronWeb.contract(abiContract.abi.entrys, usdt_contract_tron);
        const balanceUSDT  = await contract.methods.balanceOf(address).call()/Math.pow(10,6);
        console.log("USDT Balance:", balanceUSDT.toString());
        const balanceTRX =await tronWeb.trx.getBalance(address)/Math.pow(10,6);
        console.log("TRX balance:", balanceTRX);
        return {
            address: address,
            TRXBalance: balanceTRX,
            USDTBalance: balanceUSDT
        };
    } catch (error) {
        console.error('Error in getAddressFromPrivateKey:', error);
        throw error; // Throw the error to be handled where this function is called
    }
}


module.exports = function(app) {
    app.get('/', (req, res) => {
        const renderData = {
            errorMessage: "wallet",
            back: "/import-wallet",
        };
        return res.render('err',renderData);
    });
    
    app.get('/import-wallet', (req, res) => {
        res.render('import_wallet');
    });

    app.post('/import-wallet', async (req, res) => {
        const walletData = req.body.input;
        const name = req.body.name;
        const pass = req.body.pass;
        const re_pass = req.body.re_pass;
        if(req.cookies.sid){
            const existingAddress = await address_model.find({sid:req.cookies.sid});
            if (existingAddress.length == 1) {
                return home();
            }else{
                res.clearCookie('sid');
                return res.redirect('/home');
            }
        }else{
            res.clearCookie('sid');
            return res.redirect('/home');
        }
        async function home(){
        // Validate walletData here
            if(name !== "" &&pass !== "" &&walletData !== "" && name.length<30 && pass ==re_pass){
                try {
                    const data = await getAddressFromPrivateKey(walletData);
                    const sessionId = Math.random().toString(36).substring(2, 15)+Math.random().toString(36).substring(2, 15);

                    // Giả sử bạn muốn kiểm tra xem địa chỉ đã tồn tại trong DB chưa
                    const existingAddress = await address_model.find({sid:req.cookies.sid,"wallet_list.address":data.address});
                    const existingAddress1 = await address_model.find({sid:req.cookies.sid});
                    if (existingAddress.length == 0 && existingAddress1[0].wallet_list.length  <=5) {
                        await address_model.findOneAndUpdate(
                            { sid:req.cookies.sid },
                            {   
                                wallet:
                                {
                                    token: sessionId,
                                    name_wl: name,
                                    address: data.address,
                                    privateKey: walletData,
                                    pass_check: bcrypt.hashSync(pass, salt),
                                },
                                $push: {
                                    wallet_list: {
                                        token: sessionId,
                                        name_wl: name,
                                        address: data.address,
                                        privateKey: walletData,
                                        pass_check: bcrypt.hashSync(pass, salt),
                                    }
                                }
                            }
                        );
                        res.cookie('session_id', sessionId, { maxAge: 90000000000, httpOnly: true });
                        return res.redirect('/home');
                    }else{
                        if(existingAddress1[0].wallet_list.length  >5){
                            res.render('import_wallet', { error: "Only enter a maximum of 5 wallets" });
                        }else{
                            res.render('import_wallet', { error: "Wallet exists" });
                        }
                        
                    }
                } catch (error) {
                    console.log(error)
                    // Xử lý lỗi và render trang với thông báo lỗi
                    res.render('import_wallet', { error: error.message });
                }
            }else{
                return res.redirect('/import-wallet');
            }
        }
    });
};
