import express from "express"
import createError from "http-errors"
import { adminOnlyMiddleware } from "../../lib/admin.js"
import {JWTAuthMiddleware} from "../../lib/token.js" 
import { createAccessToken } from "../../lib/tools.js"
import UsersModel from "./model.js"
import RoomsModel from "../bookedRooms/model.js"

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body) // here mongoose validation happens
    const { _id } = await newUser.save() // here the validated record is saved
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", JWTAuthMiddleware,adminOnlyMiddleware, async (req, res, next) => {
  try {
    const users = await UsersModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.user._id)
    if (user) {
      res.send(user)
    } else {
      next(createError(401, `User with id ${req.user._id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    if (updatedUser) {
      res.send(updatedUser)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await UsersModel.findByIdAndDelete(req.user._id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:userId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId)
    if (user) {
      res.send({ currentRequestingUser: req.user, user })
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:userId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true })
    if (updatedUser) {
      res.send(updatedUser)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:userId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const deletedUser = await UsersModel.findByIdAndDelete(req.params.userId)
    if (deletedUser) {
      res.status(204).send()
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/login", async (req, res, next) => {
  try {
    // 1. Obtain credentials from req.body
    const { email, password } = req.body

    // 2. Verify credentials
    const user = await UsersModel.checkCredentials(email, password)

    if (user) {
      // 3. If credentials are fine --> generate an access token (JWT) and send it back as a response
      const token = await createAccessToken({ _id: user._id, role: user.role })
      res.send({ accessToken: token })
    } else {
      // 4. If credentials are NOT ok --> throw an error (401)
      next(createError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})

// rooms booked


usersRouter.post('/me/bookedRooms',JWTAuthMiddleware , async (req,res,next) => {
  try {
    const newRoom = new RoomsModel(req.body)
    const updatedUser = await UsersModel.findByIdAndUpdate(req.user._id , {$push : {roomsBooked : newRoom}} ,
        {new:true , runValidators:true } )
        if(updatedUser) {
            res.send(updatedUser)
        } else{
            next(createError(404,`user with this id ${req.user._id} didn't found`))
        }
} catch (error) {
    next(error)
}

})

usersRouter.get("/me/bookedRooms",JWTAuthMiddleware , async (req,res,next) => {
  try {
    const user = await UsersModel.findById(req.user._id)
    if(user){
        res.send(user.roomsBooked)
    }else{
        next(createError(404,`User with this id ${req.user._id} didn't found`))
    }
} catch (error) {
    next(error)
}
  
})

usersRouter.get("/me/bookedRooms/:bookedRoomId",JWTAuthMiddleware , async (req,res,next) => {

  try {
    const user = await UsersModel.findById(req.user._id)
    if(user){
        const writtenExp = user.roomsBooked.find(aRoom => req.params.bookedRoomId  === aRoom._id.toString())
        if(writtenExp){
            res.send(writtenExp)
        } else{
            next(createError(404,`Experience with this id ${req.params.expId} didn't found`))
        }
    }else{
        next(createError(404,`User with this id ${req.user._id} didn't found`))
    }
    
} catch (error) {
    next(error)
}
  
})

usersRouter.delete("/me/bookedRooms/:bookedRoomId", JWTAuthMiddleware , async (req,res,next) => {

  try {
    const user = await UsersModel.findByIdAndUpdate(
      req.user._id,
        {$pull : {roomsBooked : {_id: req.params.bookedRoomId}}},
        {new:true , runValidators:true}
    )
    if(user){
        res.send(user)
    }else{
        next(createError(404,`User with id ${req.user._Id} didn't found`))
    }
} catch (error) {
    next(error)
}
  
})
usersRouter.get("/bookedRooms",JWTAuthMiddleware , adminOnlyMiddleware , async (req,res,next) => {
  try {
    const roomsThatBooked = await UsersModel.find()
    res.send(roomsThatBooked.roomsBooked)
  } catch (error) {
    next(error)
  }
  
})
usersRouter.get("/:userId/bookedRooms")

usersRouter.put("/:userId/bookedRooms/:bookedRoomId",JWTAuthMiddleware,adminOnlyMiddleware , async (req,res,next) => {

  try {
    const user = await UsersModel.findById(req.params.userId)
    if(user){
        const index = user.roomsBooked.findIndex(aRoom => aRoom._id.toString() === req.params.bookedRoomId)
        if(index !== -1){
            user.roomsBooked[index] = {...user.roomsBooked[index].toObject(),...req.body}
            await user.save()
            res.send(user)
        }else{
            next(createError(404,`Experience with this id ${req.params.expId} didn't found`))
        }
    } else{
        next(createError(404,`User with this id ${req.params.userId} didn't found`))
    }
    
} catch (error) {
    next(error)
}
  
})
usersRouter.delete("/:userId/bookedRooms/:bookedRoomId",JWTAuthMiddleware,adminOnlyMiddleware , async (req,res,next) => {
  try {
    const user = await UsersModel.findByIdAndUpdate(
        req.params.userId,
        {$pull : {roomsBooked : {_id: req.params.bookedRoomId}}},
        {new:true , runValidators:true}
    )
    if(user){
        res.send(user)
    }else{
        next(createError(404,`User with id ${req.params.userId} didn't found`))
    }
} catch (error) {
    next(error)
}
  
})

export default usersRouter