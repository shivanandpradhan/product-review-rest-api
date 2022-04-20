import { userModel } from "../../model"
import { CustomErrorHandler } from "../../services"

export default class userController {

    static aboutMe = async (req, res, next) => {

        if (!req.user._id){
            return next(CustomErrorHandler.unAuthorized('UnAuthorized : User Not Login.'))
        }

        let user;

        try{

            user = await userModel.findById(req.user._id).select(['-password', '-createdAt', '-updatedAt','-__v'])

            if (!user){
                return next(CustomErrorHandler.notFoundError('User not Found...'))
            }
         
        }catch(err){
            return next(err)
        }

        res.status(200).json(user)
    }
}