import express from 'express';
import {SendmailController} from '../../controller/SendmailController'

let router = express.Router()

export default router.post('/sendmail',SendmailController)


