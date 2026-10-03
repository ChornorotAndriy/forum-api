
import type { PostResponse } from "../../dto/responses.ts"
import type { CreatePostRequest } from "../../dto/requests.ts"
import type { ErrorResponse } from "../../dto/errors.ts"
import type { Request, Response } from "express"
import type { PostHandlerContract } from "./post.types.ts"
import type { PostServiceContract } from "../../../services/post.types.js"

export function createPostHandler(postService: PostServiceContract): PostHandlerContract{
    function getAllPosts(
        req: Request,
        res: Response<PostResponse[] | ErrorResponse>
    ){
        const { category, take } = req.query

        if (category !== undefined && typeof category !== "string") {
            return res.status(400).json({
                message: "Query parameter 'category' is incorrect"
            })
        }

        if (!take) {
            return res.status(200).json(postService.getPosts(category))
        }
        const takeNum = Number(take)

        if(!takeNum || !Number.isInteger(takeNum) || takeNum < 0) {
            res.status(400).json({
                message: "Query parameter 'take' is incorrect"
            })
            return
        }
        const posts = postService.getPosts(category, takeNum)
        res.status(200).json(posts)
    }

    function getPostById(
        req: Request, 
        res: Response<PostResponse | ErrorResponse>
    ) {
        const postId = Number(req.params.id);

        if (!Number.isInteger(postId) || postId <= 0) {
            return res.status(400).json({
                message: 'id must be a positive integer',
            });
        }

        const post = postService.findPost(postId);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
            })
        }

        res.status(200).json(post)
    }

    async function createPost(
        req: Request<{}, {}, CreatePostRequest>, 
        res: Response<PostResponse | ErrorResponse>) {
        const { title, content, author, category } = req.body

        if (
            typeof title !== 'string' || !title.trim() ||
            typeof content !== 'string' || !content.trim() ||
            typeof author !== 'string' || !author.trim() ||
            typeof category !== 'string' || !category.trim()
        ) {
            return res.status(422).json({
                message: 'Invalid post data',
            });
        }

        try {
            const createdPost = await postService.createNewPost({
                title,
                content,
                author,
                category
            });

            res.status(201).json(createdPost);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: 'Failed to create post',
            });
        }
    }
    return { getAllPosts, getPostById, createPost }
}
