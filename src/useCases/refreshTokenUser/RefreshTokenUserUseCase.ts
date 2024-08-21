import dayjs from "dayjs";
import { client } from "../../prisma/client"
import { GenerateTokenProvider } from "../../provider/GenerateTokenProvider";
import { GenerateRefreshTokenProvider } from "../../provider/GenerateRefreshTokenProvider";



export class RefreshTokenUserUseCase {

    async execute(refresh_token: string) {
        const refreshToken = await client.refreshToken.findFirst({
            where: {
                id: refresh_token,
            }
        })

        if (!refreshToken) {
            throw new Error("Refresh token invalid");
        }

        const generateTokenProvider = new GenerateTokenProvider();
        const token = await generateTokenProvider.execute(refreshToken.userId);
        
        const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn));
        if (refreshTokenExpired) {
            await client.refreshToken.delete({
                where: {
                    userId: refreshToken.userId,
                }
            })

            const generateRefreshTokenProvider = new GenerateRefreshTokenProvider();
            const newRefreshToken = await generateRefreshTokenProvider.execute(refreshToken.userId);

            return { token, refreshToken: newRefreshToken };
            
        }

        return { token };
    }
}
