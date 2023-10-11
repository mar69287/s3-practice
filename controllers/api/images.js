const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const multer = require('multer');
require('dotenv').config();
const crypto = require('crypto')

module.exports = {
    create,

};

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configure AWS S3 client
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
            console.log(fileName)
            res.json(fileName);
        });

    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
