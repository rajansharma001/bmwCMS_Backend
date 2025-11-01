import { User } from "../../model/userModel";
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
