import jwt from "jsonwebtoken"

const verifyToken = async (req, res, next) => {
  const token = req.headers["token"];
  console.log("Token recibido:", token);

  if (token) {
    jwt.verify(token, "secreto", (error, data) => {
      if (error) {
        console.log("Error de verificación del token:", error);
        return res.status(400).json({ mensaje: "Token invalido" });
      } else {
        req.user = data;
        console.log("Datos decodificados del token:", data);
        next();
      }
    });
  } else {
    res.status(400).json({ mensaje: "Debes enviar un token" });
  }
};

export default verifyToken;