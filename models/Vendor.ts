import mongoose, {Schema, Document, Model } from "mongoose";


interface VendorDoc extends Document{
    name: string,
    ownerName: string,
    foodType: [string],
    pincode: string,
    address: string,
    phone: string,
    email: string,
    password: string,
    salt: string,
    servicesAvailable : Boolean,
    coverImage: [string],
    rating: number,
    foods: any
}


const VendorSchema = new Schema({
    name: {type: String, required: true},
    ownerName: {type: String, required: true},
    foodType: {type: [String] },
    pincode: {type: String},
    address: {type: String},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    salt: {type: String, required: true},
    servicesAvailable : {type: Boolean},
    coverImage: {type: [String]},
    rating: {type: Number},
    foods: [{
        type: mongoose.Types.ObjectId,
        ref: 'Food'
    }]
},{
    toJSON:{
        transform(doc, ret){
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
})

const Vendor = mongoose.model<VendorDoc>('Vendor', VendorSchema);
export {Vendor};