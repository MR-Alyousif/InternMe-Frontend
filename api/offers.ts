import express from 'express'

import { authenticate, authorizeOnlyCompany } from '../middlewares/auth'

const router = express.Router()
router.use(authenticate)

// create a new offer
router.post('', authorizeOnlyCompany, async (req, res) => {})

// list all offers (with filters)
router.get('', async (req, res) => {})

// get an offer by id
router.get('/:offerId', async (req, res) => {})

// delete an offer by id
router.delete('/:offerId', authorizeOnlyCompany, async (req, res) => {})

// update an offer by id
router.put('/:offerId', authorizeOnlyCompany, async (req, res) => {})

export default router
