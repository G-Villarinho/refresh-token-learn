import { sign } from "jsonwebtoken";

export class GenerateTokenProvider {
    async execute(userId: string) {
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            throw new Error("Internal server error");
        }

        const token = sign({}, secretKey, {
            subject: userId,
            expiresIn: "20s"
        });

        return token;
    }
}
