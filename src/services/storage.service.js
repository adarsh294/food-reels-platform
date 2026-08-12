import ImageKit from "@imagekit/nodejs";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY.trim(),
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY.trim(),
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT.trim(),
});

const uploadFile = async (file,name) => {
    const response = await imagekit.files.upload({
        file,
        fileName: name,
        folder:'reels'
    });

    return response;
};

export default uploadFile;