import type { PublicUser } from "../domain/user/entity.js"

export interface AuthCredentials {
    email: string
    password: string
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

export interface PasswordHasherContract {
    hashPassword: (password: string) => Promise<string>
    verifyPassword: (hash: string, password: string) => Promise<boolean>
}

export interface TokenSignerContract {
    signAccessToken: (userId: number) => string
    signRefreshToken: (userId: number) => string
    getRefreshTokenExpiresAt: () => Date
}

export interface TokenVerifierContract {
    verifyAccessToken: (token: string) => number
    verifyRefreshToken: (token: string) => number
}

export interface RefreshTokenHasherContract {
    hashRefreshToken: (token: string) => string
}

export interface AuthServiceContract {
    register: (data: AuthCredentials) => Promise<PublicUser>
    login: (data: AuthCredentials) => Promise<{ user: PublicUser } & AuthTokens>
    refresh: (refreshToken: string) => Promise<AuthTokens>
    logout: (refreshToken?: string) => Promise<void>
    me: (userId: number) => Promise<PublicUser>
}
