import type { RefreshSessionRepositoryContract } from "../domain/refresh-session/repository.js"
import type { UserRepositoryContract } from "../domain/user/repository.js"
import type {
    AuthServiceContract,
    PasswordHasherContract,
    RefreshTokenHasherContract,
    TokenSignerContract,
    TokenVerifierContract,
} from "./auth.types.js"

export function createAuthService(
    userRepository: UserRepositoryContract,
    refreshSessionRepository: RefreshSessionRepositoryContract,
    passwordHasher: PasswordHasherContract,
    tokenSigner: TokenSignerContract,
    tokenVerifier: TokenVerifierContract,
    refreshTokenHasher: RefreshTokenHasherContract,
): AuthServiceContract {
    async function issueTokens(userId: number) {
        const refreshToken = tokenSigner.signRefreshToken(userId)

        await refreshSessionRepository.create({
            userId,
            tokenHash: refreshTokenHasher.hashRefreshToken(refreshToken),
            expiresAt: tokenSigner.getRefreshTokenExpiresAt(),
        })

        return {
            accessToken: tokenSigner.signAccessToken(userId),
            refreshToken,
        }
    }

    async function register(data: { email: string, password: string }) {
        const passwordHash = await passwordHasher.hashPassword(data.password)

        const user = await userRepository.create({
            email: data.email.trim().toLowerCase(),
            passwordHash,
        })

        return { id: user.id, email: user.email }
    }

    async function login(data: { email: string, password: string }) {
        const user = await userRepository.getByEmail(data.email.trim().toLowerCase())

        if (!user || !(await passwordHasher.verifyPassword(user.passwordHash, data.password))) {
            throw new Error("INVALID_CREDENTIALS")
        }

        return {
            user: { id: user.id, email: user.email },
            ...(await issueTokens(user.id)),
        }
    }

    async function refresh(refreshToken: string) {
        const userId = tokenVerifier.verifyRefreshToken(refreshToken)
        const oldTokenHash = refreshTokenHasher.hashRefreshToken(refreshToken)

        const session = await refreshSessionRepository.getByTokenHash(oldTokenHash)
        if (!session || session.userId !== userId) {
            throw new Error("INVALID_REFRESH_TOKEN")
        }

        if (session.expiresAt.getTime() <= Date.now()) {
            await refreshSessionRepository.deleteByTokenHash(oldTokenHash)
            throw new Error("INVALID_REFRESH_TOKEN")
        }

        const user = await userRepository.getById(userId)
        if (!user) {
            throw new Error("INVALID_REFRESH_TOKEN")
        }

        const newRefreshToken = tokenSigner.signRefreshToken(user.id)

        const rotated = await refreshSessionRepository.rotate(
            oldTokenHash,
            refreshTokenHasher.hashRefreshToken(newRefreshToken),
            tokenSigner.getRefreshTokenExpiresAt(),
        )
        if (!rotated) {
            throw new Error("INVALID_REFRESH_TOKEN")
        }

        return {
            accessToken: tokenSigner.signAccessToken(user.id),
            refreshToken: newRefreshToken,
        }
    }

    async function logout(refreshToken?: string) {
        if (!refreshToken) {
            return
        }

        await refreshSessionRepository.deleteByTokenHash(
            refreshTokenHasher.hashRefreshToken(refreshToken),
        )
    }

    async function me(userId: number) {
        const user = await userRepository.getById(userId)
        if (!user) {
            throw new Error("UNAUTHORIZED")
        }

        return { id: user.id, email: user.email }
    }

    return { register, login, refresh, logout, me }
}
