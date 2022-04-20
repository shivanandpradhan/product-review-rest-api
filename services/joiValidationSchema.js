import Joi from 'joi'

export default class joiValidationSchema {

    // refresh token schema (for validation of req.body at the time of /api/refresh)
    static refreshTokenSchema = Joi.object({
        refresh_token : Joi.string().required()
    })

    // user schema (for validation of req.body at the time of /api/login)
    static userSchemaForLogin = Joi.object({
        email : Joi.string().required(),
        password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]')).min(6).max(40)
    })

    // user schema (for validation of req.body at the time of /api/register)
    static userSchemaForRegister = Joi.object({
        firstname : Joi.string().required(),
        lastname : Joi.string(),
        gender : Joi.string().required(),
        email : Joi.string().email().required(),
        mobile : Joi.number().required(),
        password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]')).min(6).max(40),
        address : {
            adress1 : Joi.string().required(),
            adress2 : Joi.string(),
            pincode : Joi.string().required().min(6),
            state : Joi.string().required(),
            country : Joi.string().required()
        },
        role : Joi.string()
    })



}