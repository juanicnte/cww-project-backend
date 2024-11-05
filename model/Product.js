import { model, Schema } from "mongoose";

const ProductSchema = new Schema({
  // id: { type: Number, required: true, unique: true }, // Añadido
  name: { type: String, required: true, unique: true }, // Ya existente
  description: { type: String, default: "" }, // Añadido
  category: { type: String, default: "planes" }, // Añadido
  price: { type: Number, required: true }, // Ya existente
  img: { type: String, required: true }, // Ya existente
  features: { type: [String], default: [] }, // Añadido
  inCart: { type: Boolean, default: false }, // Ya existente
});

export default model("Product", ProductSchema);
