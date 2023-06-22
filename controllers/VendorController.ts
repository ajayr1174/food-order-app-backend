import { NextFunction, Request, Response } from "express";
import { EditVendorInputs, VendorLoginInputs } from "../dto";
import { FindVendor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";
import { CreateFoodInputs } from "../dto";
import { Food } from "../models";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInputs>req.body;
  const existingVendor = await FindVendor("", email);
  if (existingVendor !== null) {
    const isValidPassword = await ValidatePassword(
      password,
      existingVendor.password,
      existingVendor.salt
    );
    if (isValidPassword) {
      const signature = GenerateSignature({
        _id: existingVendor.id,
        email: existingVendor.email,
        name: existingVendor.name,
        foodTypes: existingVendor.foodType,
      });

      return res.json({ token: signature });
    } else return res.json({ msg: "Invalid email or Password" });
  }

  return res.json({ msg: "Invalid email or Password" });
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    const vendorProfile = await FindVendor(req.user._id);
    return res.json(vendorProfile);
  }
  return res.status(404).json({ msg: "Vendor profile not found" });
};

export const UpdateVendorCoverImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user) {
       
        const vendor = await FindVendor(req.user._id);
        if (vendor !== null) {
          const files = req.files as [Express.Multer.File];
          const images = files.map((file: Express.Multer.File) => file.filename);
          
          vendor.coverImage.push(...images);
          const results = await vendor.save();
          return res.json(results);
        }
      }
    return res.status(500).json({ msg: "Unable to update vendor cover image" });
  };



export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, phone, foodType } = <EditVendorInputs>req.body;

  if (req.user) {
    const vendorProfile = await FindVendor(req.user._id);
    if (vendorProfile !== null) {
      (vendorProfile.name = name),
        (vendorProfile.address = address),
        (vendorProfile.phone = phone),
        (vendorProfile.foodType = foodType);
      const savedVendorProfile = await vendorProfile.save();
      return res.json(savedVendorProfile);
    }
  }
  return res.status(500).json({ msg: "Unable to update vendor profile" });
};

export const UpdateVendorServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    const vendorProfile = await FindVendor(req.user._id);
    if (vendorProfile !== null) {
      vendorProfile.servicesAvailable = !vendorProfile.servicesAvailable;
      const savedVendorProfile = await vendorProfile.save();
      return res.json(savedVendorProfile);
    }
  }
  return res.status(500).json({ msg: "Unable to update vendor services" });
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    console.log(req.body)
    const { name, description, category, foodType, readyTime, price } = <CreateFoodInputs>req.body;
    const vendor = await FindVendor(req.user._id);
    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];
      const images = files.map((file: Express.Multer.File) => file.filename);
      const createFood = await Food.create({
        vendorId: vendor._id,
        name,
        description,
        category,
        foodType,
        readyTime,
        price,
        images: images,
        ratings: 0,
      });
      vendor.foods.push(createFood);
      const results = await vendor.save();
      return res.json(results);
    }
  }
  return res.status(500).json({ msg: "Unable to add food" });
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    const foods = await Food.find({ vendorId: req.user._id });
    if (foods !== null) return res.json(foods);
  }
  return res.status(500).json({ msg: "Food information not available" });
};
