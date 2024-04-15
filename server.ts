import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import routerUsers from './api/users'
import routerProfiles from './api/profiles'
import routerOffers from './api/offers'

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false })) // application/x-www-form-urlencoded
app.use(bodyParser.json()) // application/json

const routerV1 = express.Router()
routerV1.get('/ping', (req, res) => res.send({ ping: 'pong' }))
routerV1.use('/users', routerUsers)
routerV1.use('/profiles', routerProfiles)
routerV1.use('/offers', routerOffers)
app.use('/api/v1', routerV1)

const port = process.env.API_PORT || 8080
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
