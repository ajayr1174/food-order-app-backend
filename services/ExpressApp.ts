import express, { Application } from "express";
import bodyParser from "body-parser";
import { AdminRoute, VendorRoute ,ShoppingRoute } from "../routes";
import path from "path";



export default async (app: Application) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/images", express.static(path.join(__dirname + "images")));
  app.use("/admin", AdminRoute);
  app.use("/Vendor", VendorRoute);
  app.use(ShoppingRoute)

  return app;
};


