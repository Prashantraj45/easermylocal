import express from "express"
import { createNotification, deleteNotification } from "../../controller/Notification/Notification"

const router = express.Router()

router.post('/',createNotification)

router.delete('/:id',deleteNotification)

export default router;