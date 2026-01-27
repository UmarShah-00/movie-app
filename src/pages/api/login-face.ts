import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../lib/mongo";
import User from "../../../models/User";
import * as faceapi from "face-api.js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    await connectMongo();
    const { faceEmbedding } = req.body;
    if (!faceEmbedding) return res.status(400).json({ message: "Face embedding missing" });

    const users = await User.find({});
    const threshold = 0.6;
    let matchedUser = null;

    for (const user of users) {
      if (!user.faceEmbedding) continue;
      const dist = faceapi.euclideanDistance(faceEmbedding, user.faceEmbedding);
      if (dist < threshold) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) return res.status(401).json({ success: false, message: "Face not recognized" });

    return res.status(200).json({ success: true, name: matchedUser.name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
