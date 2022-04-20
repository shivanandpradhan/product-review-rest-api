import { CustomErrorHandler } from "../services"

export default class viewController {

    static viewImage = async (req, res, next) => {

        if (!req.params.image){
            return next(CustomErrorHandler.serverError())
        }

        res.sendFile(`${APP_PATH}/uploads/${req.params.image}`)        

    }

}