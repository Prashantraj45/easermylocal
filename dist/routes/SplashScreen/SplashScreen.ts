import express from 'express'
import {add,updateSplashScreen, getAllScreens, deleteSplashScreen, getScreenByID, getAllScreensAdmin} from '../../controller/SplashScreen/SplashScreen'
import { checkTokenAndPermission,checkGuestAccess } from '../../middleware/middlewares'

const router = express.Router()

//------------------> For apk with basic auth
router.get('/',checkGuestAccess(),getAllScreens)

//------------------> For apk with basic auth
// router.get('/all',checkGuestAccess(),getAllScreensAdmin)

router.get('/admin/all',checkTokenAndPermission(["ADMIN"]),getAllScreensAdmin)

router.post('/',checkTokenAndPermission(["ADMIN"]),add)

router.put('/:id',checkTokenAndPermission(["ADMIN"]),updateSplashScreen)

router.delete('/:id',checkTokenAndPermission(["ADMIN"]),deleteSplashScreen)

router.get('/:id',checkTokenAndPermission(["ADMIN"]),getScreenByID)


export default router