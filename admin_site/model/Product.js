import mongoose, { model, Schema, models } from "mongoose";
const ImageSchema = new Schema({
  pathurl: { type: String },
  objUrl: { type: String },
});

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ pathurl: { type: String }, objUrl: { type:String } }],
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    properties: { type: Object },
  },
  {
    timestamps: true,
  }
);

export const Product = models.Product || model("Product", ProductSchema);
