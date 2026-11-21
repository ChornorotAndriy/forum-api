import "dotenv/config"
import jwt from "jsonwebtoken"
import { createHash, randomUUID } from "node:crypto"

const accessTokenSecret = process.env.JWT_ACCESS_SECRET
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET

if (!accessTokenSecret) throw new Error("JWT_ACCESS_SECRET is not defined")
if (!refreshTokenSecret) throw new Error("JWT_REFRESH_SECRET is not defined")
if (accessTokenSecret === refreshTokenSecret) {
    throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different")
}

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

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
        expiresIn: Math.floor(REFRESH_TOKEN_TTL_MS / 1000),
        jwtid: randomUUID(),
    })
}

export function getRefreshTokenExpiresAt(): Date {
    return new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
}

export function hashRefreshToken(token: string): string {
    return createHash("sha256").update(token).digest("hex")
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
