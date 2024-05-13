import { Schema } from 'mongoose'

import db from '../../db'

interface IMajor {
  value: string
}

const majorSchema = new Schema<IMajor>({
  value: { type: String, required: true }
})

const Major = db.model<IMajor>('Major', majorSchema)

export default Major
