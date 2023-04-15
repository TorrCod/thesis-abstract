import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(typeof req.body);
  return res.status(200).send({ hello: "helloworld" });
};

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "0.5mb", // Set desired value here
    },
  },
};
