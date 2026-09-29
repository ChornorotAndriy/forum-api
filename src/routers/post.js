import { Router } from 'express'
import { getAllPostsHandler, createPostHandler, getPostByIdHandler } from '../handlers/post.js'

export const postRouter = Router()

postRouter.get('/', getAllPostsHandler)
postRouter.get('/:id', getPostByIdHandler)
postRouter.post('/', createPostHandler)