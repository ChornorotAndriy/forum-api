export interface RefreshSession {
    id: number
    tokenHash: string
    userId: number
    createdAt: Date
    expiresAt: Date
}
