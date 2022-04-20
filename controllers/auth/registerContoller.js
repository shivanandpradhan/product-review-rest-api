import Joi from "joi"
import { refreshTokenModel, userModel } from "../../model"
import { CustomErrorHandler, joiValidationSchema, JwtService } from '../../services'
import bcrypt from 'bcrypt'
import { REFRESH_SECRET } from "../../config"

export default class registerController {

    static register = async (req, res, next) => {

        // validate the req.body.
        const {error} = joiValidationSchema.userSchemaForRegister.validate(req.body)

        if (error) {
            return next(error)
        }

        // checking for user inside the db 
        let access_token, refresh_token;
        try{

            // checking for user existense.
            const userExist = await userModel.exists({email : req.body.email})
            
            if (userExist) {
                return next(CustomErrorHandler.userAlreadyExist())
            }

            // save inside the model

            const {firstname, gender, email, mobile, password, address} = req.body

            // hashing password
            const hashPassword = await bcrypt.hash(password, 10)

            const user = await userModel.create({
                firstname,
                ...(req.body.lastname && {lastname : req.body.lastname}),
                gender,
                email,
                mobile,
                password : hashPassword,
                address : {
                    adress1 : address.adress1,
                    ...(req.body.address.adress2 && { adress2 : req.body.address.adress2 }),
                    pincode : address.pincode,
                    state : address.state,
                    country : address.country
                },
                ...(req.body.role && {role : req.body.role})
            })

            // generate the token
            access_token = JwtService.sign({_id : user._id, role : user.role})
            refresh_token = JwtService.sign({_id : user._id, role : user.role}, REFRESH_SECRET, '1y')

            // saving in refreshTokenModel
            await refreshTokenModel.create({
                token : refresh_token
            })
            
        }catch(err){
            return next(err)
        }

        res.json({
            access_token,
            refresh_token
        })
    }
}