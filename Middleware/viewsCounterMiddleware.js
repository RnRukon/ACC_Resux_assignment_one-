const Product = require('../models/product_module')

exports.viewCount = async (req, res, next) => {
  try {

    const { id } = req.params;


    let result = await Product.findById({ _id: id });
    result.viewCount++;

    result.save()

    next()
  } catch (error) {
    res.status(400).json(
      {
        status: 'fail',
        message: 'server error'
      }
    )
  }
}