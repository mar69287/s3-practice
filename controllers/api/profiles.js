const Profile = require('../../models/profile')
const User = require('../../models/user');

module.exports = {
    create,
}

async function create(req, res) {
    try {
        // const profile = req.body;
        // const newProfile = new Profile(profile);
        // const savedProfile = await newProfile.save();

        // res.json(savedProfile);
        console.log('in profile controller')
        console.log(req.body)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating profile' });
    }
}