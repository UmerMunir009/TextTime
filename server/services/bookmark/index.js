const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { Bookmark } = require("../../models");

const create = asyncErrorHandler(async (req, res) => {

  const exist = await Bookmark.findOne({
    where:{
      contentId : req.body.contentId,
      deviceId : req.body.deviceId
    },
    raw : true
  })
  if(exist){
    await Bookmark.destroy({
      where:{
        id : exist.id
      }
    });

    return res.status(STATUS_CODES.SUCCESS).json({
      statusCode: STATUS_CODES.SUCCESS,
      message: TEXTS.DELETED,
      isBookmarked : false,
    });

  }


  const data = await Bookmark.create(req.body);

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.CREATED,
    isBookmarked : true,
    data: data,
  });

});


const get = asyncErrorHandler(async (req, res) => {


  const data = await Bookmark.findAndCountAll({
    ...req.pagination
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.CREATED,
    data: data,
  });
 
});


const del = asyncErrorHandler(async (req, res) => {

  const data = await Bookmark.destroy({
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

  const data = await Bookmark.update(req.body, {
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
