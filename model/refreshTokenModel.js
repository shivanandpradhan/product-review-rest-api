import mongoose from 'mongoose'

// create a schema for refresh token
const refreshTokenSchema = mongoose.Schema({
    token : {type : String, required : true, unique : true}
}, {timestamps : false})

// creating a model 
const refreshTokenModel = mongoose.model('refresh_token', refreshTokenSchema)

export default refreshTokenModel