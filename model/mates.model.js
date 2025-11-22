import mongoose from "mongoose";

const mateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        trim: true
    },
    image: {
        type: String,
        required: [true, 'La imagen del producto es obligatoria'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'El stock no puede ser negativo']
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo'],
        default: 0
    }
}, {
    timestamps: true
});

mateSchema.pre('save', function (next) {
    if (this.name) this.name = this.name.trim();
    if (this.category) this.category = this.category.trim().toLowerCase();
    next();
});

export default mongoose.model('Product', mateSchema);
