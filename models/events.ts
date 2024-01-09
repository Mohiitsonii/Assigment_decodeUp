import mongoose, { Schema, Document } from 'mongoose';

// Define the TypeScript interface for the event document
interface IEvent extends Document {
  event_name: string;
  event_title: string;
  event_description: string;
  event_location: string;
  event_date: string;
  images: string[];
}

// Define the Mongoose schema for the event model
const eventSchema = new Schema<IEvent>({
  event_name: {
    type: String,
    required: [true, 'Event Name is required'],
    trim: true,
  },
  event_title: {
    type: String,
    required: [true, 'Event Title is required'],
    trim: true,
  },
  event_description: {
    type: String,
    required: [true, 'Event Description is required'],
    trim: true,
  },
  event_location: {
    type: String,
    required: [true, 'Event Location is required'],
    trim: true,
  },
  event_date: {
    type: String,
    required: [true, 'Date is required'],
    trim: true,
  },
  images: [{
    type: String,
  }],
});

// Create and export the Mongoose model
const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;
