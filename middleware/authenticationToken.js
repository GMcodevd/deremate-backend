import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const secretKey = process.env.JWT_SECRET;

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // formato: Bearer <token>

  if (!token) {
    console.log("No se envió token.");
    return res.status(401).json({ message: "Acceso denegado: token no proporcionado" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log("Error al verificar token:", err.message);
      return res.status(403).json({ message: "Token inválido o expirado" });
    }

    req.user = user;
    next();
  });
}
