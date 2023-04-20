import { Router } from 'express';
import { jwtAuth } from '../middlewares/jwtAuth';
import fixtures from '../__fixtures__/index';

let { movies } = fixtures.movies;

interface IMovie {
  id: number;
  title: string;
  image: string;
}

const moviesRoute = Router();

moviesRoute.use(jwtAuth);

moviesRoute.get<{ id: string }>('/:id?', (req, res) => {
  console.log("here1");
  const { id } = req.params;

  if (id) {
    return res.json(movies.find((movie: any) => movie.id === id) || {});
  }

  return res.json(movies);
});

export default moviesRoute;
