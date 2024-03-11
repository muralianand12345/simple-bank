import mongoose, { Document, Model, Schema } from 'mongoose';

interface ILogin {
    username: string;
    password: string;
    accountID: number;
}

interface ILoginModel extends ILogin, Document { }

const LoginSchema: Schema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    accountID: { type: Number, required: true },
});

const Login: Model<ILoginModel> = mongoose.model<ILoginModel>('Login', LoginSchema);

export { Login };