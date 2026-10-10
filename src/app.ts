import express from "express"
import { createPostRepository } from "./repositories/post.js"
import { createPostService } from "./services/post.js"
import { createPostHandler } from "./transport/handlers/post/post.js"
import { createPostRouter } from "./transport/routers/post.js"
import { db } from "./prisma/db.js"

const PORT = 8000
const HOST = "localhost"

const app = express()

const postRepository = createPostRepository(db)
const postService = createPostService(postRepository)
const postHandler = createPostHandler(postService)
const postRouter = createPostRouter(postHandler)

app.use(express.json())
app.use("/posts", postRouter)

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})