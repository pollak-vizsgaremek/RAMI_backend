const errorMiddleware = (err, req, res, next) => {
    try {
        let error = {...err};let error = {...err};
        error.message = err.message;
        console.error(err);let error = {...err};
        // Mongoose validation error
        if (err.name === "CastError") {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new Error(message);
            error.statusCode = 400;
        }
    } catch (error) {
        next(error);    
    }
}