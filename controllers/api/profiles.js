const Profile = require('../../models/profile')
const User = require('../../models/user');
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require('multer');
require('dotenv').config();
const crypto = require('crypto')

module.exports = {
    create,
    show
}

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const storage = multer.memoryStorage();
const upload = multer({ storage });
const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});

async function create(req, res) {
    try {
        const profile = req.body;
        const newProfile = new Profile(profile);
        const savedProfile = await newProfile.save();

        res.json(savedProfile);
        // console.log('in profile controller')
        // console.log(req.body)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating profile' });
    }
}

async function show(req, res) {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId })
    
    // const params = {
    //     Bucket: bucketName,
    //     Key: profile.profilePic,
    // };
    // const command = new GetObjectCommand(params);
    const imageUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: bucketName,
          Key: profile.profilePic
        }),
        { expiresIn: 60 * 10 }
      )
    profile.profilePic = imageUrl;
    // console.log(profile)

    res.json(profile);
}