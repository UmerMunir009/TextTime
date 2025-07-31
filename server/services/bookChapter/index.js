const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { Book, Chapter } = require("../../models");
const { Op } = require('sequelize');


const create = asyncErrorHandler(async (req, res) => {

  console.log(req.body)
  const data = await Chapter.create(req.body);
  console.log("data : ", data)


  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.CREATED,
    data: data,
  });



});


const get = asyncErrorHandler(async (req, res) => {
  console.log("test=======?>", req.params)
  const data = await Chapter.findAll({
    where: {
      bookId: req.params.bookId
    }
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.FOUND,
    data: data,
  });

});


const getAll = asyncErrorHandler(async (req, res) => {
  let filter = {};


  if (req.query?.key && req.query?.value) {
    if (req.query?.key === 'chapterNo') {
      filter.chapterNo = Number(req.query?.value)
    }
    if (req.query?.key !== 'chapterNo') {
      filter[req.query.key] = {
        [Op.iLike]: `${req.query.value}%`,
      };
    }

  }

  if (req.query.bookId) {
    filter.bookId = req.query.bookId
  }

  const data = await Chapter.findAndCountAll({
    include: [{
      model: Book
    }],
    order: [
      ['chapterNo', 'ASC']   
    ],
    where: {
      ...filter
    },
    ...req.pagination
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.FOUND,
    data: data,
  });

});

const del = asyncErrorHandler(async (req, res) => {

  const data = await Chapter.destroy({
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

  const data = await Chapter.update(req.body, {
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



module.exports = {
  create,
  get,
  getAll,
  del,
  update
};
