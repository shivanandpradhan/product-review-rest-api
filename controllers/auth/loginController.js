import Joi from "joi";
import { userModel, refreshTokenModel } from "../../model";
import {
    CustomErrorHandler,
    joiValidationSchema,
    JwtService,
} from "../../services";
import bcrypt from "bcrypt";
import { REFRESH_SECRET } from "../../config";

export default class loginController {
    static login = async (req, res, next) => {
        // validate the req. body
        const { error } = joiValidationSchema.userSchemaForLogin.validate(req.body);

        if (error) {
            return next(error);
        }

        // check for user existense
        const { email, password } = req.body;
        let access_token, refresh_token;
        try {
            const user = await userModel.findOne({ email: email });

            if (!user) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            // checking password
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            // now user exist and authorized as well
            // so generate tokens

            access_token = JwtService.sign({ _id: user._id, role: user.role });
            refresh_token = JwtService.sign(
                { _id: user._id, role: user.role },
                REFRESH_SECRET,
                "1y"
            );

            // saving in refreshTokenModel
            await refreshTokenModel.create({
                token: refresh_token,
            });
        } catch (err) {
            return next(err);
        }

        res.json({
            access_token,
            refresh_token,
        });
    };

    static logout = async (req, res, next) => {
        // validation for req.body
        const { error } = joiValidationSchema.refreshTokenSchema.validate(req.body)
        if (error) { return next(error) }

        let refresh_token;
        try {
            // delete the refreshToken from db
            refresh_token = await refreshTokenModel.findOneAndDelete({ token: req.body.refresh_token })
        } catch (err) {
            return next(err)
        }

        res.json(refresh_token)
    }
}
