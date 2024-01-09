import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import ErrorHandler from './utilis/errorhandler';
import event from './routes/event'
const app = express();
app.use(cors({}));

app.use('/api',event);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/health', (req: Request, res: Response, next: NextFunction) => {
  res.send('OK');
});


app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    sucess:false,
    message: err.message,
  });
});

export default app;
