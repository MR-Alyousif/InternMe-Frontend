import express from 'express'
import multer from 'multer'
import base64url from 'base64url'
import fs from 'fs'
import fsAsync from 'fs/promises'
import path from 'path'
import { v4 } from 'uuid'

import { authenticate, authorizeOnlyStudent } from '../middlewares/auth'
import { ProfileCompany, ProfileStudent } from '../models/profile'
import { autoSetFields } from '../models/utils/helper'
import User from '../models/user'
import diskStorageEngine from './utils/diskStorageEngine'

const FS_STORAGE_PATH = 'fs-storage'

const router = express.Router()
router.use('/static', express.static(FS_STORAGE_PATH))
router.use(authenticate) // all `/profiles` routes are authenticated except '/static'

// get current user's profile data
router.get('/me', async (req, res) => {
  const username = req.user?.username
  const isStudent = req.user?.role === 'student' // not totally safe? i know i know.
  try {
    const ProfileModel = isStudent ? ProfileStudent : ProfileCompany
    const profile = await (ProfileModel as any).findOne(
      { userUsername: username },
      '-_id -__v -skills._id -projects._id'
    )
    if (profile) {
      res.status(200).json({ error: null, profile: profile })
    } else {
      res.status(404).json({
        error: `User '${username}' profile's not found`,
        profile: null
      })
    }
  } catch (err) {
    res.status(400).json({ error: err, profile: null })
  }
})

// get profile data by username
router.get('/:username', async (req, res) => {
  const username = req.params.username
  try {
    const user = await User.findOne({ username: username })
    if (!user)
      return res
        .status(404)
        .json({ error: `User '${username}' not found`, profile: null })
    const isStudent = user.role === 'student'

    const ProfileModel = isStudent ? ProfileStudent : ProfileCompany
    const profile = await (ProfileModel as any).findOne(
      { userUsername: username },
      '-_id -__v -skills._id -projects._id'
    )
    if (profile) {
      res.status(200).json({ error: null, profile: profile })
    } else {
      res.status(404).json({
        error: `User '${username}' profile's not found`,
        profile: null
      })
    }
  } catch (err) {
    res.status(400).json({ error: err, profile: null })
  }
})

// update profile basic information
router.put('/basic', async (req, res) => {
  const basicInfo = req.body.basicInfo
  if (!basicInfo) {
    res.status(400).json({ error: 'Missing basicInfo' })
    return
  }

  const username = req.user?.username
  const isStudent = req.user?.role === 'student' // not totally safe? i know i know.
  try {
    const ProfileModel = isStudent ? ProfileStudent : ProfileCompany
    const profile = await (ProfileModel as any).findOne({
      userUsername: username
    })
    if (profile) {
      autoSetFields(profile, basicInfo, 'basicInfo')
      await profile.save()
      res.status(200).json({ error: null })
    } else {
      res.status(404).json({
        error: `User '${username}' profile's not found`
      })
    }
  } catch (err) {
    res.status(400).json({ error: err })
  }
})

// update profile skills
router.put('/skills', authorizeOnlyStudent, async (req, res) => {
  const skills = req.body.skills
  if (!skills) {
    res.status(400).json({ error: 'Missing skills' })
    return
  }
  // NOTE: i know that this way of type validation sucks but i think it's good
  //        enough to be shipped in a project for educational purposes lmfao.
  if (skills.length === undefined) {
    res.status(400).json({ error: 'skills should be an array' })
    return
  }

  const username = req.user?.username
  try {
    const profile = await ProfileStudent.findOne({
      userUsername: username
    })
    if (profile) {
      await profile.set('skills', skills).save()
      res.status(200).json({ error: null })
    } else {
      res.status(404).json({
        error: `User '${username}' profile's not found`
      })
    }
  } catch (err) {
    res.status(400).json({ error: err })
  }
})

