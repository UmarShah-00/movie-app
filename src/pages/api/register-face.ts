import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../lib/mongo";
import User from "../../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ❌ Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // ✅ Connect MongoDB
    await connectMongo();

    const { name, email, faceEmbedding } = req.body;

    // ❌ Validation
    if (!name || !email || !faceEmbedding) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Save user
    const user = new User({
      name,
      email,
      faceEmbedding,
    });

    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err: any) {
    console.error("Register Face Error:", err);

    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
}
