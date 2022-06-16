

import express from 'express'
import { checkUserExist } from '../../controller/CheckUserExist/CheckUserExist';

const router = express.Router()

router.post('/',checkUserExist)

export default router;