import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Akses ditolak, token tidak ditemukan" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid" });
    }

    req.user = decoded;
    console.log("Decoded JWT Payload:", decoded);
    next();
  });
};

export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.peran;

    console.log("User Role in Middleware:", userRole);
    console.log("Allowed Roles:", allowedRoles);

    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Akses ditolak, peran tidak sesuai" });
    }

    next();
  };
};
