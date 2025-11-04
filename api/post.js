import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
app.use(express.json());

// Ganti dengan connection string MongoDB Atlas kamu
const uri = "mongodb+srv://hialdialfianto_db_user:k1fVGf9V9pjC2RjV@cluster0.wyyp9a1.mongodb.net/?appName=Cluster0";

app.use(
  cors({
    origin: ["https://human-initiative.org", "http://127.0.0.1:5500"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

let client;
async function connectToDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db("fif").collection("cii");
}

app.post("/api/post", async (req, res) => {
  try {
    const { company_name, contact_person_name, email_address, phone_number, meeting_type, messages } = req.body;

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

    res.status(201).json({
      message: "Data berhasil disimpan",
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// // ✅ Tambahan untuk mode lokal:
// if (process.env.NODE_ENV !== "production") {
//   const PORT = 3000;
//   app.listen(PORT, () => console.log(`🚀 Server berjalan di http://localhost:${PORT}`));
// }

export default app;
