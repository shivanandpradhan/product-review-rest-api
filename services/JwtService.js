import jwt from 'jsonwebtoken'
import { ACCESS_SECRET } from '../config';

export default class JwtService{

    static sign(payload, secret = ACCESS_SECRET, expiry = '600s'){
        return jwt.sign(payload, secret, {expiresIn : expiry})
    }

    static verify(token, secret = ACCESS_SECRET){
        return jwt.verify(token, secret)
    }
}