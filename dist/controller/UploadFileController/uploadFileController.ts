import {Request,Response} from 'express'
import {uploadFile} from '../../helpers/upload/upload'


const uploadFileController = async (req:any,res:Response) => {
    try{

        
        
        // console.log(req.file)
        let a = req.files
        if (req.files) {
            console.log(req.files)
            const Location = await uploadFile(req.files?.file)
            console.log('--------------------------->',Location)
            // console.log(location)
            res.status(200).json({message:"File Uploaded !" ,Location })
            return;
        }else{
            res.status(400).json({message:"File Required !"})
            return;
        }
    }catch(err){
        console.log(err)
        return res.status(400).json({message:"Something went wrong !",err})
    }
}

export default uploadFileController