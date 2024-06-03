import express from 'express';
import morgan from 'morgan';
import { router as mangasRouter } from '@/routes/Mangas';
import 'dotenv/config';
import '@/db/database';

morgan('dev');

const app = express();
app.use(express.json());
app.use(mangasRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
