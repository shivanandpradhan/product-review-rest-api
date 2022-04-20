import Joi from 'joi'
import { REFRESH_SECRET } from '../../config'
import { refreshTokenModel } from '../../model'
import { CustomErrorHandler, joiValidationSchema, JwtService } from '../../services'

export default class refreshTokenController {

    static refresh = async (req, res, next) => {

        //validate req.body..
        const {error} = joiValidationSchema.refreshTokenSchema.validate(req.body)

        if (error) { return next(error) }
        
        let access_token;

        try {

            // checking token inside the db..
            const token = await refreshTokenModel.findOne({token : req.body.refresh_token})
            
            if (!token){
                return next(CustomErrorHandler.unAuthorized('unAuthorized : Invalid Refresh Token'))
            }

            // verify the token
            const {_id, role} = JwtService.verify(req.body.refresh_token, REFRESH_SECRET)

            // generate the new access token
            access_token = JwtService.sign({_id, role})
           
        } catch (err) {
            return next(err)
        }

        res.json({
            access_token,
            refresh_token : req.body.refresh_token
        })
    }

}

