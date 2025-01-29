import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { checkAdmin, checkJwt } from '../middlewares/auth.middleware';

const router = Router()
const controller = new TaskController()

router.post('/', [checkJwt], [checkAdmin], controller.create)
router.get('/', [checkJwt], controller.getTask)
router.get('/all/', [checkJwt], [checkAdmin], controller.getAllTask)
router.get('/by-id/', [checkJwt], [checkAdmin], controller.getTaskById)
router.put('/', [checkJwt], [checkAdmin], controller.update)
router.put('/update-status', [checkJwt], controller.updateStatus)
router.delete('/', [checkJwt], [checkAdmin], controller.delete)




export { router as TaskRouter }