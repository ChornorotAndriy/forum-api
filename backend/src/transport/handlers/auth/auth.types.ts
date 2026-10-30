import type { Request, Response } from "express"
import type { AuthCredentialsRequest } from "../../dto/requests.js"
import type { MessageResponse, UserResponse } from "../../dto/responses.js"
import type { ErrorResponse } from "../../dto/errors.js"

export interface AuthHandlerContract {
    register: (
        req: Request<{}, {}, AuthCredentialsRequest>,
        res: Response<UserResponse | ErrorResponse>
    ) => Promise<void>
    login: (
        req: Request<{}, {}, AuthCredentialsRequest>,
        res: Response<UserResponse | ErrorResponse>
    ) => Promise<void>
    refresh: (
        req: Request,
        res: Response<MessageResponse | ErrorResponse>
    ) => Promise<void>
    me: (
        req: Request,
        res: Response<UserResponse | ErrorResponse>
    ) => Promise<void>
}
