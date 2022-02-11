const fileUtils = require('../utils/fileUtils');
const fs = require('fs');
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: process.env.KEY_FILE });
const bucket = storage.bucket(process.env.BUCKET);


const bucketName = process.env.BUCKET;

async function uploadFile(req, res) {
    const file = req?.files?.file;
    if (!file) {
        return res.status(400).json({ success: false, message: "Please upload a file!" });
    }
    const destFileName = file.name = fileUtils.hashFileName(file);
    const filePath = `./uploads/${ file.name }`;
    await file.mv(filePath, async () => {
        await storage.bucket(bucketName).upload(filePath, {
            destination: destFileName,
        });
        fs.unlinkSync(filePath);
    });


    return res.json({ success: true, message: 'file uploaded successfully', data: file });
}


const upload = async (req, res) => {
    return uploadFile(req, res).catch(console.error);
};

const getListFiles = async (req, res) => {
    try {
        const [files] = await bucket.getFiles();
        let fileInfos = [];
        files.forEach((file) => {
            fileInfos.push({
                name: file.name,
                url: file.metadata.mediaLink,
            });
        });
        res.status(200).send(fileInfos);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Unable to read list of files!",
        });
    }
};
const download = async (req, res) => {
    try {
        const [metaData] = await bucket.file(req.params.name).getMetadata();
        res.redirect(metaData.mediaLink);

    } catch (err) {
        res.status(500).send({
            message: "Could not download the file. " + err,
        });
    }
};

module.exports = {
    upload,
    getListFiles,
    download,
};