import Usuario from "../../model/usuario.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const login = async (req, res) => {
    const { correo, contraseña } = req.body;
    console.log(req.body);

    Usuario.findOne({ correo }).then((usuario) => {
        if (!usuario) {
            return res.json({ mensaje: "Usuario no encontrado" });
        }

        bcrypt.compare(contraseña, usuario.contraseña).then((esCorrecta) => {
            if (esCorrecta) {
                const { id, nombre } = usuario;

                const data = {
                    id,
                    nombre,
                    correo,
                };

                const token = jwt.sign(data, "secreto");


                res.json({
                    mensaje: "Usuario logeado correctamente",
                    usuario: {
                        id,
                        nombre,
                        token,
                        correo
                    },
                });
            } else {
                return res.json({ mensaje: "Contraseña incorrecta" });
            }
        });
    });
};

export default login;