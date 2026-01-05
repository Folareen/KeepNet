"use server"

import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_S3_BUCKET;

if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET environment variable is required');
}

type UploadType = 'keep' | 'user';

export const uploadToS3 = async (
    fileBase64: string,
    fileName: string,
    fileType: string,
    uploadType: UploadType,
    username: string,
    collectionId?: string,
    keepId?: string
): Promise<string> => {
    try {
        console.log('Starting S3 upload...');
        let key: string;

        if (uploadType === 'keep') {
            if (!collectionId || !keepId) {
                throw new Error('collectionId and keepId are required for keep uploads');
            }
            const timestamp = Date.now();
            const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
            key = `user-keeps/${username}/${collectionId}/${timestamp}-${cleanFileName}`;
        } else {
            key = `user-images/${username}.png`;
        }

        const fileBuffer = Buffer.from(fileBase64, 'base64');

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: fileBuffer,
            ContentType: fileType,
        };

        const result = await s3.upload(uploadParams).promise();
        return result.Location;
    } catch (error) {
        console.error('S3 upload error:', error);
        throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
    try {
        if (!fileUrl || !fileUrl.includes(BUCKET_NAME!)) return;

        const key = fileUrl.split('.com/')[1];
        if (!key) return;

        const deleteParams = {
            Bucket: BUCKET_NAME!,
            Key: key
        };

        await s3.deleteObject(deleteParams).promise();
    } catch (error) {
        console.error('S3 delete error:', error);
    }
};