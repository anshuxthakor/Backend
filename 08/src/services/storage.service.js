import ImageKit from "@imagekit/nodejs";
import { configDotenv } from "dotenv";

configDotenv();

const storageInstance = new ImageKit({
  urlEndpoint: process.env.URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const sendFiles = async (file, fileName) => {
  const obj = {
    file,
    fileName,
    folder: 'MiniInsta'
  }
  return await storageInstance.files.upload(obj);
}

export default sendFiles;