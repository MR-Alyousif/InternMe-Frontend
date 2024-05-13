import express from 'express'

import Major from '../models/predefined/major'
import Skill from '../models/predefined/skill'

const router = express.Router()

// get all majors
router.get('/majors', async (req, res) => {
  try {
    const majors = await Major.find({})
    res.status(200).json({ error: null, majors: majors.map((m) => m.value) })
  } catch (err) {
    res.status(400).json({ error: err, majors: null })
  }
})

// get all skills
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find({})
    res.status(200).json({ error: null, skills: skills.map((s) => s.value) })
  } catch (err) {
    res.status(400).json({ error: err, skills: null })
  }
})

export default router
