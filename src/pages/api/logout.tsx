import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Set-Cookie", [
    serialize("next-auth.csrf-token", "", { maxAge: -1, path: "/" }),
    serialize("next-auth.callback-url", "", { maxAge: -1, path: "/" }),
  ]);
  return res.end();
};

export default handler;
