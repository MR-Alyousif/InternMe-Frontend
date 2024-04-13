import express from 'express'

import { ProfileCompany, ProfileStudent } from '../models/profile'
import { authenticate, authorizeOnlyStudent } from '../middlewares/auth'
import { autoSetFields } from '../models/utils/helper'
import User from '../models/user'

const router = express.Router()
router.use(authenticate) // all `/profiles` routes are authenticated

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
  for (const skill of skills) {
    if (!(skill._type === 'technical' || skill._type === 'soft')) {
      res
        .status(400)
        .json({ error: "skill._type should be either 'technical' or 'soft'" })
      return
    }
    if (typeof skill.skill !== 'string') {
      res.status(400).json({ error: 'skill.skill should be of type string' })
      return
    }
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

export default router
