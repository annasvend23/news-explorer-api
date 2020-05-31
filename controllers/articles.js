const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const { NO_SUCH_ARTICLE, NO_RIGHTS_TO_DELETE_ARTICLE } = require('../config/constants');

const getArticles = (req, res, next) => {
  const user = req.user._id;

  Article.find({ owner: user })
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;

  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.status(201).send({ data: article }))
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const user = req.user._id;

  Article.findById(req.params.articleId).select('+owner')
    .then((article) => {
      if (!article) {
        throw new NotFoundError(NO_SUCH_ARTICLE);
      }
      if (!article.owner.equals(user)) {
        throw new ForbiddenError(NO_RIGHTS_TO_DELETE_ARTICLE);
      }
      return Article.deleteOne({ _id: req.params.articleId })
        .then(() => res.send({ data: article }));
    })
    .catch(next);
};

module.exports = {
  getArticles, createArticle, deleteArticle,
};
