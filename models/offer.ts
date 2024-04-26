import { Schema } from 'mongoose'

import db from '../db'

interface IOffer {
  name: string
  description: string
  startingDate: Date
  durationInWeeks: number // integer
  location: string
  url: string
  majors: string[]
  requiredGPA: {
    outOf4: number
    outOf5: number
  }
  skills: string[]
  responsibilities: string[]
  qualifications: string[]
  company: {
    name: string
    logo: string // fs path
    username: string
  }
}

const offerSchema = new Schema<IOffer>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startingDate: { type: Date, required: true },
  durationInWeeks: { type: Number, required: true }, // integer
  location: { type: String, required: true },
  url: { type: String, required: true },
  majors: { type: [String], required: true },
  requiredGPA: {
    outOf4: { type: Number, required: true },
    outOf5: { type: Number, required: true }
  },
  skills: { type: [String], required: true },
  responsibilities: { type: [String], required: true },
  qualifications: { type: [String], required: true },
  company: {
    type: {
      // redundent? this is nosql son! otherwise we'll sacrifice the performance.
      name: { type: String, required: true },
      logo: { type: String, required: true }, // fs path
      username: { type: String, required: true }
    },
    required: true
  }
})

const Offer = db.model<IOffer>('Offer', offerSchema)

export default Offer
