module.exports = function(app) {
    app.get('/usdtlist/received_list/:id', async (req, res) => {
        var hash = req.params.id;
        if (req.cookies.session_id) {
            try {
                const data = await address_model.findOne({ sid: req.cookies["connect.sid"], token: req.cookies.session_id }).exec();
                console.log(data)
                if (data) {
                    function numberWithCommas(x) {
                        var parts = x.toString().split(".");
                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        return parts.join(".");
                    }
                    const privateKeyTron = data.privateKey[0];
                    const walletData = await getAddressFromPrivateKey(privateKeyTron);
                    const renderData = {
                        address: walletData.address,
                        TRXBalance: numberWithCommas(walletData.TRXBalance),
                        USDTBalance: numberWithCommas(walletData.USDTBalance)
                    };
                    console.log(renderData)
                    res.render('home', renderData);
                } else {
                    res.status(404).send({ kq: 0, msg: 'No data found' });
                }
            } catch (error) {
                console.error(error);
                res.render('import_wallet', { error: error.message });
            }
        } else {
            console.log(req.cookies);
            res.render('en_first');
        }
    });
};