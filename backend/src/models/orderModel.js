import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderItems: [
            {
                name: { type: String, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                course: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true,
                },
            },
        ],
        Address: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            location: {
                lat: Number,
                lng: Number,
                address: String,
                name: String,
                vicinity: String,
                googleAddressId: String,
            },
        },
        paymentMethod: { type: String, required: true },
        paymentResult: {
            id: String,
            status: String,
            update_time: String,
            email_address: String,
        },
        itemsPrice: { type: Number, required: true },
        taxPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;