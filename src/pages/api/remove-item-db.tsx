import { deleteData } from "@/lib/mongo";
import { QueryPost } from "@/lib/types";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const bodyData = req.body as QueryPost;
    const response = await deleteData(bodyData);

    return res.json({ message: "Item Deleted", response });
  } catch (e) {
    console.error(e);
    return res.json({ message: "Something went wrong", error: e });
  }
};

export default handler;
