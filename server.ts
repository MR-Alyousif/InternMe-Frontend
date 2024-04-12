import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()
app.use(cors())

const routerV1 = express.Router()
routerV1.get('/ping', (req: Request, res: Response) => {
  res.send({ ping: 'pong' })
})
app.use('/api/v1', routerV1)

const port = process.env.API_PORT || 8080
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
