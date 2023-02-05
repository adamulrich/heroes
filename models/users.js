const mongoose = require('mongoose');
const userSchema = new mongoose.Schema (
    {
        name: String,
        user_id: String,
        privileges: {
            read: Boolean,
            create: Boolean,
            update: Boolean,
            delete: Boolean
        }
    })
        

module.exports = mongoose.model('Users',userSchema, 'privileges')