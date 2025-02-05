import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { checkAdmin, checkJwt } from "../middlewares/auth.middleware";

const router = Router()
const controller = new AuthController()

router.post('/register', controller.register)
router.post('/login', controller.login)
router.put('/update-profile', [checkJwt], controller.update)
router.get('/profile', [checkJwt], controller.profile)
router.get('/all-users', [checkJwt], [checkAdmin], controller.getAllUsers)
router.get('/user', [checkJwt], [checkAdmin], controller.getUser)
router.post('/create-user', [checkJwt], [checkAdmin], controller.create)
router.put('/edit-user', [checkJwt], [checkAdmin], controller.editUser)
router.delete('/', [checkJwt], [checkAdmin], controller.delete)

export { router as AuthRouter }