import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    try {
        let error = {...err};
        error.message = err.message;
        console.error(err);
        // Mongoose bad ObjectId error
        if (err.name === "CastError") {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new Error(message);
            error.statusCode = 400;
        }
        // Mongoose duplicate key error
        if (err.name === 11000) {
            const message = `Duplicate field value entered: ${JSON.stringify(err.keyValue)}`;
            error = new Error(message);
            error.statusCode = 400;
        }
        // Mongoose validation error
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map((val: any) => val.message).join(", ");
            error = new Error(message);
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Server Error"
        });


    } catch (error) {
        next(error);    
    }
}

export default errorMiddleware;