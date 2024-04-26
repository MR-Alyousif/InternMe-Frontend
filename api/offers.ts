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
  const duration = req.body.duration
  const location = req.body.location
  const url = req.body.url
  const major = req.body.major
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
      duration &&
      location &&
      url &&
      major &&
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
  } catch (err) {
    return res.status(400).json({ error: err })
  }

  const newOffer = new Offer({
    name: name,
    description: description,
    startingDate: startingDate,
    duration: duration,
    location: location,
    url: url,
    major: major,
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
  // HERE should get the one and only parameter to the filter
  const filter = req.query.filter

  try {
    const offers = await Offer.find(
      { startingDate: { $gt: new Date() } },
      'company.name company.logo name startingDate duration location description skills'
    )
    // This code is commented until it's fixed. stop being dumb.
    /*
    let filteredOffers
    switch (filter) {
      case 'gpa':
        filteredOffers = offers.filter((offer) => {
          return offer.requiredGPA.outOf4 <= 3 || offer.requiredGPA.outOf5 <= 4
        })
        break
      case 'date':
        // Apply date filter logic here
        // Example: query = { ...query, startingDate: { $gt: req.query.startDate } };
        break
      case 'location':
        // Apply location filter logic here
        // Example: query = { ...query, location: req.query.location };
        break
      default:
        break
    }

    if (filteredOffers.length > 0) {
      res.status(200).json({ error: null, offers: offers })
    } else {
      res.status(404).json({ error: 'no offers available', offers: null })
    }
    */
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
