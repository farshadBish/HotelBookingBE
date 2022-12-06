import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import cors from "cors"
import { forbiddenErrorHandler, genericErroHandler, notFoundErrorHandler, unauthorizedErrorHandler } from "./errorHandlers.js"
import usersRouter from "./api/users/index.js"
import roomsRouter from "./api/bookedRooms/index.js"
import createHttpError from "http-errors"


const server = express()
const port = process.env.PORT || 3001

// MiddleWares

const whitelist = [process.env.FE_DEV_URL,process.env.FE_PROD_URL]

server.use(cors({origin : (origin,corsNext) => {
  console.log("ORIGIN: ", origin);
  if (!origin || whitelist.indexOf(origin)!== -1) {

    corsNext(null,true)

  } else {
    corsNext(createHttpError(400, "Cors Error!"))
  }
}}))
server.use(express.json())

// EndPoints

server.use("/users",usersRouter)
server.use("/rooms",roomsRouter)

// server.use("/users",usersRouter)

// ErrorHandlers
server.use(unauthorizedErrorHandler)
server.use(forbiddenErrorHandler)
server.use(notFoundErrorHandler)
server.use(genericErroHandler)
// Mongoose

mongoose.connect("mongodb+srv://farshadbishomar:Feriember04@cluster0.furml.mongodb.net/HotelBooking?retryWrites=true&w=majority")

mongoose.connection.on("connected", () => {
    console.log("Mongo Connected!")
    server.listen(port, () => {
      console.table(listEndpoints(server))
      console.log(`Server is listening on port ${port}`)
    })
  })