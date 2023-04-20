import * as express from 'express';
import * as cors from 'cors';
import loginRoute from './routes/login';
import moviesRoute from './routes/movies';
import bookmarksRoute from './routes/bookmarks';
import exceptionsRoute from './routes/exceptions';

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.static('public'));
app.use('/images', express.static('assets/images'));
app.use('/login', loginRoute);
app.use('/movies', moviesRoute);
app.use('/bookmarks', bookmarksRoute);
app.use('/exceptions', exceptionsRoute);

app.listen(3000, () => {
  console.log('Server Started');
});
