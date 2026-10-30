import type { Response } from "express"
import type { AuthServiceContract, AuthTokens } from "../../../services/auth.types.js"
import type { AuthCredentialsRequest } from "../../dto/requests.js"
import type { AuthHandlerContract } from "./auth.types.js"

const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000

function setAuthCookies(res: Response, tokens: AuthTokens) {
    const base = {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    } as const

    res.cookie("accessToken", tokens.accessToken, {
        ...base,
        maxAge: ACCESS_COOKIE_MAX_AGE,
        path: "/",
    })


    res.cookie("refreshToken", tokens.refreshToken, {
        ...base,
        maxAge: REFRESH_COOKIE_MAX_AGE,
        path: "/auth",
    })
}

function parseCredentials(body: Partial<AuthCredentialsRequest> | undefined) {
    const { email, password } = body ?? {}

    if (
        typeof email !== "string" || !email.trim() ||
        typeof password !== "string" || password.length < 8
    ) {
        return null
    }

    return { email, password }
}

export function createAuthHandler(authService: AuthServiceContract): AuthHandlerContract {
    return {
        async register(req, res) {
            const credentials = parseCredentials(req.body)

            if (!credentials) {
                res.status(422).json({ message: "Invalid email or password (min 8 characters)" })
                return
            }

            try {
                const user = await authService.register(credentials)
                res.status(201).json(user)
            } catch (error) {
                if (error instanceof Error && error.message === "EMAIL_TAKEN") {
                    res.status(409).json({ message: "Email is already used" })
                    return
                }

                console.error(error)
                res.status(500).json({ message: "Failed to register" })
            }
        },

        async login(req, res) {
            const credentials = parseCredentials(req.body)

            if (!credentials) {
                res.status(422).json({ message: "Invalid email or password" })
                return
            }

            try {
                const { user, accessToken, refreshToken } = await authService.login(credentials)

                setAuthCookies(res, { accessToken, refreshToken })
                res.status(200).json(user)
            } catch (error) {
                if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
                    res.status(401).json({ message: "Invalid email or password" })
                    return
                }

                console.error(error)
                res.status(500).json({ message: "Failed to login" })
            }
        },

        async refresh(req, res) {
            const refreshToken = req.cookies?.refreshToken

            if (typeof refreshToken !== "string" || !refreshToken) {
                res.status(401).json({ message: "Unauthorized" })
                return
            }

            try {
                const tokens = await authService.refresh(refreshToken)

                setAuthCookies(res, tokens)
                res.status(200).json({ message: "Tokens refreshed" })
            } catch (error) {
                if (error instanceof Error && error.message === "INVALID_REFRESH_TOKEN") {
                    res.status(401).json({ message: "Unauthorized" })
                    return
                }

                console.error(error)
                res.status(500).json({ message: "Failed to refresh tokens" })
            }
        },

        async me(_req, res) {

            const userId: number = res.locals.userId

            try {
                const user = await authService.me(userId)
                res.status(200).json(user)
            } catch (error) {
                if (error instanceof Error && error.message === "UNAUTHORIZED") {
                    res.status(401).json({ message: "Unauthorized" })
                    return
                }

                console.error(error)
                res.status(500).json({ message: "Failed to load user" })
            }
        },
    }
}
