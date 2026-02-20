class ApiResponse {
    static success(res, message, data = {}, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static error(res, message, error = {}, statusCode = 500) {
        // Obtenir toutes les propriétés, même celles non-énumérables (message, stack, errors, etc.)
        const errorDetails = {};
        if (error) {
            Object.getOwnPropertyNames(error).forEach(key => {
                errorDetails[key] = error[key];
            });
            // Pour Mongoose ValidationErrors, on veut aussi le détail par champ
            if (error.errors) {
                errorDetails.errors = error.errors;
            }
        }

        return res.status(statusCode).json({
            success: false,
            message,
            error: errorDetails
        });
    }
    static notFound(res, message = "Not Found", data = {}, statusCode = 404) {
        return res.status(statusCode).json({
            success: false,
            message,
            data
        });
    }
}

export default ApiResponse;