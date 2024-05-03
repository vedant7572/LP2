const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    Name: String,
    Roll_no: Number,
    CC: Number,
    WAD: Number,
    CNS: Number,
    DSBDA: Number,
    AI: Number,
})

const Students = mongoose.model("StudentMarks", studentSchema);
module.exports = Students;
