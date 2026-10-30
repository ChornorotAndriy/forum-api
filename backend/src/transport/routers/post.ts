import { Router, type RequestHandler } from "express"
import type { PostHandlerContract } from "../handlers/post/post.types.js"

export function createPostRouter(postHandler: PostHandlerContract, requireAuth: RequestHandler) {
    const postsRouter = Router()

    postsRouter.get("/", postHandler.getAllPosts)
    postsRouter.get("/:id", postHandler.getPostById)
    postsRouter.post("/", requireAuth, postHandler.createPost)

    return postsRouter
}
