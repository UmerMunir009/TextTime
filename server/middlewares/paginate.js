

module.exports.paginate = (req,res, next) => {
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 10;

    const offset = (page - 1) * limit;

    req.pagination = {limit , offset}

    next();
    
  };