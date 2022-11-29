import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import cors from "cors"
import { forbiddenErrorHandler, genericErroHandler, notFoundErrorHandler, unauthorizedErrorHandler } from "./errorHandlers.js"
import usersRouter from "./api/users/index.js"
import roomsRouter from "./api/bookedRooms/index.js"


const server = express()
const port = process.env.PORT || 3001


// MiddleWares

server.use(cors())
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

mongoose.connect(process.env.MONGO_CONNECTION_STRING)

mongoose.connection.on("connected", () => {
    console.log("Mongo Connected!")
    server.listen(port, () => {
      console.table(listEndpoints(server))
      console.log(`Server is listening on port ${port}`)
    })
  })