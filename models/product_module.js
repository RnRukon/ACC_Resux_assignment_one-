const { Schema, default: mongoose } = require("mongoose")


const product = new Schema({
    title: {
        type: String,
        required: [true, "Please provide a name for this data."],
        trim: true,
        unique: [true, "Name must be unique"],
        minLength: [3, "Name must be at least 3 characters"],
        maxLength: [100, "Name is to large"]
    },

    description: {
        type: String,
        required: [true, 'Description is required'],

    },
    stock: Number,
    price: {
        type: Number,
        required: [true, 'Price is required'],

    },
    images: {
        type: Object,
        required: [true, 'Images is required']
    },

    viewCount: Number

},
    {
        timestamps: true,
    })

const Product = mongoose.model('product', product);
module.exports = Product