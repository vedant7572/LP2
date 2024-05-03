const express = require("express");
const mongoose = require("mongoose");
const Students = require("./studentMarks.js");
const path = require('path');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const mongo_URL = "mongodb://0.0.0.0:27017";
const PORT = 2324;

mongoose
  .connect(mongo_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is connected successfully to port", PORT);
      console.log("MongoDB is connecte successfully");
    });
  })
  .catch((error) => {
    console.log("Cant connect to MongoDB server");
    console.log(error);
  });

app.post("/add", async (req, res) => {
  const { Name, Roll_no, CC, WAD, CNS, DSBDA, AI } = req.body;
  const student = await Students.create({
    Name,
    Roll_no,
    CC,
    WAD,
    CNS,
    DSBDA,
    AI,
  });
  res.send({ message: "Student inserted successfully", student });
});

app.get("/showStudents", async (req, res) => {
  const students = await Students.find();
  res.send({ "total count": students.length, students });
});

// app.get("/showStudent1/:student_id", async(req, res)=>{
//     const student_id = req.params.student_id;
//     const student = await Students.findById({_id:student_id});
//     res.send(student);
// })

app.get("/DSBDA_20", async (req, res) => {
  const students = await Students.find({ DSBDA: { $gt: 20 } }, { Name: true });
  res.send(students);
});

app.put("/update_marks/:student_id", async (req, res) => {
  const student_id = req.params.student_id;
  const stud = await Students.findById({_id:student_id});
  if(stud){
    const students = await Students.findOneAndUpdate(
      { _id: student_id },
      {
        $inc: {
          CC: 10,
          DSBDA: 10,
          CNS: 10,
          WAD: 10,
        },
      },
      { new: true }
    );
    // res.send(students);
    res.send("Student updated successfully");
  }else{
    res.send("student not found");
  }
  
});

app.get("/morethan25inall", async (req, res) => {
  const students = await Students.find(
    {
      DSBDA: { $gt: 25 },
      CC: { $gt: 25 },
      CNS: { $gt: 25 },
      WAD: { $gt: 25 },
      AI: { $gt: 25 },
    },
    { Roll_no: true }
  );
  res.send(students);
});

app.get("/lessthan40", async (req, res) => {
  const students = await Students.find({
    DSBDA: {$lt:40},
    WAD: {$lt:40},
  }, {Name:true});
  res.send(students);
});

app.delete("/deleteStudent/:student_id", async(req, res)=>{
    const student_id=req.params.student_id;
    const student = await Students.findByIdAndDelete({_id:student_id}); 
//     res.send({meassage: "Student is deleted successfully",
// student});

    res.send({meassage: "Student is deleted successfully"});
})

app.get("/showTable", async(req, res)=>{
    const students = await Students.find();

    let html = "<table border=1, style='border-collapse: collapse'>"
    html = html + `<tr>
        <th>Name</th>
        <th>Roll_No</th>
        <th>WAD</th>
        <th><CC</th>
        <th>DSBDA</th>
        <th>CNS</th>
        <th>AI</th>
    </tr>`

    students.map((student)=>{
        html = html + "<tr>"

        html = html + "<td>" + student.Name + "</td>"
        html = html + "<td>" + student.Roll_no + "</td>"
        html = html + "<td>" + student.WAD + "</td>"
        html = html + "<td>" + student.CC + "</td>"
        html = html + "<td>" + student.DSBDA + "</td>"
        html = html + "<td>" + student.CNS + "</td>"
        html = html + "<td>" + student.AI + "</td>"

        html = html + "</tr>"
    })
    html = html + "</table>"
    res.send(html);
})
