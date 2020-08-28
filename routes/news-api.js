const got = require('got');
const router = require('express').Router();

router.get('/', (req, res) => {
  const baseUrl = 'https://newsapi.org/v2/everything';
  const query = req.url.slice(1);

  got.stream(`${baseUrl}${query}`).pipe(res);
});

module.exports = router;
