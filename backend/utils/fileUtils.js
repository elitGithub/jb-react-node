const md5 = require('md5');
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket("jb-vacation-bucket");
const bucketName = 'jb-vacation-bucket';
const hashFileName = (file) => {
    const extension = file.name.split('.');
    const hash = hashString(file.name);
    return `${ hash }.${ extension.at(-1) }`;
}
const hashString = (string) => {
    return md5(string);
}


const createPublicUrl = async (fileName) => {
    // These options will allow temporary read access to the file
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 24 * 60 * 60 * 1000, // 15 minutes
    };

    // Get a v4 signed URL for reading the file
    const [url] = await storage
        .bucket(bucketName)
        .file(fileName)
        .getSignedUrl(options);

    return url;
};

module.exports = { hashFileName, createPublicUrl }