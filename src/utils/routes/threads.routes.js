import express from 'express'
import branchRoutes from '../../Threads/Branch/branch.routes.js'
import enterRoutes from '../../Threads/Enter/enter.routes.js'
import searchRoutes from '../../Threads/Search/search.routes.js'
import noticeRoutes from '../../Threads/Notice/notice.routes.js'

const app = express()

app.use('/user', enterRoutes)
app.use('/branch', branchRoutes)
app.use('/search', searchRoutes)
app.use('/notice', noticeRoutes)

export default app
