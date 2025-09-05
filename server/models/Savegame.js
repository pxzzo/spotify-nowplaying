import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  data: Object,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Savegame', schema);
