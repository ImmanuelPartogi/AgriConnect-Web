// import validator from "validator";
// import bcrypt from 'bcrypt';
// import penggunaModel from "../models/penggunaModel.js";
// import jwt from 'jsonwebtoken';

// // API untuk login admin
// const loginAdmin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Validasi kredensial admin
//         if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
//             const jwtSecret = process.env.JWT_SECRET;

//             if (!jwtSecret) {
//                 return res.status(500).json({ success: false, message: "JWT Secret is not defined" });
//             }

//             const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });
//             res.status(200).json({ success: true, token });
//         } else {
//             res.status(401).json({ success: false, message: "Invalid credentials" });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Server error, please try again later" });
//     }
// };

// export { loginAdmin };
