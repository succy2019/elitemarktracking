import {Hono} from 'hono'
import {login, changePassword} from '../controller/authController'

const authRoute = new Hono()
authRoute.post('/login', login)
authRoute.put('/change-password', changePassword)

export default authRoute;