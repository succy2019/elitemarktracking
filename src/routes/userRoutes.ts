import {Hono} from 'hono'
import {newUser, userUpdate, deleteUser, getUser, getUserById, getUserByTrackId, updateUserProgress} from '../controller/userController'

const userRoute = new Hono()

userRoute.post('/new', newUser)            
userRoute.put('/update', userUpdate)
userRoute.put('/progress', updateUserProgress)
userRoute.get('/all', getUser)
userRoute.get('/track/:trackId', getUserByTrackId)
userRoute.get('/:id', getUserById)
userRoute.delete('/delete', deleteUser)

export default userRoute;
        



