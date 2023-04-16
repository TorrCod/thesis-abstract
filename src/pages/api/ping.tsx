import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).send({ hello: "helloworld" });
};

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "0.6mb", // Set desired value here
    },
  },
};
