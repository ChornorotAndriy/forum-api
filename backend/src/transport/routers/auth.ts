import { Router, type RequestHandler } from "express"
import type { AuthHandlerContract } from "../handlers/auth/auth.types.js"

export function createAuthRouter(authHandler: AuthHandlerContract, requireAuth: RequestHandler) {
    const authRouter = Router()

    authRouter.post("/register", authHandler.register)
    authRouter.post("/login", authHandler.login)
    authRouter.post("/refresh", authHandler.refresh)

    authRouter.get("/me", requireAuth, authHandler.me)

    return authRouter
}
