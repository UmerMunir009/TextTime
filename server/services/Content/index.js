const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { Chapter, Content, Book } = require("../../models");
const { Op } = require('sequelize');

const create = asyncErrorHandler(async (req, res) => {

  const data = await Content.create(req.body);
  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.CREATED,
    data: data,
  });



});


const get = asyncErrorHandler(async (req, res) => {

  const data = await Content.findAll({
    where: {
      chapterId: req.params.chapterId
    },
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
    if (req.query?.key === 'pageNo') {
      filter.pageNo = Number(req.query?.value)
    }
  }

  if (req.query.chapterId) {
    filter.chapterId = req.query.chapterId
  }

  const data = await Content.findAndCountAll({
    include: [{
      model: Chapter,
      include: [{
        model: Book
      }]
    }],
    order: [
      [Chapter, Book, 'bookNo', 'ASC'],     
      [Chapter, 'chapterNo', 'ASC'],        
      ['pageNo', 'ASC']                     
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

  const data = await Content.destroy({
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

  const data = await Content.update(req.body, {
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
