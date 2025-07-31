const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { Book, Chapter, Content, Language } = require("../../models");
const { Op } = require('sequelize');

const create = asyncErrorHandler(async (req, res) => {


  const data = await Book.create(req.body);

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.CREATED,
    data: data,
  });

});


const get = asyncErrorHandler(async (req, res) => {

  let filters = {};
  if (req.query?.key && req.query?.value) {
    filters[req.query.key] = {
      [Op.iLike]: `${req.query.value}%`,
    };
  }

  const data = await Book.findAndCountAll({
    where : filters,
    include: [{
      model: Language
    }],
     order: [
    ['bookNo', 'ASC']  
  ],
    ...req.pagination,
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.FOUND,
    data: data,
  });

});


const getForApp = asyncErrorHandler(async (req, res) => {

  let filter = {};

  if (req.headers.lang) {
    filter.langaugeId = req.headers.lang
  }
  const data = await Book.findAndCountAll({
    where: {
      ...filter
    },
    ...req.pagination,
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.FOUND,
    data: data,
  });

});

const del = asyncErrorHandler(async (req, res) => {

  const data = await Book.destroy({
    where: {
      id: req.params.id
    }
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.DELETED,
    data: data,
  });

});


const update = asyncErrorHandler(async (req, res) => {

  const data = await Book.update(req.body, {
    where: {
      id: req.params.id
    },
    returning: true,
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.UPDATED,
    data: data,
  });

});


const getBookContent = asyncErrorHandler(async (req, res) => {
  const chapterNo = req.query.chapterNo || 1;
  const data = await Chapter.findAll({

    include: [{
      model: Content,
    }],
    where: {
      bookId: req.params.bookId,
      chapterNo: chapterNo
    }
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.FOUND,
    data: data,
  });

});



module.exports = {
  create,
  get,
  getForApp,
  del,
  update,
  getBookContent
};
