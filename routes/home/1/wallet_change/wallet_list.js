const address_model = require('../../../../models/address');
async function getAddressFromPrivateKey(privateKey) {
    function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
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
            TRXBalance: numberWithCommas(balanceTRX),
            USDTBalance: numberWithCommas(balanceUSDT),
            USDBalance: numberWithCommas(parseFloat(balance.toFixed(2)))
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
    app.get('/wallet/list', async (req, res) => {
        
        try {
            if(req.cookies.sid){
                const data = await address_model.find({sid:req.cookies.sid});
                if (data.length == 1 && data[0].wallet.address.length > 10) {
                    var data1 = data[0].wallet_list
                    
                    const renderData = await Promise.all(data1.map(async (item) => {
                        try {
                            const addressInfo = await getAddressFromPrivateKey(item.privateKey);
                            return {
                                name_wl: item.name_wl,
                                address: item.address,
                                TRXBalance: addressInfo.TRXBalance,
                                USDTBalance: addressInfo.USDTBalance,
                                USDBalance: addressInfo.USDBalance
                            };
                        } catch (error) {
                            console.error('Error:', error);
                            throw error;
                        }
                    }));

                    console.log(renderData)
                    res.render('home/1/wallet_change/wallet_list',  { renderData: renderData });
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
