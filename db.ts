// db.js
import db from 'mongoose'

const dbURL = process.env.DB_URL as string // don't provide a default url, if no url speficied the app should crash lol.
db.connect(dbURL)
  .then(() => {
    console.log(`Server connected to the db at ${dbURL}`)
  })
  .catch((err) => {
    console.log(`Unable to connect to the db at ${dbURL}`)
    console.log(`ERR: ${err}`)
  })

export default db
