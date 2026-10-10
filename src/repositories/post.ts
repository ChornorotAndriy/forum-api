import type { CreatePostInput, PostRepositoryContract } from "../domain/post/repository.js"

type Database = typeof import("../prisma/db.ts").db

export function createPostRepository(database: Database): PostRepositoryContract {
    async function getAllPosts(category?: string, take?: number) {
        const posts = database.orm.public.Post.orderBy((post) => post.id.asc())

        if (category) {
            const filtered = posts.where({ category })
            return take ? filtered.limit(take).all() : filtered.all()
        }

        return take ? posts.limit(take).all() : posts.all()
    }

    async function findPostById(id: number) {
        const post = await database.orm.public.Post.where({ id }).first()
        return post ?? undefined
    }

    async function createPost(post: CreatePostInput) {
        return database.orm.public.Post.create(post)
    }

    return { getAllPosts, findPostById, createPost }
}