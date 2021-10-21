import express, { request, response } from "express"; // default export
import { MongoClient } from "mongodb";
import dotenv from "dotenv"; 

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
   const client = new MongoClient(MONGO_URL);
   await client.connect();
   return client;
} 

// Retreiving Student data
app.get("/Students",async(request, response) =>{
    const client = await createConnection();
    const studentdta = await client.db("Mentor").collection("Studentdata").find({}).toArray();
    response.send(studentdta);
});

//Creating student data
app.post("/studentData", async(request, response) =>{
    const studntdata = request.body;
    const client = await createConnection();
    const stdntdata = await client.db("Mentor").collection("Studentdata").insertMany(studntdata);
    console.log(stdntdata);
    response.send(stdntdata);
    response.send({msg: "student created"});
});



// Retreiving Mentor data
app.get("/Mentors",async(request, response) =>{
    const client = await createConnection();
    const mentordta = await client.db("Mentor").collection("mentorData").find({}).toArray();
    response.send(mentordta);
});
//Creating Mentor data
app.post("/MentorData", async(request, response) =>{
    const mentordata = request.body;
    const client = await createConnection();
    const stdntdata = await client.db("Mentor").collection("mentorData").insertMany(mentordata);
    response.send(mentordata);
    response.send({msg: "mentor created"});
});

//Assigning Student to Mentor

app.put("/AssignStudent", async(request, response) =>{
    const mentordata = request.body;
    // console.log(mentordata);
    const client = await createConnection();
    const stdntdata = await client.db("Mentor").collection("mentorData").findOne({mentorId: mentordata.mentorId});
    // console.log(stdntdata)
    await Promise.all(mentordata.students_data.map((student) => {
        // console.log(stdntdata)
        stdntdata?.students_data.push(student)
    }))
    const stdntupdateddata = await client.db("Mentor").collection("mentorData").updateOne({mentorId: mentordata.mentorId},{$set: {...stdntdata}});
    console.log(stdntupdateddata);
    response.send({msg: "student assigned to mentor"});
});

//A Student who has a mentor should not be shown in List

app.get("/Studentdata",async(request, response) =>{
    const client = await createConnection();
    const studentdta = await client.db("Mentor").collection("Studentdata").find({}).toArray();
    const result = studentdta.filter(word => word.mentor_id == null || "");
    console.log(result);
    response.send(result);
   
});

//Select One Student and Assign one Mentor



app.listen(PORT, () => console.log("Server is listening", PORT));
