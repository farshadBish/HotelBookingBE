
import mongoose from "mongoose"

const { Schema, model } = mongoose

const hotelsSchema = new Schema(
  {
        images: [{type: String, required: true}],
        name: {type: String, required: true},
        starRating: {type: Number, required: true},
        description : {type: String, required: true},
        city: {type: String, required: true},
        country:{type: String, required: true},
        address: {type: String, required: true},
        postalCode:{type: Number, required: true},
        roomCount:{type: Number, required: true},
        hotelAminities: [{type: String, required: true}],
        roomTypes:[
          {
            
            maxOccupancy: {type: Number, required: true},
            typeName: {type: String, required: true},
            images: [{type: String, required: true}],
            nightlyPrice: {type:Number , required:true},
            aminities: [{type: String, required: true}],
            // validate: [arrayLimit, '{PATH} exceeds the limit of 10']
          },
        ]
  },
  {
    timestamps: true,
  }
)

export default model("Hotel", hotelsSchema)