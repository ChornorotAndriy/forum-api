import {getAll, getById, addPost} from "../repositories/post.js"

export function getAllPosts(category, take) {
    return getAll(category, take)
}

export function getPostById(id) {
    return getById(id)
}

export function createPost(postData) {
    return addPost(postData)
}