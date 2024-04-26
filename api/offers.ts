import express from 'express'

import Offer from '../models/offer'
import { authenticate, authorizeOnlyCompany } from '../middlewares/auth'
import { autoSetFields } from '../models/utils/helper'
import { ProfileCompany } from '../models/profile'

const router = express.Router()
router.use(authenticate)

// create a new offer
router.post('/create', authorizeOnlyCompany, async (req, res) => {
  const name = req.body.name
  const description = req.body.description
  const startingDate = req.body.startingDate
  const durationInWeeks = req.body.durationInWeeks
  const location = req.body.location
  const url = req.body.url
  const majors = req.body.majors
  const requiredGPA4 = req.body.requiredGPA.outOf4
  const requiredGPA5 = req.body.requiredGPA.outOf5
  const skills = req.body.skills
  const responsibilities = req.body.responsibilities
  const qualifications = req.body.qualifications

  // TODO: pethatic validation, do better
  if (
    !(
      name &&
      description &&
      startingDate &&
      durationInWeeks &&
      location &&
      url &&
      majors &&
      requiredGPA4 &&
      requiredGPA5 &&
      skills &&
      skills.length > 0 &&
      responsibilities &&
      qualifications
    )
  ) {
    res.status(400).json({
      error: 'Missing one or more required fields'
    })
    return
  }

  const companyUsername = req.user?.username
  let companyName, companyLogo
  try {
    const profile = await ProfileCompany.findOne({
      userUsername: companyUsername
    })
    if (!profile) {
      return res
        .status(404)
        .json({ error: `profile '${companyUsername}' not found` })
    }
    companyName = profile.basicInfo.name
    companyLogo = profile.logo
    if (!companyLogo) {
      return res.status(400).json({
        error: `company '${companyName}' profile is incomplete: missing company logo`
      })
    }
  } catch (err) {
    return res.status(400).json({ error: err })
  }

  const newOffer = new Offer({
    name: name,
    description: description,
    startingDate: startingDate,
    durationInWeeks: durationInWeeks,
    location: location,
    url: url,
    majors: majors,
    requiredGPA: {
      outOf4: requiredGPA4,
      outOf5: requiredGPA5
    },
    skills: skills,
    responsibilities: responsibilities,
    qualifications: qualifications,
    company: {
      name: companyName,
      logo: companyLogo,
      username: companyUsername
    }
  })

  try {
    await newOffer.save()
    res.status(201).json({ error: null })
  } catch (err) {
    res.status(400).json({ error: err })
  }
})

// list all offers (with filters)
router.get('/list', async (req, res) => {
  const majors = req.query.majors as string
  const skills = req.query.skills as string
  const gpaOutOf4 = req.query.gpaOutOf4 as string
  const gpaOutOf5 = req.query.gpaOutOf5 as string
  const durationInWeeks = req.query.durationInWeeks as string

  const page = req.query.page as string
  let _page = 1
  if (page) {
    _page = parseInt(page)
    if (_page < 1)
      return res.status(400).json({
        error: 'page must be an integer greater than 0',
        offers: null
      })
  }

  const limit = req.query.limit as string
  let _limit = 10
  if (limit) {
    _limit = parseInt(limit)
    if (_limit < 1)
      return res.status(400).json({
        error: 'limit must be an integer greater than 0',
        offers: null
      })
  }

  const requiredOutput =
    'company.name company.logo name startingDate durationInWeeks location description skills'
  const baseQuery = { startingDate: { $gt: new Date() } }

  try {
    let query: object = baseQuery
    if (majors) {
      query = { ...query, majors: { $in: majors.split(',') } }
    }
    if (skills) {
      query = { ...query, skills: { $in: skills.split(',') } }
    }
    if (gpaOutOf4) {
      query = {
        ...query,
        'requiredGPA.outOf4': { $lte: parseFloat(gpaOutOf4) }
      }
    }
    if (gpaOutOf5) {
      query = {
        ...query,
        'requiredGPA.outOf5': { $lte: parseFloat(gpaOutOf5) }
      }
    }
    if (durationInWeeks) {
      query = { ...query, durationInWeeks: { $lte: parseInt(durationInWeeks) } }
    }

    // skip accepts zero but err if negative, -1 to make request accept only 1 and above
    const offers = await Offer.find(query, requiredOutput, {
      limit: _limit,
      skip: (parseInt(page) - 1) * _limit
    })

    res.status(200).json({ error: null, offers: offers })
  } catch (err) {
    res.status(400).json({ error: err, offers: null })
  }
})

// list all calling company offers
router.get('/list/self', authorizeOnlyCompany, async (req, res) => {
  const username = req.user?.username
  try {
    const offers = await Offer.find(
      { 'company.username': username },
      'company.name company.logo name startingDate durationInWeeks location description skills'
    )
    res.status(200).json({ error: null, offers: offers })
  } catch (err) {
    res.status(400).json({ error: err, offers: null })
  }
})

// get an offer by id
router.get('/:offerId', async (req, res) => {
  const id = req.params.offerId
  try {
    const offer = await Offer.findOne(
      { _id: id },
      'company.name company.logo description responsibilities qualifications -_id'
    )

    if (offer) {
      res.status(200).json({ error: null, offer: offer })
    } else {
      res
        .status(404)
        .json({ error: `offer with id '${id}' not found`, offer: null })
    }
  } catch (err) {
    res.status(400).json({ error: err, offer: null })
  }
})

// delete an offer by id
router.delete('/:offerId', authorizeOnlyCompany, async (req, res) => {
  const id = req.params.offerId
  try {
    const offer = await Offer.findOneAndDelete({ _id: id })

    if (offer) {
      res.status(200).json({ error: null })
    } else {
      res.status(404).json({ error: `offer with id '${id}' not found` })
    }
  } catch (err) {
    res.status(400).json({ error: err })
  }
})

// update an offer by id
router.put('/:offerId', authorizeOnlyCompany, async (req, res) => {
  const updatedInfo = req.body
  if (!updatedInfo) {
    res.status(400).json({ error: 'Missing updated info' })
    return
  }

  try {
    const id = req.params.offerId
    const offer = await Offer.findOne({ _id: id })

    if (offer) {
      autoSetFields(offer, updatedInfo)
      await offer.save()
      res.status(200).json({ error: null })
    } else {
      res.status(404).json({ error: `offer with id '${id}' not found` })
    }
  } catch (err) {
    res.status(400).json({ error: err })
  }
})

export default router
