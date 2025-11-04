import express from "express";
import { MongoClient } from "mongodb";

const app = express();
app.use(express.json());

// Ganti dengan connection string MongoDB Atlas kamu
const uri = "mongodb+srv://hialdialfianto_db_user:k1fVGf9V9pjC2RjV@cluster0.wyyp9a1.mongodb.net/?appName=Cluster0";

let client;
async function connectToDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db("fif").collection("cii");
}

app.post("/", async (req, res) => {
  try {
    const { company_name, contact_person_name, email_address, phone_number, meeting_type, messages } = req.body;

    if (!company_name || !email_address || !messages) {
      return res.status(400).json({ error: "Data wajib belum lengkap" });
    }

    const collection = await connectToDB();
    const result = await collection.insertOne({
      company_name,
      contact_person_name,
      email_address,
      phone_number,
      meeting_type,
      messages,
      created_at: new Date(),
    });

    return res.status(201).json({
      message: "Data berhasil disimpan ke MongoDB Atlas",
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

export default app;
