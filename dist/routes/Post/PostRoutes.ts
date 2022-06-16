import express from 'express';
import { createPost, deletePost, deletePostComment, getPostById, getPosts, postComment, searchPost, updatePost } from '../../controller/PostController';
import { checkTokenAndPermission } from '../../middleware/middlewares';
let router = express.Router()

//-------------------> create post
router.post('/',checkTokenAndPermission(["PARTNER", "USER", "ADMIN"]),createPost)

//--------------------> Get posts
router.get('/',getPosts)

//---------------------> Delete Post
router.delete('/:id',deletePost)

//-----------------------> GEt post by Id
router.get('/:id', getPostById)

//----------------------> Update Post
router.put('/:id', updatePost)

//--------------------------> Comment on post
router.post('/comment/:id',postComment)

//--------------------------> Comment on post
router.delete('/comment/:id',deletePostComment)

//----------------------------> Search post
router.get('/search/posts',searchPost)

export default router