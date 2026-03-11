import { AppError } from "./AppError";

export class ConflictError extends AppError {
    constructor(message= "Already Exists"){
        super(message, 409)
    }
}