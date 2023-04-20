import { Router } from 'express';
import { jwtAuth } from '../middlewares/jwtAuth';
import { v4 as uuid } from 'uuid';
import fixtures from '../__fixtures__/index';

let { bookmarks } = fixtures.bookmarks;
let { movies } = fixtures.movies;

interface IBookmark {
  userId: string;
  movieId: string;
}

const bookmarksRoute = Router();

bookmarksRoute.use(jwtAuth);

bookmarksRoute.get('/:id?', (req, res) => {
  const { id } = req.params;
  const userBookmarks = bookmarks.filter(bookmark => bookmark.userId === id);
  const movieBookmarks = userBookmarks.map(bookmark => movies.find(movies => movies.id === bookmark.movieId));
  return res.json(movieBookmarks);
});

bookmarksRoute.get('/internal-server-errorr', (req, res) => {
  res.sendStatus(500);
});

bookmarksRoute.post('/', (req, res) => {
  const { id = uuid(), userId, movieId } = req.body;
  const alreadyBookmarked = bookmarks.find(bookmark => bookmark.userId === userId && bookmark.movieId === movieId);
  if (!alreadyBookmarked) {
    bookmarks.push({
      id,
      userId,
      movieId,
    });
  }
  res.sendStatus(200);
});

export default bookmarksRoute;
