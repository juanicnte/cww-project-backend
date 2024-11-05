import Usuario from "../../model/usuario.js";

const getUserById = async (req, res) => {
  console.log(req.user);
  const { id } = req.user;

  if (id.length === 24) {
    Usuario.findById(id).then((usuario) => {
      if (!usuario) {
        return res.json({
          mensaje: "No se encontró ningún usuario con esa ID",
        });
      } else {
        // Excluir solo contraseña y __v, pero mantener _id en el resto
        const { contraseña, __v, ...resto } = usuario._doc;
        res.json(resto); // Ahora resto contiene el campo _id junto con nombre y correo
        console.log(resto);
      }
    });
    
  } else {
    res.json({ mensaje: "Estás enviando una contraseña incorrecta" });
  }
};



export default getUserById;
