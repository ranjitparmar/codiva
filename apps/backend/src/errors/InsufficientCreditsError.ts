import { AppError } from "./AppError";

export class InsufficientCreditsError extends AppError {
    constructor(message= "Insufficient Credits"){
        super(message, 402)
    }
}