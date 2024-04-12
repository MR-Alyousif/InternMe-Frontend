import { NextFunction, Request, Response } from 'express'
import jwt from 'jwt-simple'

import { IOnFlyUser } from '../models/user'

const secret = process.env.JWT_SECRET || '' // TODO: panic when no secret is provided

// authentication
function authenticate(req: Request, res: Response, next: NextFunction) {
  const jwtToken = req.headers['x-auth'] as string | null

  if (!jwtToken) {
    return res.status(401).json({ error: 'Missing X-Auth header' })
  }

  try {
    const onFlyUser: IOnFlyUser = jwt.decode(jwtToken, secret)
    req.user = onFlyUser
    next()
  } catch (ex) {
    res.status(401).json({ error: 'Invalid JWT' })
  }
}

// authorization
function authorizeOnlyStudent(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    throw Error(
      // for dumb programmers
      'This middleware is expected to be used after authentication. No user object has been found.'
    )
  }

  if (req.user.role !== 'student') {
    return res
      .status(403)
      .json({ error: 'Unauthorized; this action is only for students' })
  }

  next()
}

function authorizeOnlyCompany(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    throw Error(
      // for dumb programmers
      'This middleware is expected to be used after authentication. No user object has been found.'
    )
  }

  if (req.user.role !== 'company') {
    return res
      .status(403)
      .json({ error: 'Unauthorized; this action is only for companies' })
  }

  next()
}

export { authenticate, authorizeOnlyStudent, authorizeOnlyCompany }
