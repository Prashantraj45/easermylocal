import {Request, Response} from 'express'
import Partner from '../models/Partner';
import Post from '../models/Post';

export const search = async (req:Request, res:Response) => {

    try {
        const {name,tag, service} = req.query
        const allPartners:any = []
        const partners = await Partner.find({}).populate({path:"service",select:"name image active"});
        const searchData = partners.forEach(partner => {
    
          if (partner?.name?.includes(name) || partner?.service?.name?.includes(service)) {
            allPartners.push(partner)
          }
    
        })

        const posts = await Post.find({})
        let allPosts : any = []
        let postData = await posts.forEach(post => 
         { if(post?.serviceCategory?.name?.includes(service) || post?.tags?.includes(tag) || post?.title?.includes(name) ){
            allPosts.push(post)
          }
        })
    
        res.status(200).json({message:"All searched partner !",allPartners, allPosts})
    
    
    } catch (error) {
        res.status(400).json({message:"Something went wrong !", error})
    }

}