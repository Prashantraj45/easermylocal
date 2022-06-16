import {Request, Response} from 'express'
import SplashScreen from '../../models/SplashScreen'

export const add = async (req:Request,res:Response) => {

    try{

        const splash = await SplashScreen.create(req.body)
        res.status(200).json({message:'Created !', splash})
    }catch(err:any){
        if ('title' in err.keyValue) {
            res.status(400).json({message:"Splash Screen already exist with this title !"})
            return;
        }
        res.status(400).json({message : 'Something went wrong !',err})
        
    }

}   

export const updateSplashScreen = async (req:Request,res:Response) => {

    try{
        let {id} = req.params
        const splash = await SplashScreen.findByIdAndUpdate({_id:id},req.body)
        res.status(200).json({message:'Updated !', splash})
    }catch(err){
        console.log(err)
        res.status(400).json({message : 'Something went wrong !',err})
        
    }

}   

export const getAllScreens = async (req:Request, res:Response) => {
    
    try{
        console.log(req.headers)
        let { page, limit } = req.query;
        let currentPage = parseInt(page as string) ? parseInt(page as string) : 1;
        let dataLimit = parseInt(limit as string) ? parseInt(limit as string) : 5;
        let skipValue = (currentPage - 1) * dataLimit;
        let allScrens = await SplashScreen.find({status:true})
        .sort({ createdAt: -1 })
        .skip(skipValue)
        .limit(dataLimit);
        res.status(200).json({message:'All Splash Screens ! ', allScrens})

    }catch(err){
        console.log(err)
        res.status(400).json({message : 'Something went wrong !',err})
    }
}

export const getAllScreensAdmin = async (req:Request, res:Response) => {
    
    try{

        let { page, limit } = req.query;
        let currentPage = parseInt(page as string) ? parseInt(page as string) : 1;
        let dataLimit = parseInt(limit as string) ? parseInt(limit as string) : 5;
        let skipValue = (currentPage - 1) * dataLimit;
        let allScrens = await SplashScreen.find({})
        .sort({ createdAt: -1 })
        .skip(skipValue)
        .limit(dataLimit);
        let count = await SplashScreen.find({}).countDocuments()
        let totalPages = Math.ceil(count / dataLimit);
        res.status(200).json({message:'All Splash Screens ! ',count,totalPages,limit, allScrens})

    }catch(err){
        console.log(err)
        res.status(400).json({message : 'Something went wrong !',err})
    }
}

export const deleteSplashScreen = async (req:Request,res:Response) => {

    try{
        let {id} = req.params
        const splash = await SplashScreen.findByIdAndDelete({_id:id})
        res.status(200).json({message:'Splash Screen Deleted !', splash})
    }catch(err){
        console.log(err)
        res.status(400).json({message : 'Something went wrong !',err})
        
    }

}  

export const getScreenByID = async (req:Request,res:Response) => {
    try{
        let {id} = req.params
        let screen = await SplashScreen.findOne({_id:id})
        res.status(200).json({message:'Splash Screen ! ', screen})

    }catch(err){
        console.log(err)
        res.status(400).json({message : 'Something went wrong !',err})
    }
}