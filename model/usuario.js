import { model, Schema } from "mongoose"

const UsuarioSchema = new Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
});

export default model("Usuario", UsuarioSchema);
