import type { UserRepositoryContract } from "../domain/user/repository.js"
import type {
    AuthServiceContract,
    PasswordHasherContract,
    TokenSignerContract,
    TokenVerifierContract,
} from "./auth.types.js"

export function createAuthService(
    userRepository: UserRepositoryContract,
    passwordHasher: PasswordHasherContract,
    tokenSigner: TokenSignerContract,
    tokenVerifier: TokenVerifierContract,
): AuthServiceContract {
    function issueTokens(userId: number) {
        return {
            accessToken: tokenSigner.signAccessToken(userId),
            refreshToken: tokenSigner.signRefreshToken(userId),
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
            ...issueTokens(user.id),
        }
    }

    async function refresh(refreshToken: string) {
        const userId = tokenVerifier.verifyRefreshToken(refreshToken)

        const user = await userRepository.getById(userId)
        if (!user) {
            throw new Error("INVALID_REFRESH_TOKEN")
        }

        return issueTokens(user.id)
    }

    async function me(userId: number) {
        const user = await userRepository.getById(userId)
        if (!user) {
            throw new Error("UNAUTHORIZED")
        }

        return { id: user.id, email: user.email }
    }

    return { register, login, refresh, me }
}
