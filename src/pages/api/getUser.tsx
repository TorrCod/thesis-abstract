import { UserDetails } from "@/context/types.d";
import { getData } from "@/lib/mongo";
import { findUser } from "@/utils/account";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { _id } = req.body;
    const items: UserDetails[] = (await getData("accounts", "user", {
      uid: _id,
    })) as any;
    const postUserDtls = findUser(_id, items);
    return res.json(postUserDtls[0]);
  } catch (e) {
    console.error(e);
    throw new Error(e as string).message;
  }
};

export default handler;
