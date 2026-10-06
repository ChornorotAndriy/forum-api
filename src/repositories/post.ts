import type { Post } from "../domain/post/entity.js"
import type { PostRepositoryContract } from "../domain/post/repository.js"

export function createPostRepository(): PostRepositoryContract {
    let posts: Post[] = [
        {
            id: 1,
            title: "Python",
            content: "You can start learning python by watching video on Yotube",
            author: "Andrii",
            category: "programming"
        },
        {
            id: 2,
            title: "What is Node.js?",
            content: "Node.js allows you to run JavaScript outside the browser",
            author: "Lera",
            category: "programming"
        },
        {
            id: 3,
            title: "My favorite game",
            content: "Dota 2 is my favorite game",
            author: "Egor",
            category: "games"
        }
    ]

    function getAllPosts(category?: string, take?: number) {
        let result = [...posts]
        if (category) {
            result = result.filter((post) => post.category === category)
        }
        if (take) {
            result = result.slice(0, take)
        }
        return result
    }

    function findPostById(id: number) {
        return posts.find((post) => post.id === id)
    }

    async function createPost(post: Post) {
        return new Promise<Post>((resolve, reject) => {
            setTimeout(() => {
                posts = [...posts, post]
                resolve(post)
            }, 1000)
        })
    }

    return { getAllPosts, findPostById, createPost }
}