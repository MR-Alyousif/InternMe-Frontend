import express from 'express'
import jwt from 'jwt-simple'
import bcrypt from 'bcryptjs'

import User, { IOnFlyUser } from '../models/user'
import { ProfileCompany, ProfileStudent } from '../models/profile'
import { authenticate } from '../middlewares/auth'

const router = express.Router()

const secret = process.env.JWT_SECRET || '' // TODO: panic when no secret is provided

// create a new account
router.post('/register', async (req, res) => {
  const email = req.body.email.toLowerCase()
  const username = req.body.username.toLowerCase()
  const password = req.body.password
  const role = req.body.role.toLowerCase()

  // TODO: validate with regex
  if (
    !(
      email &&
      username &&
      password &&
      (role === 'student' || role === 'company')
    )
  ) {
    res.status(400).json({
      error: 'Missing email, username, password, and/or role'
    })
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const newUser = new User({
    email: email,
    username: username,
    password: passwordHash,
    role: role
  })
  const newProfile = // this shit is full of defaults, don't worry.
    role === 'student'
      ? new ProfileStudent({ userUsername: username, 'basicInfo.email': email })
      : new ProfileCompany({ userUsername: username, 'basicInfo.email': email })

  try {
    const user = await newUser.save()
    const profile = await newProfile.save()
    await user.set('profileId', profile._id).save()
    res.status(201).json({ error: null })
  } catch (err) {
    res.status(400).json({ error: err })
  }
})

// login (get a jwt token)
router.post('/login', async (req, res) => {
  const username = req.body.username.toLowerCase()
  const password = req.body.password

  // TODO: validate with regex
  if (!(username && password)) {
    res.status(401).json({
      error: 'Missing username and/or password',
      token: null,
      role: null
    })
    return
  }

  try {
    const user = await User.findOne({ username: username })
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      if (isPasswordCorrect) {
        const onFlyUser: IOnFlyUser = {
          username: user.username,
          role: user.role
        }
        const jwtToken = jwt.encode(onFlyUser, secret)
        res.status(200).json({ error: null, token: jwtToken, role: user.role })
        return
      }
    }
    res.status(401).json({
      error: 'Incorrect username or password',
      token: null,
      role: null
    })
  } catch (err) {
    res.status(400).json({ error: err, token: null, role: null })
  }
})

// get current user's data
router.get('/me', authenticate, async (req, res) => {
  const username = req.user?.username
  try {
    const user = await User.findOne(
      { username: username },
      'email username role profileId'
    )
    if (user) {
      res.status(200).json({ error: null, user: user })
    } else {
      res
        .status(404)
        .json({ error: `User '${username}' not found`, user: null })
    }
  } catch (err) {
    res.status(400).json({ error: err, user: null })
  }
})

// get a user by username
router.get('/:username', authenticate, async (req, res) => {
  const username = req.params.username.toLowerCase()
  try {
    const user = await User.findOne(
      { username: username },
      'email username role profileId -_id'
    )
    if (user) {
      res.status(200).json({ error: null, user: user })
    } else {
      res
        .status(404)
        .json({ error: `User '${username}' not found`, user: null })
    }
  } catch (err) {
    res.status(400).json({ error: err, user: null })
  }
})

export default router
