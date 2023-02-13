import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema (
    {
        name: {type: String, required: true },
        user_id: {type: String, required: true},
        privileges: {
            read: {type: Boolean, required: true},
            create: {type: Boolean, required: true},
            update: {type: Boolean, required: true},
            delete: {type: Boolean, required: true},
        }
    },
)


const userModel = mongoose.model('user', userSchema, 'privileges');

export const schema = userModel.schema;
export default userModel;