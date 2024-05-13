// import this file in server.ts so it executes the data initialization.

import Major from './major'
import Skill from './skill'

const predefinedMajors: string[] = ['CS', 'SWE', 'ME']
const predefinedSkills: string[] = [
  'UI/UX',
  'Figma',
  'Angular',
  'Solidwork',
  'Estimation',
  'Fluids',
  'Web'
]

Major.countDocuments({})
  .exec()
  .then((count) => {
    if (count === 0) {
      Major.create(
        predefinedMajors.map((major) => {
          return { value: major }
        })
      )
      console.log("'majors' has been initialized")
    } else {
      console.log("'majors' initialization skipped")
    }
  })
  .catch((err) => console.log(`Unable to initialize 'majors': ${err}`))

Skill.countDocuments({})
  .exec()
  .then((count) => {
    if (count === 0) {
      Skill.create(
        predefinedSkills.map((skill) => {
          return { value: skill }
        })
      )
      console.log("'skills' has been initialized")
    } else {
      console.log("'skills' initialization skipped")
    }
  })
  .catch((err) => console.log(`Unable to initialize 'skills': ${err}`))
