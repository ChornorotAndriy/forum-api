import type { RefreshSession } from "./entity.js"

export type CreateRefreshSessionInput = Pick<RefreshSession, "tokenHash" | "userId" | "expiresAt">

export interface RefreshSessionRepositoryContract {
    create: (data: CreateRefreshSessionInput) => Promise<RefreshSession>
    getByTokenHash: (tokenHash: string) => Promise<RefreshSession | undefined>
    rotate: (oldTokenHash: string, newTokenHash: string, expiresAt: Date) => Promise<boolean>
    deleteByTokenHash: (tokenHash: string) => Promise<boolean>
}
