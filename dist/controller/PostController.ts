import { Request, Response } from "express";
import Post from "../models/Post";
import lodash from "lodash";
import Comment from "../models/Comment";
import User from "../models/User";
import { sendMessage } from "../helpers/helpers";
import sendNotification from "../helpers/sendNotification/sendNotification";
import Partner from "../models/Partner";

export const createPost = async (req: any, res: Response) => {
  try {

    let { userType, _id, postCount, isPremium } = req.user;
    if (userType === "USER") {
      if (!isPremium) {
        if (postCount <= 0) {
          return sendMessage(req, res, "No Count Left to for new Post !");
        }
        let user = await User.findByIdAndUpdate(
          { _id: _id },
          { $inc: { postCount: -1 } }
        );
      }
    }

    let post = await Post.create(req.body);
    //-------------> Send notification to all premium partner
    const partners = await Partner.find({$or : [{isPremium:true}, { notificationCount:{$gt :0}}]})
    partners.map(async x => {
      if (x.isPremium === false) {
        await Partner.findByIdAndUpdate({_id:x._id},{$inc:{notificationCount: -1}})
      }
      await sendNotification("Title","<h1>Notification</h1>",x.fcmToken)
    })
    
    res.status(200).json({ message: "Post created !", post });
  } catch (err) {
    res.status(400).json({ message: "something went wrong !", err });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    let { page, limit } = req.query;
    let currentPage = parseInt(page as string) ? parseInt(page as string) : 1;
    let dataLimit = parseInt(limit as string) ? parseInt(limit as string) : 5;
    let skipValue = (currentPage - 1) * dataLimit;

    let posts = await Post.find({})
      .populate({path:"createdBy", select:"name eamil image phone"})
      .sort({ createdAt: -1 })
      .skip(skipValue)
      .limit(dataLimit);
    let count = await Post.find({}).countDocuments();
    let totalPages = Math.ceil(count / dataLimit);
    res.status(200).json({
      message: "All Posts !",
      currentPage,
      dataLimit,
      totalPages,
      count,
      posts,
    });
  } catch (err) {
    res.status(400).json({ message: "something went wrong !", err });
  }
};

//-------------------> Delete post
export const deletePost = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    let post = await Post.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "Post Deleted !", post });
  } catch (err) {
    res.status(400).json({ message: "something went wrong !", err });
  }
};

//------------------> Get Single Post

export const getPostById = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    let post = await Post.findOne({ _id: id }).populate("serviceCategory");
    res.status(200).json({ message: "Post Found !", post });
  } catch (err) {
    res.status(400).json({ message: "something went wrong !", err });
  }
};

//-----------------> Update Post

export const updatePost = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    let post = await Post.findByIdAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: "Post Updated !", post });
  } catch (err) {
    res.status(400).json({ message: "something went wrong !", err });
  }
};

export const postComment = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    let comment = await Comment.create({ ...req.body });
    let post = await Post.findByIdAndUpdate(
      { _id: id },
      { $push: { comments: comment._id } }
    );
    res.status(200).json({ message: "Comment added to post success !", post });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong !", err });
  }
};

export const deletePostComment = async (req: Request, res: Response) => {
  try {
    console.log(req.body, req.params);
    let { id } = req.params;
    let { userId, commentId } = req.body;
    let comm = await Comment.findOne({ _id: id });
    //-------------->check comment is deleting by their own user
    if (comm?.user?._id.equals(userId)) {
      let comment = await Comment.findByIdAndDelete({ _id: id });
      let post = await Post.findByIdAndUpdate(
        { _id: id },
        { $pull: { comments: comment._id } }
      );
      res.status(200).json({ message: "Comment deleted !", post });
    } else {
      res.status(400).json({ message: "Something went wrong !" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong !", err });
  }
};


export const searchPost  = async (req:Request,res:Response) => {
  try {
    const filter = req.query
    const posts = await Post.find({})
    console.log(filter)
    let searchData : any = []
    let data = await posts.forEach(post => 
     { if(post?.serviceCategory?.name?.includes(filter.service) || post?.tags?.includes(filter.tag) || post?.title?.includes(filter.title) ){
        searchData.push(post)
      }
    })
    res.status(200).json({message:"All searched posts !",searchData})

  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong !", err });
  }
}