// update profile projects
router.put('/projects', authorizeOnlyStudent, async (req, res) => {
  const projects = req.body.projects
  if (!projects) {
    res.status(400).json({ error: 'Missing projects' })
    return
  }
  // NOTE: i know that this way of type validation sucks but i think it's good
  //        enough to be shipped in a project for educational purposes lmfao.
  if (projects.length === undefined) {
    res.status(400).json({ error: 'projects should be an array' })
    return
  }
  for (const project of projects) {
    if (typeof project.title !== 'string') {
      res.status(400).json({ error: 'project.title should be of type string' })
      return
    }
    if (typeof project.brief !== 'string') {
      res.status(400).json({ error: 'project.brief should be of type string' })
      return
    }
  }

  const username = req.user?.username
  try {
    const profile = await ProfileStudent.findOne({
      userUsername: username
    })
    if (profile) {
      await profile.set('projects', projects).save()
      res.status(200).json({ error: null })
    } else {
      res.status(404).json({
        error: `User '${username}' profile's not found`
      })
    }
  } catch (err) {
    res.status(400).json({ error: err })
  }
})

const FS_STORAGE = multer({
  storage: diskStorageEngine({
    // TODO: add a type declaration file for this.
    // @ts-ignore
    destination: (req, file, cb) => {
      cb(null, FS_STORAGE_PATH)
    },
    // TODO: add a type declaration file for this.
    // @ts-ignore
    filename: (req, file, cb) => {
      const uuidv4 = v4().replace(/-/g, '')
      const base64uuidv4 = base64url(Buffer.from(uuidv4, 'hex'))
      const ext = path.extname(file.originalname)
      req.filename = `${base64uuidv4}${ext}`
      cb(null, req.filename)
    }
  }),
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname)
    if (!(ext === '.png' || ext === '.jpg' || ext === '.jpeg')) {
      req.fileValidationError = 'Only .png, .jpg, and .jpeg are allowed!'
      return cb(null, false)
    }
    cb(null, true)
  },
  limits: {
    files: 1,
    // TODO: fix fileSize limit issue with pipeing.
    //      fileSize: 8 * 1024 * 1024,
    fields: 0
  }
}).single('file')

// TODO: update all company's offers if logo changed!
router.post('/img/upload', (req, res) => {
  FS_STORAGE(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: err.message, filename: null })
    } else if (err) {
      res.status(400).json({ error: err, filename: null })
    } else if (req.fileValidationError) {
      res.status(400).json({ error: req.fileValidationError, filename: null })
    } else {
      const username = req.user?.username
      const isStudent = req.user?.role === 'student'
      const newFilePath = path.join(FS_STORAGE_PATH, req.filename as string)
      try {
        const profileModel = isStudent ? ProfileStudent : ProfileCompany
        const profileAttr = isStudent ? 'photo' : 'logo'
        const profile = await (profileModel as any).findOne(
          { userUsername: username },
          `basicInfo.${profileAttr}`
        )
        if (profile) {
          // remove old file associated with user
          const oldFileName = profile.basicInfo[profileAttr] || ''
          const oldFilePath = path.join(FS_STORAGE_PATH, oldFileName)
          removeFileIfExists(oldFilePath)

          await profile.set(`basicInfo.${profileAttr}`, req.filename).save()
          res.status(201).json({ error: null, filename: req.filename })
        } else {
          // rollback first
          removeFileIfExists(newFilePath)

          res.status(404).json({
            error: `User '${username}' profile's not found`,
            filename: null
          })
        }
      } catch (err) {
        // rollback first
        removeFileIfExists(newFilePath)

        res.status(400).json({ error: err, filename: null })
      }
    }
  })
})

async function removeFileIfExists(filePath: string) {
  const isFileExists = fs.existsSync(filePath)
  if (isFileExists) {
    const isFile = fs.lstatSync(filePath).isFile()
    if (isFile) {
      await fsAsync.unlink(filePath)
    }
  }
}

export default router
