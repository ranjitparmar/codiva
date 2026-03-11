export class AppError extends Error{
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, stausCode: number, isOperational = true){
        super(message)
        this.statusCode = stausCode
        this.isOperational = isOperational
    }
}