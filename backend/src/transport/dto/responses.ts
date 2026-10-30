export interface PostResponse {
    id: number
    title: string
    content: string
    category: string
    authorId: number
}

export interface UserResponse {
    id: number
    email: string
}

export interface MessageResponse {
    message: string
}
