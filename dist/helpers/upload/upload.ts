import dotenv from "dotenv";
import AWS from "aws-sdk";
import fs from "fs";

dotenv.config();
import { errorBg } from "../helpers";

// s3 initialization
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
});

interface file {
  path: string;
  name: string;
}

//? uploadFile
const uploadFile = (file: any) => {
  //? making the return as promise
  return new Promise((resolve,reject) => {
    //Setting up s3 upload parameters
    const params = {
      Bucket: process.env.BUCKET ? process.env.BUCKET : "",
      Key:Date.now() + file.name,
      Body: file.data,
      ACL:"public-read"
    }

    s3.upload(params,function (err:any,data:any) {
      if (err) {
        console.log(err)
        errorBg({"S3 bucket error":err})
        reject(err)
      }
      let {Location} = data
      resolve(Location)
    })

  })
};

export { uploadFile };
