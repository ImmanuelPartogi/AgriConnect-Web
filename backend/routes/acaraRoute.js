import express from "express";
import * as acaraController from "../controllers/acaraController.js";

const router = express.Router();

router.post("/", acaraController.addAcara);
router.get("/", acaraController.getAllAcara);
router.get("/:id", acaraController.getAcaraById);
router.put("/:id", acaraController.updateAcara);
router.delete("/:id", acaraController.deleteAcara);

export default router;
