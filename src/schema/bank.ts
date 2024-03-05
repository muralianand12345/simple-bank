import mongoose, { Document, Model, Schema } from 'mongoose';

interface IBank {
    account: string;
    balance: number;
}

interface IBankModel extends IBank, Document { }

const BankSchema: Schema = new Schema({
    account: { type: String, required: true },
    balance: { type: Number, required: true },
});

const Bank: Model<IBankModel> = mongoose.model<IBankModel>('Bank', BankSchema);

export { Bank };
