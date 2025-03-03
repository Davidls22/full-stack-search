import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

if (process.env.NODE_ENV !== "production" && !process.env.DATABASE_URL) {
  await import("./db/startAndSeedMemoryDB");
}

const PORT = process.env.PORT || 3001;
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/search", async (req, res) => {
  const query = req.query.query?.toString().trim();
  if (!query) return res.json({ hotels: [], countries: [], cities: [] });

  const client = new MongoClient(DATABASE_URL);
  try {
    await client.connect();
    const db = client.db();

    const hotels = await db
      .collection("hotels")
      .find({
        $or: [
          { hotel_name: { $regex: query, $options: "i" } },
          { country: { $regex: query, $options: "i" } },
          { city: { $regex: query, $options: "i" } },
        ],
      })
      .toArray();

    const countries = await db
      .collection("countries")
      .find({
        country: { $regex: query, $options: "i" },
      })
      .toArray();

    const cities = await db
      .collection("cities")
      .find({
        name: { $regex: query, $options: "i" },
      })
      .toArray();

    res.json({
      hotels: hotels.map((h) => ({
        _id: h._id,
        hotel_name: h.hotel_name,
        country: h.country,
      })),
      countries: countries.map((c) => ({
        _id: c._id,
        country: c.country,
      })),
      cities: cities.map((c) => ({
        _id: c._id,
        name: c.name,
      })),
    });
  } finally {
    await client.close();
  }
});

app.get("/hotels/:id", async (req, res) => {
  const { id } = req.params;
  const client = new MongoClient(DATABASE_URL);
  try {
    await client.connect();
    const db = client.db();
    const hotel = await db
      .collection("hotels")
      .findOne({ _id: new ObjectId(id) });
    res.json(hotel);
  } finally {
    await client.close();
  }
});

app.get("/countries/:id", async (req, res) => {
  const { id } = req.params;
  const client = new MongoClient(DATABASE_URL);
  try {
    await client.connect();
    const db = client.db();
    const country = await db
      .collection("countries")
      .findOne({ _id: new ObjectId(id) });
    res.json(country);
  } finally {
    await client.close();
  }
});

app.get("/cities/:id", async (req, res) => {
  const { id } = req.params;
  const client = new MongoClient(DATABASE_URL);
  try {
    await client.connect();
    const db = client.db();
    const city = await db
      .collection("cities")
      .findOne({ _id: new ObjectId(id) });
    res.json(city);
  } finally {
    await client.close();
  }
});

app.get("/countries/:name/hotels", async (req, res) => {
  const { name } = req.params;
  const client = new MongoClient(DATABASE_URL);
  try {
    await client.connect();
    const db = client.db();
    const hotels = await db
      .collection("hotels")
      .find({ country: name })
      .toArray();
    res.json(hotels);
  } finally {
    await client.close();
  }
});

app.get("/cities/:name/hotels", async (req, res) => {
  const { name } = req.params;
  const client = new MongoClient(DATABASE_URL);
  try {
    await client.connect();
    const db = client.db();
    const hotels = await db
    .collection("hotels")
    .find({ city: name })
    .toArray();
    res.json(hotels);
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`API Server Started at ${PORT}`);
});
