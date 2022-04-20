import express from 'express'

import { registerController, 
    loginController,
    userController, 
    refreshTokenController, 
    productReviewController, 
    viewController 
} from '../controllers';

import { auth } from '../middlewares'


const router = express.Router()

router.post('/register', registerController.register);
router.post('/login', loginController.login)
router.post('/logout', auth, loginController.logout)
router.get('/me', auth, userController.aboutMe)

router.post('/refresh', refreshTokenController.refresh)

// product routes..
router.post('/productReview', auth, productReviewController.addProductReview)
router.get('/productReviews', productReviewController.getAllProductReviews)
router.get('/productReview/:id', productReviewController.getProductReviewById)
router.put('/updateProductReview/:id', auth, productReviewController.updateProductReview)
router.delete('/deleteProductReview/:id',auth, productReviewController.deleteProductReview)

export default router