import type { Post } from "../domain/post/entity.js"

export type CreatePostInput = Omit<Post, "id">

export interface PostServiceContract {
    getPosts: (category?: string, take?: number) => Promise<Post[]>
    findPost: (id: number) => Promise<Post | undefined>
    createNewPost: (data: CreatePostInput) => Promise<Post>
}