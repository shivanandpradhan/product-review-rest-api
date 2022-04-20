import mongoose from 'mongoose'

// user schema creation
const userSchema = mongoose.Schema({
    firstname : {type : String, uppercase : true, required : true, trim : true},
    lastname : {type : String, uppercase : true, trim : true},
    gender : {type : String, trim : true, required : true},
    email : {type : String, required : true, trim : true, unique : true},
    mobile : {type : Number, required : true, unique : true},
    password : {type : String, required : true, minLength : 6},
    address : {
            adress1 : {type : String, required : true, trim : true},
            adress2 : {type : String, trim : true, default : ""},
            pincode : {type : String, required : true, trim : true, minLength : 6},
            state : {type : String, required : true, trim : true},
            country : {type : String, required : true, trim : true}
    },
    role : {type : String, default : 'user'}
}, {timestamps : true})


// model creation
const userModel = mongoose.model('client', userSchema)

export default userModel