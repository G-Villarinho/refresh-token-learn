import { Router } from "express";
import { CreateUserController } from "./useCases/createUser/CreateUserController";
import { AuthenticateUserController } from "./useCases/authenticateUser/AuthenticateUserController";
import { ensureAuthenticated } from "./middlewares/ensureAuthenticated";
import { RefreshTokenUserController } from "./useCases/refreshTokenUser/RefreshTokenUserController";

const router = Router();

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();
const refreshTokenUserController = new RefreshTokenUserController();

router.post("/users", createUserController.handle);
router.post("/sign-in", authenticateUserController.handle);
router.post("/refresh-token", refreshTokenUserController.handler);


router.get("/movies", ensureAuthenticated, (request, response) => {
    return response.json([
        { id: 1, name: "The Shawshank Redemption"},
        { id: 2, name: "The Godfather"},
        { id: 3, name: "The Dark Knight"},
        { id: 4, name: "The Godfather Part II"},
        { id: 5, name: "12 Angry Men"},
        { id: 6, name: "Schindler's List"},
        { id: 7, name: "The Lord of the Rings: The Return of the King"},
        { id: 8, name: "Pulp Fiction"},
        { id: 9, name: "The Lord of the Rings: The Fellowship of the Ring"},
        { id: 10, name: "The Good, the Bad and the Ugly"},
    ])
})

export { router };