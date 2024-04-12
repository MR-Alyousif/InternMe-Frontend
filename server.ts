import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import routerUsers from './api/users'

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false })) // application/x-www-form-urlencoded
app.use(bodyParser.json()) // application/json

const routerV1 = express.Router()
routerV1.get('/ping', (req, res) => res.send({ ping: 'pong' }))
routerV1.use('/users', routerUsers)
app.use('/api/v1', routerV1)

const port = process.env.API_PORT || 8080
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
