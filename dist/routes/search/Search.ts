import express from 'express'
import { search } from '../../controller/SearchAPI'
import { checkTokenAndPermission } from '../../middleware/middlewares';

const router =express.Router()

router.get('/',checkTokenAndPermission(["USER","PARTNER","ADMIN"]),search)

export default router;