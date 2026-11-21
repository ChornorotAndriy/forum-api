export interface CreatePostRequest {
    title: string
    content: string
    category: string
}

export interface AuthCredentialsRequest {
    email: string
    password: string
}
