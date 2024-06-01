import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import orderRoute from './routes/orderRoute.js';
import reviewRoute from './routes/reviewRoute.js';
import artistRoute from './routes/artistRoute.js';
import path from 'path';

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();
app.use('/api/users', userRoutes);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/artist', artistRoute);
app.use('/uploads', express.static('uploads'));
app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname,'frontend/dist')));
  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname,'frontend','dist','index.html')));
}else{
  app.get('/', (req, res) => { res.send('API is running...'); });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));