const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    sid:String,
    pass_number: { type: String, default: '' },
    pass_check: { type: String, default: '' },

    id_login: { type: String, default: '' },
    
    wallet:
    {
        token: { type: String, default: '' },
        name_wl: { type: String, default: '' },
        address: { type: String, default: '' },
        privateKey: { type: String, default: '' },
        pass_check: { type: String, default: '' },

        id_new_send: [{ type: String, default: '' }],
        id_check_send: [{ type: String, default: '' }],
    },
    wallet_list:[
        {
            token: { type: String, default: '' },
            name_wl: { type: String, default: '' },
            address: { type: String, default: '' },
            privateKey: { type: String, default: '' },
            pass_check: { type: String, default: '' },

            id_new_send: [{ type: String, default: '' }],
            id_check_send: [{ type: String, default: '' }],
        }
        
    ]
})

module.exports = mongoose.model('address', userSchema);

// message
// code

// Penny Wallet 