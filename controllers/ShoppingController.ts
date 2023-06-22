import { Request, Response, NextFunction } from "express";
import { FoodDoc, Vendor } from "../models";

export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const results = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .populate("food");
  if (results.length > 0) {
    return res.status(200).json(results);
  }

  return res.json(404).json({ msg: "Data not found!" });
};

export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const results = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  })
    .sort([["rating", "descending"]])
    .limit(10);
  if (results.length > 0) {
    return res.status(200).json(results);
  }

  return res.json(404).json({ msg: "Data not found!" });
};

export const GetFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const results = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("food");
  if (results.length > 0) {
    const foodResults: any = [];
    results.map((vendor) => {
      const food = vendor.foods as [FoodDoc];
      foodResults.push(...food.filter((food) => food.readyTime <= 30));
    });
    return res.status(200).json(foodResults);
  }

  return res.json(404).json({ msg: "Data not found!" });
};

export const SearchFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const results = await Vendor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("food");
  if (results.length > 0) {
    const foodResults: any = [];
    results.map((vendor) => {
      foodResults.push(...vendor.foods);
    });
    return res.status(200).json(foodResults);
  }

  return res.json(404).json({ msg: "Data not found!" });
};

export const RestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const results = await Vendor.findById(id).populate("food");
  if (results) {
    return res.status(200).json(results);
  }

  return res.json(404).json({ msg: "Data not found!" });
};
