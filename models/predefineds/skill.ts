import { Schema } from 'mongoose'

import db from '../../db'

interface ISkill {
  value: string
}

const skillSchema = new Schema<ISkill>({
  value: { type: String, required: true }
})

const Skill = db.model<ISkill>('Skill', skillSchema)

export default Skill
