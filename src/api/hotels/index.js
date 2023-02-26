import express from "express";
import createError from "http-errors";
import { adminOnlyMiddleware , hotelOwnerOnlyMiddleware } from "../../lib/admin.js";
import { JWTAuthMiddleware } from "../../lib/token.js";
import { createAccessToken } from "../../lib/tools.js";
import UsersModel from "./model.js";
import HotelModel from "../hotels/model.js";
import q2m from "query-to-mongo"

const hotelsRouter = express.Router();

hotelsRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
    try {
      const newUser = new HotelModel(req.body); // here mongoose validation happens
      const { _id } = await newUser.save(); // here the validated record is saved
      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  });
  hotelsRouter.get(
    "/",
    async (req, res, next) => {
      try {
        const mongoQuery = q2m(req.query)
        const total = await HotelModel.countDocuments(mongoQuery.criteria) 
        const allHotels = await HotelModel.find(mongoQuery.criteria,mongoQuery.options.fields)
        .limit(mongoQuery.options.limit)
        .skip(mongoQuery.options.skip)
        .sort(mongoQuery.options.sort)
        ;
        res.send({allHotels , total});
      } catch (error) {
        next(error);
      }
    }
  );
  
  hotelsRouter.get(
    "/:hotelId",
    async (req, res, next) => {
      try {
        const user = await HotelModel.findById(req.params.hotelId);
        if (user) {
          res.send({ currentRequestingUser: req.user, user });
        } else {
          next(createError(404, `User with id ${req.params.hotelId} not found!`));
        }
      } catch (error) {
        next(error);
      }
    }
  );
  
  hotelsRouter.put(
    "/:hotelId",
    JWTAuthMiddleware,
    adminOnlyMiddleware,
    async (req, res, next) => {
      try {
        const updatedUser = await HotelModel.findByIdAndUpdate(
          req.params.hotelId,
          req.body,
          { new: true, runValidators: true }
        );
        if (updatedUser) {
          res.send(updatedUser);
        } else {
          next(createError(404, `User with id ${req.params.hotelId} not found!`));
        }
      } catch (error) {
        next(error);
      }
    }
  );
  
  hotelsRouter.delete(
    "/:hotelId",
    JWTAuthMiddleware,
    adminOnlyMiddleware,
    async (req, res, next) => {
      try {
        const deletedUser = await HotelModel.findByIdAndDelete(req.params.hotelId);
        if (deletedUser) {
          res.status(204).send();
        } else {
          next(createError(404, `User with id ${req.params.hotelId} not found!`));
        }
      } catch (error) {
        next(error);
      }
    }
  );



export default hotelsRouter;