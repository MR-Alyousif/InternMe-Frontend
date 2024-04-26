import { Schema } from 'mongoose'

import db from '../db'

// --------- Student ---------

type SkillType = 'technical' | 'soft'
type Skill = { _type: SkillType; skill: string }

type Project = { title: string; brief: string }

interface IProfileStudent {
  basicInfo: {
    name: {
      first: string
      last: string
    }
    // email: string [this is ommited as the User object already has this info]
    phone: string
    education: {
      university: string
      major: string
    }
    bio: string
    photo: string // fs path
  }
  skills: Skill[]
  projects: Project[]
  userUsername: string
}

const profileStudentSchema = new Schema<IProfileStudent>({
  basicInfo: {
    name: {
      first: { type: String, required: false, default: '' },
      last: { type: String, required: false, default: '' }
    },
    // email: String [this is ommited as the User object already has this info]
    phone: { type: String, required: false, default: '' },
    education: {
      university: { type: String, required: false, default: '' },
      major: { type: String, required: false, default: '' }
    },
    bio: { type: String, required: false, default: '' },
    photo: String // fs path
  },
  skills: [{ _type: String, skill: String }],
  projects: [{ title: String, brief: String }],
  userUsername: { type: String, required: true, unique: true }
})

const ProfileStudent = db.model<IProfileStudent>(
  'ProfileStudent',
  profileStudentSchema
)

export { ProfileStudent }

// --------- Company ---------

interface IProfileCompany {
  basicInfo: {
    name: string
    website: string
    location: string
    // email: string [this is ommited as the User object already has this info]
    phone: string
    logo: string // fs path
  }
  userUsername: string
}

const profileCompanySchema = new Schema<IProfileCompany>({
  basicInfo: {
    name: { type: String, required: false, default: '' },
    website: { type: String, required: false, default: '' },
    location: { type: String, required: false, default: '' },
    // email: String, [this is ommited as the User object already has this info]
    phone: { type: String, required: false, default: '' },
    logo: String // fs path
  },
  userUsername: { type: String, required: false, unique: true }
})

const ProfileCompany = db.model<IProfileCompany>(
  'ProfileCompany',
  profileCompanySchema
)

export { ProfileCompany }
