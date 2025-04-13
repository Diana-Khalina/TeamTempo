const { Schema, model } = import ('mongoose');
const bcrypt = import('bcrypt');

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  entries: [{ type: Schema.Types.ObjectId, ref: 'MoodEntry' }]
});

userSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isCorrectPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = model('User', userSchema);
