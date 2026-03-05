import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true },
    items: [{
        id: String,
        title: String,
        price: Number,
        quantity: Number,
        selectedSize: String,
        image: String
    }],
    total: { type: Number, required: true },
    currency: { type: String, default: "ZAR" },
    status: {
        type: String,
        enum: ["pending", "paid", "failed", "shipped"],
        default: "pending"
    },
    shippingAddress: {
        fullName: String,
        address: String,
        city: String,
        province: String,
        zipCode: String,
        phoneNumber: String
    },
    paystackReference: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
