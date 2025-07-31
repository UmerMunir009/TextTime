const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { Language } = require("../../models");

const create = asyncErrorHandler(async (req, res) => {


  const data = await Language.create(req.body);

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.CREATED,
    data: data,
  });

});


const get = asyncErrorHandler(async (req, res) => {


  const data = await Language.findAndCountAll({
    ...req.pagination
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.CREATED,
    data: data,
  });
 
});


const del = asyncErrorHandler(async (req, res) => {

  const data = await Language.destroy({
    where:{
      id : req.params.id
    }
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.DELETED,
    data: data,
  });

});


const update = asyncErrorHandler(async (req, res) => {

  const data = await Language.update(req.body, {
    where:{
      id : req.params.id
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
  update,
  del,

};
