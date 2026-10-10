import type { Post } from "./entity.js"

export type CreatePostInput = Omit<Post, "id">

export interface PostRepositoryContract {
    getAllPosts: (category?: string, take?: number) => Promise<Post[]>
    findPostById: (id: number) => Promise<Post | undefined>
    createPost: (post: CreatePostInput) => Promise<Post>
}