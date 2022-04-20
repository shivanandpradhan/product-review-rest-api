import { ACCESS_SECRET } from "../config";
import { CustomErrorHandler, JwtService } from "../services";

const auth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader){
        return next(CustomErrorHandler.unAuthorized())
    }

    const access_token = authHeader.split(" ")[1]

    if (!access_token){
        return next(CustomErrorHandler.unAuthorized('Token Expired !! Login Again'))
    }

    try{
        const {_id, role} = JwtService.verify(access_token, ACCESS_SECRET)
        req.user = {
            _id, 
            role
        }
    }catch(err){
        next(CustomErrorHandler.unAuthorized());
    }
    
    next()
}

export default auth;