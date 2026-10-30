import express from "express"
import cookieParser from "cookie-parser"
import { db } from "./prisma/db.js"
import { hashPassword, verifyPassword } from "./lib/password.js"
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "./lib/jwt.js"
import { createPostRepository } from "./repositories/post.js"
import { createUserRepository } from "./repositories/user.js"
import { createPostService } from "./services/post.js"
import { createAuthService } from "./services/auth.js"
import { createPostHandler } from "./transport/handlers/post/post.js"
import { createAuthHandler } from "./transport/handlers/auth/auth.js"
import { createRequireAuth } from "./transport/middlewares/require-auth.js"
import { createPostRouter } from "./transport/routers/post.js"
import { createAuthRouter } from "./transport/routers/auth.js"

const PORT = 8000
const HOST = "localhost"

const app = express()

const userRepository = createUserRepository(db)
const authService = createAuthService(
    userRepository,
    { hashPassword, verifyPassword },
    { signAccessToken, signRefreshToken },
    { verifyAccessToken, verifyRefreshToken },
)
const authHandler = createAuthHandler(authService)
const requireAuth = createRequireAuth(verifyAccessToken)
const authRouter = createAuthRouter(authHandler, requireAuth)

const postRepository = createPostRepository(db)
const postService = createPostService(postRepository)
const postHandler = createPostHandler(postService)
const postRouter = createPostRouter(postHandler, requireAuth)

app.use(express.json())
app.use(cookieParser())
app.use("/auth", authRouter)
app.use("/posts", postRouter)

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})
