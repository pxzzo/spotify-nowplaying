import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import overpassRoute from './routes/overpass.js';
import osrmRoute from './routes/osrm.js';
import authRoute from './routes/auth.js';
import saveRoute from './routes/save.js';
import { errorHandler } from './middlewares/error.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/overpass', overpassRoute);
app.use('/api/osrm', osrmRoute);
app.use('/api/auth', authRoute);
app.use('/api/save', saveRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/leitstelle')
  .then(() => app.listen(PORT, () => console.log(`Server on ${PORT}`)))
  .catch(err => console.error(err));
