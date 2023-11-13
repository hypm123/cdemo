module.exports = function(app) {

    async function usdt_send(privateKey,toAddress,amount) {
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
            const broadcast = await tronWeb.trx.sendRawTransaction(signature);
            console.log("result:", broadcast);
            return {
                address: address,
                toAddress:toAddress,
                amount:amount,
                TRXFees: TRXFees,
                broadcast:broadcast
            };
            
        } catch (error) {
            console.error('Error in getAddressFromPrivateKey:', error);
            throw error; // Throw the error to be handled where this function is called
        }
    }
}