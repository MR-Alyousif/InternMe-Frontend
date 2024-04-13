import { Schema } from 'mongoose'

import db from '../db'

// --------- Student ---------

type SkillType = 'technical' | 'soft'
type Skill = { type: SkillType; skill: string }

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
    resume: string // fs path
  }
  skills: Skill[]
  projects: Project[]
}

const profileStudentSchema = new Schema<IProfileStudent>({
  basicInfo: {
    name: {
      first: String,
      last: String
    },
    // email: String [this is ommited as the User object already has this info]
    phone: String,
    education: {
      university: String,
      major: String
    },
    bio: String,
    resume: String // fs path
  },
  skills: [{ type: String, skill: String }],
  projects: [{ title: String, brief: String }]
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
}

const profileCompanySchema = new Schema<IProfileCompany>({
  basicInfo: {
    name: String,
    website: String,
    location: String,
    // email: String, [this is ommited as the User object already has this info]
    phone: String,
    logo: String // fs path
  }
})

const ProfileCompany = db.model<IProfileCompany>(
  'ProfileCompany',
  profileCompanySchema
)

export { ProfileCompany }
