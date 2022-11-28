import express from "express"
import createError from "http-errors"
import { adminOnlyMiddleware } from "../../lib/admin.js"
import {JWTAuthMiddleware} from "../../lib/token.js" 
import RoomsModel from "./model.js"


const roomsRouter = express.Router()



  export default roomsRouter