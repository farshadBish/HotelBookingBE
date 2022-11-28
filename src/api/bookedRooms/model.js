
import mongoose from "mongoose"

const { Schema, model } = mongoose

const roomsSchema = new Schema(
  {
    hotelName: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true},
    roomName: { type: String, required: true },
    email: { type: String, required: true },
    occupancy: { type: Number, required: true },
    arriveDate: { type: String, required: true },
    departureDate: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

export default model("Room", roomsSchema)