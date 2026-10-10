import type { Request, Response } from "express"
import type { PostResponse } from "../../dto/responses.js"
import type { CreatePostRequest } from "../../dto/requests.js"
import type { ErrorResponse } from "../../dto/errors.js"

export interface PostHandlerContract{
    getAllPosts: (
        req: Request, 
        res: Response<PostResponse[] | ErrorResponse>
    ) => void;
    getPostById: (
        req: Request,
        res: Response<PostResponse | ErrorResponse>
    ) => void;
    createPost: (
        req: Request<{}, {}, CreatePostRequest>,
        res: Response<PostResponse | ErrorResponse>
    ) => void
}