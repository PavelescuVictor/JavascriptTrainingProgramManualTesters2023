import exchangeToken from './auth/exchangeToken.js';
import playground from './playground.js';

const initApp = () => {
  exchangeToken();
  playground();
};

initApp();
