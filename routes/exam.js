async function balance_check(privateKey) {
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

async function fee_check(privateKey,toAddress,amount) {
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

async function getAddressFromPrivateKey(privateKey) {
    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider("https://api.trongrid.io");
    const solidityNode = new HttpProvider("https://api.trongrid.io");
    const eventServer = new HttpProvider("https://api.trongrid.io");
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer,privateKey);

    const usdt_contract_tron = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

    try {
        const addressObj = tronWeb.address.fromPrivateKey(privateKey);
        const address = tronWeb.address.fromHex(addressObj);
        const abiContract = await tronWeb.trx.getContract(usdt_contract_tron);
        const contract = tronWeb.contract(abiContract.abi.entrys, usdt_contract_tron);
        const balanceUSDT  = await contract.methods.balanceOf(address).call()/Math.pow(10,6);
        console.log("USDT Balance:", balanceUSDT.toString());
        const balanceTRX =await tronWeb.trx.getBalance(address)/Math.pow(10,6);
        console.log("TRX balance:", balanceTRX);

        var functions = 'transfer(address,uint256)';
        var options = {};
        var parameter = [{
            type: 'address',
            value: toAddressTron
        }, {
            type: 'uint256',
            value: amount_tron
        }];
        var issuerAddress = tronWeb.address.toHex(address);

        const tx = await tronWeb.transactionBuilder.triggerSmartContract(usdt_contract_tron, functions,options,parameter,issuerAddress);    
        const signature = await tronWeb.trx.sign(tx.transaction);
        
        var bandwidth = estimateBandwidth(signature); //bandwidth sử dụng
        const txConstant = await tronWeb.transactionBuilder.triggerConstantContract(usdt_contract_tron, functions,options,parameter,issuerAddress);
        var energy_used = txConstant.energy_used; //energy sử dụng
        var TRXFees = (bandwidth*1000 + energy_used*420)/Math.pow(10,6); //phí TRX
        console.log("fee: ",TRXFees);
        if(TRXFees <= 50)
        {
            const broadcast = await tronWeb.trx.sendRawTransaction(signature);
            console.log("result:", broadcast);
        } 
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

function estimateBandwidth(signedTxn)
{
    const DATA_HEX_PROTOBUF_EXTRA = 3;
    const MAX_RESULT_SIZE_IN_TX = 64;
    const A_SIGNATURE = 67;

    var len = signedTxn.raw_data_hex.toString().length /2 + DATA_HEX_PROTOBUF_EXTRA + MAX_RESULT_SIZE_IN_TX  ;
    var signatureListSize = signedTxn.signature.length;
    console.log(signatureListSize)
    for(let i=0;i<signatureListSize;i++)
    {
        len += A_SIGNATURE;
    }
    return len;
} 
