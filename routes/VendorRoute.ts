import express, {Request, Response, NextFunction} from "express";
import { GetVendorProfile, VendorLogin, UpdateVendorProfile, UpdateVendorServices, AddFood, GetFoods, UpdateVendorCoverImage } from "../controllers";
import { Authenticate, ImageUpload } from "../middlewares";

const router = express.Router();

router.post("/login", VendorLogin)
router.use(Authenticate);
router.get("/profile", GetVendorProfile)
router.patch("/profile",  UpdateVendorProfile)
router.patch("/coverImage", ImageUpload, UpdateVendorCoverImage)
router.patch("/services", UpdateVendorServices)

router.post("/food",ImageUpload, AddFood);
router.get("/foods", GetFoods);




export {router as VendorRoute}
