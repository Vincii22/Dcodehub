const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Optionally, you can add methods to the schema for additional functionality
UserSchema.methods.someMethod = function() {
    // Implement some method
};

// Export the model
module.exports = mongoose.model('User', UserSchema);