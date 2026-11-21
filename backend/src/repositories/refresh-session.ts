import { Temporal } from "temporal-polyfill"
import type { RefreshSession } from "../domain/refresh-session/entity.js"
import type {
    CreateRefreshSessionInput,
    RefreshSessionRepositoryContract,
} from "../domain/refresh-session/repository.js"

type Database = typeof import("../prisma/db.js").db


function toInstant(date: Date) {
    return Temporal.Instant.fromEpochMilliseconds(date.getTime())
}

function toDate(instant: { epochMilliseconds: number }) {
    return new Date(instant.epochMilliseconds)
}

function toRefreshSession(row: {
    id: number
    tokenHash: string
    userId: number
    createdAt: { epochMilliseconds: number }
    expiresAt: { epochMilliseconds: number }
}): RefreshSession {
    return {
        id: row.id,
        tokenHash: row.tokenHash,
        userId: row.userId,
        createdAt: toDate(row.createdAt),
        expiresAt: toDate(row.expiresAt),
    }
}

export function createRefreshSessionRepository(database: Database): RefreshSessionRepositoryContract {
    async function create(data: CreateRefreshSessionInput) {
        const session = await database.orm.public.RefreshSession.create({
            tokenHash: data.tokenHash,
            userId: data.userId,
            expiresAt: toInstant(data.expiresAt),
        })

        return toRefreshSession(session)
    }

    async function getByTokenHash(tokenHash: string) {
        const session = await database.orm.public.RefreshSession.where({ tokenHash }).first()
        return session ? toRefreshSession(session) : undefined
    }

    async function rotate(oldTokenHash: string, newTokenHash: string, expiresAt: Date) {
        const count = await database.orm.public.RefreshSession
            .where({ tokenHash: oldTokenHash })
            .updateAndCount({ tokenHash: newTokenHash, expiresAt: toInstant(expiresAt) })

        return count > 0
    }

    async function deleteByTokenHash(tokenHash: string) {
        const deleted = await database.orm.public.RefreshSession.where({ tokenHash }).delete()
        return deleted !== null
    }

    return { create, getByTokenHash, rotate, deleteByTokenHash }
}
