import "dotenv/config"
import jwt from "jsonwebtoken"

const accessTokenSecret = process.env.JWT_ACCESS_SECRET
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET

if (!accessTokenSecret) throw new Error("JWT_ACCESS_SECRET is not defined")
if (!refreshTokenSecret) throw new Error("JWT_REFRESH_SECRET is not defined")
if (accessTokenSecret === refreshTokenSecret) {
    throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different")
}

export function signAccessToken(userId: number): string {
    return jwt.sign({ type: "access" }, accessTokenSecret!, {
        algorithm: "HS256",
        subject: String(userId),
        expiresIn: "15m",
    })
}

export function signRefreshToken(userId: number): string {
    return jwt.sign({ type: "refresh" }, refreshTokenSecret!, {
        algorithm: "HS256",
        subject: String(userId),
        expiresIn: "7d",
    })
}

function readUserId(token: string, secret: string, type: "access" | "refresh"): number {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] })

    if (typeof payload === "string" || payload.type !== type || typeof payload.sub !== "string") {
        throw new Error("Invalid token payload")
    }

    const userId = Number(payload.sub)
    if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error("Invalid token subject")
    }

    return userId
}

export function verifyAccessToken(token: string): number {
    try {
        return readUserId(token, accessTokenSecret!, "access")
    } catch {
        throw new Error("INVALID_ACCESS_TOKEN")
    }
}

export function verifyRefreshToken(token: string): number {
    try {
        return readUserId(token, refreshTokenSecret!, "refresh")
    } catch {
        throw new Error("INVALID_REFRESH_TOKEN")
    }
}
