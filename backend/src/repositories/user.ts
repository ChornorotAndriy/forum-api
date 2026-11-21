import type { UserRepositoryContract } from "../domain/user/repository.js"

type Database = typeof import("../prisma/db.js").db

export function createUserRepository(database: Database): UserRepositoryContract {
    async function create(data: Parameters<UserRepositoryContract["create"]>[0]) {
        try {
            return await database.orm.public.User.create(data)
        } catch (error) {
            if (error instanceof Error && "sqlState" in error && error.sqlState === "23505") {
                throw new Error("EMAIL_TAKEN")
            }

            throw error
        }
    }

    async function getByEmail(email: string) {
        const user = await database.orm.public.User.where({ email }).first()
        return user ?? undefined
    }

    async function getById(id: number) {
        const user = await database.orm.public.User.where({ id }).first()
        return user ?? undefined
    }

    return { create, getByEmail, getById }
}
