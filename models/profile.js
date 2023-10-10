const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    profilePic: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('Profile', profileSchema);