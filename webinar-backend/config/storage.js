const { Storage } = require('@google-cloud/storage');
const path = require('path');
require('dotenv').config();

// Create credentials object with the correct values
const credentials = {
  type: "service_account",
  project_id: "",
  private_key_id: "",
  private_key: "-----BEGIN PRIVATE KEY-----\4vXZMhhbrY=\n-----END PRIVATE KEY-----\n",
  "client_email": "",
  "client_id": "",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/",
  "universe_domain": "googleapis.com"
};

const storage = new Storage({
  credentials,
  projectId: "fleet-anagram-440300-f8"
});

const bucket = storage.bucket("webinars-image");

const uploadToGoogleCloud = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    try {
      const blobName = `webinars/${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const blob = bucket.file(blobName);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on('error', (error) => {
        console.error('Stream error:', error);
        reject(error);
      });

      blobStream.on('finish', async () => {
        try {
          // Make the file public
          await blob.makePublic();
          
          // Get the public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          console.log('File uploaded successfully:', publicUrl);
          resolve(publicUrl);
        } catch (error) {
          console.error('Error making file public:', error);
          reject(error);
        }
      });

      // Write the file data to the stream
      blobStream.end(file.buffer);
    } catch (error) {
      console.error('Error in uploadToGoogleCloud:', error);
      reject(error);
    }
  });
};

module.exports = { uploadToGoogleCloud, bucket };
