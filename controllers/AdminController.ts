import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GenerateSalt, GenerateHashedPassword } from "../utility";


export const FindVendor =async (id: string | undefined, email? : string) => {
    if(email){
      return await Vendor.findOne({email})
    }else return await Vendor.findById(id);
}



export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    address,
    pincode,
    foodType,
    email,
    password,
    ownerName,
    phone,
  } = <CreateVendorInput>req.body;
  const existingVendor = await FindVendor("", email);
  if (existingVendor !== null) {
    return res
      .status(400)
      .json({ msg: "A Vendor with this email Id already exist" });
  }
  const salt = await GenerateSalt();
  const hashedPassword = await GenerateHashedPassword(password, salt);
  const createVendor = await Vendor.create({
    name,
    address,
    pincode,
    foodType,
    email,
    password: hashedPassword,
    ownerName,
    phone,
    salt: salt,
    servicesAvailable: false,
    rating: 0,
    coverImage: [],
    foods:[]
  });
  
  return res.status(201).json(createVendor);
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Vendors = await Vendor.find()

  if(Vendors != null){
    return res.json(Vendors)
  }

  return res.status(404).json({msg: "Vendors data is not available"})
};

export const GetVendorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const VendorId = req.params.Id;
  const Vendor  = await FindVendor(VendorId);
  if(Vendor != null) return res.json(Vendor);
  return res.status(404).json({msg: "Vendor data is not available"})

};
