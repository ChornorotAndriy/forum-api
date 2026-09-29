import {getAllPosts, getPostById, createPost} from '../services/post.js'

export function getAllPostsHandler(req, res) {
    const { category, take } = req.query
    const posts = getAllPosts(category, take)
    return res.status(200).json(posts)
}

export function getPostByIdHandler(req, res) {
    const { id } = req.params
    const post = getPostById(id)
    if (!post) {
        return res.status(404).json({ message: "Page not found" })
    }
    return res.status(200).json(post)
}

export function createPostHandler(req, res) {
    const { title, content, author, category } = req.body
    if(!title || !content) {
        return res.status(422).json({ message: "Title are required" })
    }
    const newPost = createPost({ title, content, author, category })
    return res.status(201).json(newPost)
}