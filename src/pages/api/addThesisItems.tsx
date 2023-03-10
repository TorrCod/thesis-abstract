import { addData } from "@/lib/mongo";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files } from "formidable";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const payload = req.body;
    await addData("thesis-abstract", "thesis-items", payload);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Upload Failed" });
  }
};

export default handler;
