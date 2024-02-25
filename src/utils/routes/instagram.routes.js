import express from 'express'
import userRoutes from '../../Auth/auth.routes.js'
import chatRoutes from '../../Chat/chat.routes.js'
import postRoutes from '../../Post/post.routes.js'
import favoriteRoutes from '../../Favorite/favorite.routes.js'
import savesRoutes from '../../Saves/saves.routes.js'
import historyRoutes from '../../History/history.routes.js'
import archiveRoutes from '../../Archive/archive.routes.js'
import searchRoutes from '../../Search/search.routes.js'
import hashtagRoutes from '../../Hashtag/hashtag.routes.js'
import adminRoutes from '../../Admin/admin.routes.js'
import notRoutes from '../../Notification/not.routes.js'

const app = express()


app.use('/user', userRoutes)
app.use('/chat', chatRoutes)
app.use('/post', postRoutes)
app.use('/history', historyRoutes)
app.use('/archive', archiveRoutes)
app.use('/favorites', favoriteRoutes)
app.use('/saves', savesRoutes)
app.use('/search', searchRoutes)
app.use('/hashtag', hashtagRoutes)
app.use('/admin', adminRoutes)
app.use('/notifications', notRoutes)

export default app