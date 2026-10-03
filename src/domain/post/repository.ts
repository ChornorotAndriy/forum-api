import type { Post } from "./entity.js"

export interface PostRepositoryContract {
    getAllPosts: (category?: string, take?: number) => Post[]
    findPostById: (id: number) => Post | undefined
    createPost: (post: Post) => Promise<Post>
}