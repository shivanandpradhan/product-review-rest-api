''' Rest Api runs on localhost:3000 '''

Use of Packages inside this Project :

    express     	: express js framework.
    nodemon         : for runing app in development mode.
    joi             : for validation of data recieved from req.body.
    mongoose        : for db connection, model creation.
    bcrypt          : for password hashing and matching.
    dotenv          : for .env file.
    esm             : for using features like (import, export) of ecmascripts.
    jsonwebtoken    : for JwtService (for access and refresh tokens).
    multer          : for handling multi part form data.


How to Use :

    1. Just import the code 
    2. open command prompt  
    3. move to the folder where you have imported.
    4. run 
        npm install
    5. Now run, 
            npm run dev  :- runs using nodemon
                or 
            npm run start :- runs using nodeJs


Different routes for this rest Api :

    1. /api/register  : post request

        for register a user.

            pass json data in the body as 

            - Eg: {
                    "firstname" : "rahul",
                    "lastname" : "gandhi",
                    "gender" : "male",
                    "email" : "rahulgandhi@gmail.com",
                    "mobile" : 3892018238,
                    "password" : "rahul345",
                    "address" : {
                        "adress1" : "lal chowk, delhi",
                        "pincode" : 123445
                        "state" : "uttar pradesh",
                        "country" : "bihar"
                    },
                    "role" : "user"
                }

        - provides access_token and refresh_token in response as json data.
    
    2. /api/login : post request

        for login the user.

            pass json data in the body as :

            - Eg: {
                    "email" : "rahulgandhi@gmail.com",
                    "password" : "rahul345"
                }
            
        gives access token and refresh token in response as json data.
    
    3. /api/me : get request

        gives the information about the current object.
        but necessary to pass
                
            authorization in the headers.

            i.e 

                authorization : bearer access_token

            Eg : Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWVkMjIwYzQ2ZWViNDRkNWYyOWU2NTgiLCJyb2xlIjoidXNlciIsImlhdCI6MTY0MjkzMzQwNCwiZXhwIjoxNjQyOTQ0MjA0fQ.e0SRb2Y_GBhxn7zJ1hAgN49kNM-dHZSw3aI8AW-uqAI

    4. /api/refresh : post request

        for getting the access_token from refresh token

        pass refresh token as a json data in the body.

            Eg : {
                "refresh_token" : "dcJhbGcibcJIUzI1NiIsInR5cCI6IkpX7fad.eyJfaWQiOiI2MWVkMjIwYzQ2ZWViNDRkNWYyOWU2NTgiLCJyb2xlIjoidXNlciIsImlhdCI6MTY0MjkzMzQwNCwiZXhwIjoxNjQyOTQ0MjA0fQ.e0SRb2Y_GBhxn7zJ1hAgN49kNM-dHZSw3aI8AW-uqAI"
            }

        gives access token and refresh token in response.


    5. /api/productReview : post request

            for storing product review inside the db.

            multi part form data it takes.

            pass multi form data as a json in body.

                only authorized user can post data..

                so pass authorization in the header as well.

                eg : 
                    product_name     bat
                    buy_price     400
                    comment      nice to play with..
                    rating      3.5
                    image      file.png(file)
                
            give response as product review stored as json data.
        
    6. /api/updateProductReview/:id : put request

        for updating the product review.
        here id is the id of the product review you want to update.

            only authorized user can update data..
                
            so pass authorization in the header as well.
            
    7. /api/deleteProductReview/:id : delete request

        for deleting the product review posted by him
            
        here id is the id of the product review you want to delete.

        note :- 
            user can delete only his product review.
                
            only authorized user can delete data..
                
            so pass authorization in the header as well.
                
    8. /api/productReviews : get request

        gives the list of whole product Reviews in response.
        
    9. /api/productReview/:id : get request 

        gives the list of only product review whose id is passed.
        
    10. /uploads/filename  : get request.

        gives the product image stored in server as a response.
    
    11. /api/logout : post request.

        only authorized user can logout
        so pass authorization in the header as well

        takes json data in the body where refresh_token is passed 

            eg :
                {
                    "refresh_token" : "lfajdoiejfmojfoadfal......."
                }


Additional Information

user schema :

    - mongoose.Schema({
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


product review schema 

    - mongoose.Schema({

        user_id : { type : String, required : true, trim : true },
        user_name : { type : String, required : true, trim : true },
        product_name : { type : String, required : true, trim : true },
        buy_price : { type : String, required : true, trim : true },
        comment : { type : String, default : ""},
        rating : { type : mongoose.Decimal128, required : true, trim : true },
        image : { type : String, unique : true }

    }, { timestamps : true })
    
        



