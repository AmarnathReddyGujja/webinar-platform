const { Storage } = require('@google-cloud/storage');
const path = require('path');
require('dotenv').config();

// Create credentials object with the correct values
const credentials = {
  type: "service_account",
  project_id: "fleet-anagram-440300-f8",
  private_key_id: "b0995f76b129fb0e41f145c39391a6f44c6576ac",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCVpKc2GrLmLIXW\nFdFSvVwx8Fyu+fSgCPYX+0mVtcw/y9rks3haCLWdJreLIIxi6nmgdx2orI0/Gszc\nZ8Jx6Xku6CCNpFRXLTNpF3tY5jJ94WTuIl/bZYsGNc/VtMxiTqa2cRuoDXDxW+9L\nMGIjKNXzFnPxLyOLPlf6glEqfK2mOW8CUwBVicYTOJ2X2/xjULO00C/QGgsat3N9\nHNEjNmesQyHh7WMypUtv2+UWiZvUPcRtfN9xhrZCC7IH5R9GN6gAgEE9Voiq7RpN\nlYvmcDav/xpCU81Q+rzWA8PvI40iXKveJ9QdXMVnXO4Z0CRrEC/5FKSWSLYVBcOV\no7n+d0p1AgMBAAECggEAJcksUcyfFOD0MJFUyFw5XgDQHnzOSOTKY1bYB14fA5Lx\npGMvBikB1vtSSGbBHC8R5DN/wTpE9kTJqvPmVQY7y9zgb3OpulOXEjfUNSf3YvLZ\nngn/A3LaDojjAJcFLuOmVBYughpWxRNOUsGWXkNu9tFaGHIrOvtUktR6M0zFOl4O\na+G57dN2oF2PYMRDTxDwQaPFW9o2n5JSgS5swK8il9+627azR6V356XbSi2yKLnV\nx2B5JHijul5PQnjIQypnf8P32AlgeAlVxszHHxb38U8AON8kbrX2maxnEY2rVTVN\nGhIlCDVpOUppoNG/k7jV5j5RvM5dq/+HnGDALqZ9BwKBgQDICiXLA2nl8A5TeUZA\nKRhHWEIOInYm8TSHHlRbdAVf5Mcnaxnm51NabqDrPJoCWt0g6Vnc/MryoLcNo4Xc\n+xwV32WTeh7n3d22gl5h88+xHzksVLl1DN+gRfgVocKClY+kq54xyxXB4gl3X98S\nM7W3B2vau5LPDM4fozNH8cH7GwKBgQC/gVwDxUZVej+2FcXSVBjsChIIp3d4b0Pa\nLYdXUsr4/XXzCCe11ghpyk8YY06SBNorILmFhBcp6GnJh8oO2YrNkaWKaBMC5UXw\nVXGn617QU4GhWu3iU9UbQN0w1A/piChtCUqpw7ugECgUj1UVkNzBlp/mxeEIQ1ja\nJX/CcnUZrwKBgBDMyV/DaaFmB8364WuCCAf14ZZOTp32o/K1GWCU3d6v2An3dLVv\nuBBgOiOHc2e/OdMJxgJJOMInvTfoA9YLQNCVcnJwTygp+fTZ/hM75rV5adPPScQK\n0L0lIzCt5SgSZ33s69xCshEWarUb2CAvN5Oni+dS2YGKEcWWbzgbla8BAoGANrRc\nNZOH6Oj4BCqqDNALInop9qDoBtY52rxAuhgjdQbqR5dfyJiwZI/vEjdj/WA3djRt\n6o72EvmaJoCMnrtT5C8jy6q5K42U8fdmdSJOPlJsaExSQeHSsWtRBB6/wOUtLyCF\nXINWOH4FBQKAup1cAkzltoV2J+cdHYuyuDf77W8CgYEAm+5MLvsKI4KGO94gNNk2\nxpt17CTRdszaEJYw2vV2Is9MT2qOAO0+eVYbdaDH3+GT+u5W1N1PEUynRpFUNKYw\ny68c81KW2wwO3HNr/xiwoYgqzeUQsBJasYFOteEVrwMdOl/joJIpijqZdafjkkZs\n/2o26FN+dIK3B4vXZMhhbrY=\n-----END PRIVATE KEY-----\n",
  "client_email": "amar-771@fleet-anagram-440300-f8.iam.gserviceaccount.com",
  "client_id": "109521387029276776444",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/amar-771%40fleet-anagram-440300-f8.iam.gserviceaccount.com",
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