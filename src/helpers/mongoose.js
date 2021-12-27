import mongoose from 'mongoose';

// Validator function
const isValidObjectId = (id) => mongoose.isValidObjectId(id);

export default isValidObjectId;
