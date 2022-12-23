const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { fileUpload } = require("./filterUploader/filterUploader-Controller");
const uploader = require("./filterUploader/uploader");
const Product = require("./models/product_module");
const fs = require('fs');
const e = require("express");
const { viewCount } = require("./Middleware/viewsCounterMiddleware");

const dotenv = require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use('/images', express.static('./images'));


// database connection


const dbConnect = () => {
    try {
        mongoose.connect('mongodb+srv://acc-redux-assignment:5CG8JhXbeSLgjYC4@cluster0.af4at.mongodb.net/ACC_Redux-Assignment?retryWrites=true&w=majority').then(() => {
            console.log(`Database connection is Successfully`);
        })
    } catch (error) {
        console.log(error)
    }
}
dbConnect()



app.get("/", (req, res) => {
    res.send("Route is working! YaY!");
});



app.get('/single-product/:id', viewCount, async (req, res) => {
    try {

        let product = await Product.findById({ _id: req.params.id })
        res.status(200).json({
            status: "Success",
            message: "Data get successfully",
            data: product
        });




    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: "Data  not find",
            error: error.message
        });
    }
})


app.delete('/delete-product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const findProduct = await Product.findById({ _id: id });

        const product = await Product.deleteOne({ _id: id });

        const directoryPath = __dirname + "/images/" + findProduct.images.filename;

        if (product.deletedCount === 1) {
            try {
                fs.unlinkSync(directoryPath);

                res.status(200).json({
                    status: "Success",
                    message: "Data deleted successfully",
                    product: product

                });
            } catch (err) {
                res.status(500).send({
                    message: "Could not delete the file. " + err,
                });
            }
        }
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: "Data  not deleted",
            error: error.message
        });
    }
})


app.patch('/product/:id', uploader.array("image"), async (req, res) => {

    const { title, description, price, oldFileName } = JSON.parse(req?.body?.product);

    console.log(title, description, price, oldFileName);
    const fileName = await req?.files[0]?.filename;


    try {
        const { id } = req.params;

        const host = req.protocol + '://' + req.get('host');
        const imageURL = host + "/images/" + fileName;

        const newProduct1 = {
            title,
            description,
            price: Number(price),
            images: { ...req?.files[0], imageURL }
        }
        const newProduct2 = {
            title,
            description,
            price: Number(price),


        }


        const product = await Product.updateOne(
            { _id: id }, fileName ? newProduct1 : newProduct2, { runValidators: true }
        );

        if (product?.modifiedCount && fileName && oldFileName) {
            const directoryPath = __dirname + "\\images\\" + oldFileName;
            try {

                fs.unlinkSync(directoryPath);

                res.status(200).json({
                    status: "success",
                    message: "Data is updated 1",
                    product: product
                });

            } catch (error) {
                throw new Error('Bad Required');
            }

        }
        if (product?.modifiedCount && !fileName) {
            res.status(200).json({
                status: "success",
                message: "Data is updated 3",
                product: product
            });
        }




    } catch (error) {

        if (fileName) {
            try {
                const directoryPath = __dirname + "\\images\\" + oldFileName;
                fs.unlinkSync(directoryPath);
                res.status(400).json({
                    status: "Fail",
                    message: "Data  not updated 4",
                    error: error.message
                });
            } catch (error) {
                res.status(400).json({
                    status: "Fail",
                    message: "Data  not updated 5",
                    error: error.message
                });
            }

        }



    }
})


app.get('/products', async (req, res) => {
    try {

        let products = await Product.find({})

        res.status(200).json({
            status: "Success",
            message: "Data get successfully",
            data: products
        });
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: "Data  not find",
            error: error.message
        });
    }
})



app.post("/products", uploader.array("image"), fileUpload);



// server
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
