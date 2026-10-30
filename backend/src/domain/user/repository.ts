import type { User } from "./entity.js"

export type CreateUserInput = Omit<User, "id">

export interface UserRepositoryContract {
    create: (data: CreateUserInput) => Promise<User>
    getByEmail: (email: string) => Promise<User | undefined>
    getById: (id: number) => Promise<User | undefined>
}
