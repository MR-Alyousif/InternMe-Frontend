import { IOnFlyUser } from '../../models/user'

declare global {
  namespace Express {
    interface Request {
      user?: IOnFlyUser
      filename?: string
      fileValidationError?: string
    }
  }
}
