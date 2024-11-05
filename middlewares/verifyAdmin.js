// Lista de correos de los administradores
const adminEmails = ["juanicente@gmail.com'", "juaniellok@gmail.com"];

export const isAdmin = async (req, res, next) => {
  try {
    // Asegúrate de que el correo existe en req.user
    if (!req.user || !req.user.correo) {
      return res.status(401).json({ message: "Token inválido o faltante." });
    }

    const userEmail = req.user.correo; // Obtener el correo del usuario desde el token

    // Verifica si el correo está en la lista de administradores
    if (adminEmails.includes(userEmail)) {
      next(); // El usuario es un administrador, continúa con la siguiente función
    } else {
      res.status(403).json({ message: "Acceso denegado. Requiere privilegios de administrador." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor: " + error.message });
  }
};
