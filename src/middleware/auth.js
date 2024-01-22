
import userModel from "../../database/models/User.model.js";
import { verifyToken } from "../../utils/GenerateAndVerifyToken.js";
import { asyncHandler } from "../../utils/errorHandling.js";


export const roles={
    Admin:"Admin",
    User:"User",
    Manager:"Manager"
}
export const auth =(accessRoles=[roles.User,roles.Admin])=>{ 
    return asyncHandler(async(req, res, next) => {
    
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARER_KEY)) {
            return next(new Error("In-valid bearer key", {cause:400}))
        }
        const token = authorization.split(process.env.BEARER_KEY)[1]
        if (!token) {
            return next(new Error("In-valid token", {cause:400}))
        }
        const decoded = verifyToken({token})
        if (!decoded?.id) {
            return next(new Error("In-valid token payload", {cause:400}))

        }
        const user = await userModel.findById(decoded.id).select('userName image role changePasswordTime')
        if (!user) {
            return next(new Error("Not register account", {cause:401}))
        }
        if(parseInt(user.changePasswordTime?.getTime() /1000) >  decoded.iat){
            return next(new Error("expired token", {cause:400}))
        }
        
        if(!accessRoles.includes(user.role)){
            return next(new Error("Not authorized user", {cause:403}))

        }
        req.user = decoded.id;
        return next()
    })}


export default auth