import { Schema } from 'mongoose'

import db from '../db'

interface IOffer {
  name: string
  description: string
  startingDate: Date
  duration: string
  locaiton: string
  url: string
  major: string
  requiredGPA: {
    outOf4: number
    outOf5: number
  }
  skills: string[]
  responsibilities: string
  qualifications: string
}

const offerSchema = new Schema<IOffer>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startingDate: { type: Date, required: true },
  duration: { type: String, required: true },
  locaiton: { type: String, required: true },
  url: { type: String, required: true },
  major: { type: String, required: true },
  requiredGPA: {
    outOf4: { type: Number, required: true },
    outOf5: { type: Number, required: true }
  },
  skills: { type: [String], required: true },
  responsibilities: { type: String, required: true },
  qualifications: { type: String, required: true }
})

const Offer = db.model<IOffer>('Offer', offerSchema)

export default Offer
