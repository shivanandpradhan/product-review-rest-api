import { string } from 'joi'
import mongoose from 'mongoose'

// create a schema for the product review model

const productReviewSchema = mongoose.Schema({

    user_id : { type : String, required : true, trim : true },
    user_name : { type : String, required : true, trim : true },
    product_name : { type : String, required : true, trim : true },
    buy_price : { type : String, required : true, trim : true },
    comment : { type : String, default : ""},
    rating : { type : mongoose.Decimal128, required : true, trim : true },
    image : { type : String, unique : true }

}, { timestamps : true })


// creating a model
const productReviewModel = mongoose.model('productReview', productReviewSchema)

export default productReviewModel