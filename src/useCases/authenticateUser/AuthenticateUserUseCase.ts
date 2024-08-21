import { compare } from "bcryptjs";
import { client } from "../../prisma/client"
import { GenerateRefreshTokenProvider } from "../../provider/GenerateRefreshTokenProvider";
import { GenerateTokenProvider } from "../../provider/GenerateTokenProvider";

interface IAuthRequest {
    username: string,
    password: string,
}

export class AuthenticateUserUseCase {
    async execute({ username, password }: IAuthRequest) {
        const userAlreadyExists = await client.user.findFirst({
            where: {
                username,
            },
        });

        if (!userAlreadyExists) {
            throw new Error("Username or password incorrect");
        }

        const passwordMatch = await compare(password, userAlreadyExists.password);

        if (!passwordMatch) {
            throw new Error("Username or password incorrect")
        }

        const generateTokenProvider = new GenerateTokenProvider();
        const token = await generateTokenProvider.execute(userAlreadyExists.id);

        await client.refreshToken.delete({
            where: {
                userId: userAlreadyExists.id,
            }
        })

        const generateRefreshTokenProvider  = new GenerateRefreshTokenProvider();
        const refreshToken = await generateRefreshTokenProvider.execute(userAlreadyExists.id);

        return { token, refreshToken };
    }
}
