import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    return res.status(200).json({ error: "Upload Failed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Upload Failed" });
  }
};

export default handler;
