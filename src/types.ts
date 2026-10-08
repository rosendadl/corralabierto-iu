export type Role = 'USER' | 'ADMIN'

export type User = {
    username: string
    role: Role
}

export type MeResponse = {
    username: string
    role: Role
    expiresAt: string | number
}
