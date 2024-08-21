import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization;
    const secretKey = process.env.SECRET_KEY;
    
    if (!secretKey) {
        return response.status(500).json({
            message: "Internal server error",
        });
    }

    if (!authToken) {
        return response.status(401).json({
            message: "Token is missing",
        });
    }

    const [, token] = authToken.split(" ");

    try {
        verify(token, secretKey);
        return next();
    } catch (error) {
        return response.status(401).json({
            message: "Token invalid",
        })
    }
}