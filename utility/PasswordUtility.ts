import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { AuthPayload, VendorPayload } from "../dto";
import { JWT_SECRET } from "../config";
import { Request } from "express";

export const GenerateSalt = async () =>{
    return await bcrypt.genSalt();
}

export const GenerateHashedPassword =async (plainPassword: string, salt: string) => {
    return await bcrypt.hash(plainPassword, salt);
}

export const ValidatePassword = async (plainPassword: string, hashedPassword: string, salt: string) =>{
    return await GenerateHashedPassword(plainPassword, salt) === hashedPassword;
}

export const GenerateSignature =  (payload : VendorPayload)=>{
    return jwt.sign(payload, JWT_SECRET,{ expiresIn: '1d'})
}


export const ValidateSignature = async(req: Request)=>{
    const signature = req.get("Authorization");
    if(signature){
        const payload = await jwt.verify(signature.split(" ")[1], JWT_SECRET) as AuthPayload;
        req.user = payload
        return true;
    }
    return false;
}