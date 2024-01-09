import express from "express";
import {PostEvent} from '../controller/event';
import uploadMiddleware from "../middleware/uploadFile";
const router = express.Router();

router.route("/events").post(uploadMiddleware, PostEvent);


export default router;
