const TronWeb = require('tronweb');
const address_model = require('../../models/address');

// Định nghĩa hàm này một cách độc lập
async function getAddressFromPrivateKey(privateKey) {
    const TronWeb = require('tronweb');
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
        const rate_trx = await rateUSD("TRX")
        const rate_USDT = await rateUSD("USDT")
        const balance  = Number(rate_trx)*Number(balanceTRX) + Number(rate_USDT)*Number(balanceUSDT)
        return {
            address: address,
            TRXBalance: balanceTRX,
            USDTBalance: balanceUSDT,
            USDBalance: parseFloat(balance.toFixed(2))
        };
    } catch (error) {
        console.error('Error in getAddressFromPrivateKey:', error);
        throw error; // Throw the error to be handled where this function is called
    }
}

async function rateUSD(symbol_coin) { //TRX , USDT
    const axios = require('axios');
    const API_KEY = '89fb23e3-7193-46af-82c7-1d0e17d4326c'; 
    const headers = {
        'X-CMC_PRO_API_KEY': API_KEY,
        'Accept': 'application/json'
    };
    try {
        const endpoint = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=USD&limit=2000';
        const response = await axios.get(endpoint, { headers: headers });
        const cryptos = response.data.data;
        var rate = 0
        for (let crypto of cryptos) {
            if (crypto.symbol === symbol_coin) {
                rate = crypto.quote.USD.price;
                //toFixed(2)
                // console.log(rate)
            }
        }
        if(rate !== 0 ){
            return rate;
        }else{
            throw error;
        }
        
    } catch (error) {
        console.error("Lỗi khi lấy tỉ giá:", error);
        throw error; 
    }
}

module.exports = function(app) {
    app.get('/home', async (req, res) => {
        console.log(req.cookies)
        if(req.cookies.sid){
            const existingAddress = await address_model.find({sid:req.cookies.sid});
            if (existingAddress.length == 1) {
                return home();
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
            if (req.cookies.sid) {
                try {
                    const data = await address_model.find({ sid: req.cookies.sid }).exec();
                    if (data.length == 1 && data[0].wallet.address.length > 10) {
                        function numberWithCommas(x) {
                            var parts = x.toString().split(".");
                            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            return parts.join(".");
                        }
                        const privateKeyTron = data[0].wallet.privateKey;
                        const walletData = await getAddressFromPrivateKey(privateKeyTron);
                        const renderData = {
                            balance:numberWithCommas(walletData.USDBalance),
                            name_wl : data[0].wallet.name_wl,
                            address: walletData.address,
                            TRXBalance: numberWithCommas(walletData.TRXBalance),
                            USDTBalance: numberWithCommas(walletData.USDTBalance)
                        };
                        res.render('home', renderData);
                    } else {
                        if(data[0].wallet.address.length <= 10){
                            res.render('en_first');
                        }else{
                            res.status(404).send({ kq: 0, msg: 'No data found' });
                        }
                    }
                } catch (error) {
                    console.error(error);
                    res.render('import_wallet', { error: error.message });
                }
            } else {
                res.render('en_first');
            }
        }
       
    });
};
/*

[
    {
        name_wl: 'yhjk',
        address: 'TYfvfGv2L73CSK8Vnngyse2vQwd1p4SikJ',
        TRXBalance: 7,
        USDTBalance: 78,
        USDBalance: 78
    },
    {
        name_wl: 'yhaajk',
        address: 'TYfvfGv2L73CSK8Vnngyse2vQwd1p4SikJ',
        privateKey: 'ddd8e5bfe5589e23049c8829389b107e92b842662f266e3effcd9c66c7dc6768'
        TRXBalance: 7,
        USDTBalance: 78,
        USDBalance: 72
    }
  ]
  
*/
