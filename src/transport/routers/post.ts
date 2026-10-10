import { Router } from 'express'
import type { PostHandlerContract } from '../handlers/post/post.types.js'

export function createPostRouter(postHandler: PostHandlerContract){
    const postsRouter = Router()
    
    postsRouter.get('/', postHandler.getAllPosts)
    postsRouter.get('/:id', postHandler.getPostById)
    postsRouter.post('/', postHandler.createPost)

    return postsRouter
}
