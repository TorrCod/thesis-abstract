import { uploadProfile } from "@/lib/firebase";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //   try {
  //     const payload = req.body;
  //     const data = await uploadProfile(payload);
  //     return res.json(data);
  //   } catch (e) {
  //     console.error(e);
  //     throw new Error(e as string).message;
  //   }
};

export default handler;
