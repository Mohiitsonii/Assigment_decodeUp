import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utilis/errorhandler"; // Import your custom error handler if available
import catchAsyncError from "../middleware/catchAsyncError";
import multer from 'multer';
import fs from 'fs';
import Event from "../models/events";
import message from "../message.json"


  export const PostEvent = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const files = req.files as Express.Multer.File[];

        // Process and store the files as required
        // For example, save the files to a specific directory using fs module
        let images: string[] = [];
         console.log("files")
        files.forEach((file) => {
          const filePath = `uploads/${file.filename}`;
          fs.rename(file.path, filePath, (err) => {
            if (err) {
              // Handle error appropriately and send an error response
              return res.status(400).json({ success:false, message: err.message });
            }
          });
          images.push(filePath);
        });
        console.log(images);

        const {
          event_name,
          event_title,
          event_description,
          event_location,
          event_date,
          
        } = req.body;
  
        if (
          !event_name ||
          !event_title ||
          !event_description ||
          !event_location ||
          !event_date
         
        ) {
          throw new ErrorHandler(message.requiredFields,500)
        }
  
        await Event.create({
          event_name,
          event_title,
          event_description,
          event_location,
          event_date,
          images
        });
  
       
        res.status(200).json({
          sucess:true,
          message: 'Event created successfully and files uploaded',
        });
      } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).json({ sucess:false,message: err });
      }
    }
  );
  