import type { PostRepositoryContract } from "../domain/post/repository.js"
import type { CreatePostInput, PostServiceContract } from "./post.types.js"

export function createPostService(postRepository: PostRepositoryContract): PostServiceContract {
    function getPosts(category?: string, take?: number) {
        return postRepository.getAllPosts(category, take)
    }

    function findPost(id: number) {
        return postRepository.findPostById(id)
    }

    async function createNewPost(data: CreatePostInput) {
        const { title, content, category, authorId } = data

        return postRepository.createPost({ title, content, category, authorId })
    }

    return { getPosts, findPost, createNewPost }
}
