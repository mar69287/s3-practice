const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    profilePic: String,
}, {
    timestamps: true,
});


module.exports = mongoose.model('Image', imageSchema);