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
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

async function create(req, res) {
    try {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                console.error('Multer error:', err);
                return res.status(500).json({ message: 'Error uploading file' });
            }
            const file = req.file
            // Upload the file to AWS S3
            const fileName = generateFileName()
            const params = {
                Bucket: bucketName,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            await s3Client.send(new PutObjectCommand(params));
            const profile = req.body;
            profile.profilePic = fileName;
            const newProfile = new Profile(profile);
            const savedProfile = await newProfile.save();
            savedProfile.profilePic = await getSignedUrl(
                s3Client,
                new GetObjectCommand({
                  Bucket: bucketName,
                  Key: profile.profilePic
                }),
                { expiresIn: 60 * 10 }
            )
    
            res.json(savedProfile);

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating profile' });
    }
}

async function show(req, res) {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId })

    profile.profilePic = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: bucketName,
          Key: profile.profilePic
        }),
        { expiresIn: 60 * 10 }
    )

    res.json(profile);
}