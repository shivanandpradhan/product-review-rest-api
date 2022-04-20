import path from "path";
import multer from "multer";
import { APP_URL } from "../config";
import { unlink } from "fs";
import { productReviewModel, userModel } from "../model";
import { CustomErrorHandler } from "../services";
import Joi from 'joi';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const file_name = `${Date.now()}-${Math.round( Math.random() * 1e6)}${path.extname(file.originalname)}`;
    cb(null, file_name);
  },
});

const handleMultiPartData = multer({ storage, limits: { fileSize: 1000000 * 8 } }).single("image");

export default class productReviewController {

  // adding multi part form data as product review.
  static addProductReview = (req, res, next) => {

    handleMultiPartData(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      let filePath
      if (req.file) {
        filePath = APP_URL + "/" + req.file.path.replace("\\", "/");
      }

      // validate req.body..
      const productReviewSchema = Joi.object({
        product_name : Joi.string().required(),
        buy_price : Joi.string().required(),
        ...(req.body.comment && { comment: Joi.string() }),
        rating : Joi.number().required(),
      });

      const {error} = productReviewSchema.validate(req.body);

      if (error) {
        if (filePath) {
          unlink(`${APP_PATH}/${req.file.path}`, (err) => {
            if (err) {
              return next(err);
            }
          })
        }

        return next(error);
      }

      const { product_name, buy_price, rating } = req.body;
      let result;

      try {
        // getting user name from req.user.id passed from 'auth middleware'
        const user = await userModel.findById(req.user._id);

        if (!user) {
          if (filePath) {
            unlink(`${APP_PATH}/${req.file.path}`, (err) => {
              if (err) {
                return next(err);
              }
            })
          }
          return next(CustomErrorHandler.unAuthorized('Unauthorized : user not exist'));
        }

        // saving in db
        result = await productReviewModel.create({
          user_id: user._id,
          user_name: `${user.firstname} ${user.lastname}`,
          product_name,
          buy_price,
          ...(req.body.comment && { comment: req.body.comment }),
          rating,
          ...(filePath && { image: filePath }),
        });
      } catch (err) {
        return next(err);
      }

      res.status(201).json(result);
    });
  };

  // update product review.
  static updateProductReview = async (req, res, next) => {
    if (!req.params.id) {
      return next(CustomErrorHandler.notFoundError());
    }

    try {
      // getting the userId based on current id
      const user = await productReviewModel.findById(req.params.id).select("user_id");

      if (!user || user.user_id != req.user._id) {
        return next(CustomErrorHandler.unAuthorized());
      }

      handleMultiPartData(req, res, async (err) => {
        if (err) {
          return next(err);
        }

        let filePath;
        if (req.file) {
          filePath = APP_URL + "/" + req.file.path.replace("\\", "/");
        }

        // validation for req.body
        const productReviewSchema = Joi.object({
          product_name : Joi.string().required(),
          buy_price : Joi.string().required(),
          ...(req.body.comment && { comment: Joi.string() }),
          rating : Joi.number().required(),
        });
        
        const {error} = productReviewSchema.validate(req.body);
        
        if (error) {
          if (filePath) {
            unlink(`${APP_PATH}/${req.file.path}`, (err) => {
              if (err) {
                return next(err);
              }
            });
          }

          return next(error);
        }

        const { product_name, buy_price, rating } = req.body;
        let result;

        try {
          // getting user name from req.user.id passed from 'auth middleware'
          const user = await userModel.findById(req.user._id);

          if (!user) {
            if (filePath) {
              unlink(`${APP_PATH}/${req.file.path}`, (err) => {
                if (err) {
                  return next(err);
                }
              })
            }
            return next(CustomErrorHandler.unAuthorized('UnAuthorized : User not exist.'));
          }

          // saving in db
          result = await productReviewModel.findByIdAndUpdate(
            req.params.id,
            {
              user_id: user._id,
              user_name: `${user.firstname} ${user.lastname}`,
              product_name,
              buy_price,
              ...(req.body.comment && { comment: req.body.comment }),
              rating,
              ...(filePath && { image: filePath }),
            },
            { new: true }
          );
        } catch (err) {
          if (filePath) {
            unlink(`${APP_PATH}/${req.file.path}`, (err) => {
              if (err) {
                return next(err);
              }
            });
          }
          return next(err);
        }

        res.status(200).json(result);
      });
    } catch (err) {
      return next(err);
    }
  };

  // get products
  static getAllProductReviews = async (req, res, next) => {
    let productReviews;
    try {
      productReviews = await productReviewModel
        .find()
        .select("-createdAt -updatedAt -__v");
    } catch (err) {
      return next(err);
    }

    res.status(200).json(productReviews);
  };

  // get product by id which is passed in the url
  static getProductReviewById = async (req, res, next) => {
    if (!req.params.id) {
      return next(CustomErrorHandler.notFoundError());
    }

    let productReview;
    try {
      productReview = await productReviewModel.findById(req.params.id);
    } catch (err) {
      return next(err);
    }

    res.status(200).json(productReview);
  };

  // delete product review
  static deleteProductReview = async (req, res, next) => {
    if (!req.params.id) {
      return next(CustomErrorHandler.notFoundError());
    }

    let product;
    try {
      product = await productReviewModel.findById(req.params.id);

      if (
        req.user.role != "admin" &&
        (!product || product.user_id != req.user._id)
      ) {
        return next(CustomErrorHandler.unAuthorized());
      }
    } catch (err) {
      return next(err);
    }

    //delete the product image..
    let filePath;
    if (product.image) {
      const file = product.image.split("/").reverse()[0];
      filePath = `${APP_PATH}/uploads/${file}`;
    }

    if (filePath) {
      unlink(filePath, (err) => {
        if (err) {
          return next(err);
        }
      });
    }

    let productReview;

    try {
      productReview = await productReviewModel.findByIdAndDelete(req.params.id);
    } catch (err) {
      return next(err);
    }

    res.json(productReview);
  };

}
