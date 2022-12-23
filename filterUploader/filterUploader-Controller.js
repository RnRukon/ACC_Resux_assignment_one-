const fs = require('fs');
const Product = require("../models/product_module");



exports.fileUpload = async (req, res) => {
    const { title, description, stock, price } = JSON.parse(req?.body?.product);
    const fileName = await req?.files[0]?.filename;
    console.log(title, description, stock, price)

    try {


        const host = req.protocol + '://' + req.get('host');
        const imageURL = host + "/images/" + fileName;

        const newProduct = {
            title,
            description,
            stock: Number(stock),
            price: Number(price),
            viewCount: Number(0),
            images: { ...req?.files[0], imageURL }
        }

        const result = await Product.create(newProduct);
        res.status(200).json({
            status: "Success",
            message: "Data inserted successfully",
            result: result
        })


    } catch (error) {




        if (fileName) {
            var directoryPath = __dirname.replace("filterUploader", "images") + "\\" + fileName;
            fs.unlink(directoryPath, function (err) {
                if (err) throw err;
                res.status(400).json({
                    status: "Fail",
                    message: "Data  not inserted",
                    error: error.message
                })
            });
        } else {
            res.status(400).json({
                status: "Fail",
                message: "Data  not inserted",
                error: error.message
            })
        }

    }


}



