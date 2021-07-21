import express from 'express';
import cors from 'cors';

import { downloadsRouter } from "../routes/downloadsRouter";

const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// enable cors
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true // <-- REQUIRED backend setting
};
app.use(cors(corsOptions));

// Routes
app.use(downloadsRouter);

console.log('Express app initialised!');

export default app;