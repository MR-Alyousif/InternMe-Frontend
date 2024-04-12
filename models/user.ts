import { Schema } from 'mongoose'

import db from '../db'

type Role = 'student' | 'company'

interface IUser {
  email: string
  username: string
  password: string // hashed
  role: Role
  profileId: string
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, required: true },
  profileId: Schema.ObjectId
})

const User = db.model<IUser>('User', userSchema)

// for authentication purposes
interface IOnFlyUser {
  username: string
  role: Role
}

export default User
export { IOnFlyUser }
