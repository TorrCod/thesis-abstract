import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const report = req.body;
    const reportHeader = req.headers;
    console.log(reportHeader);
    console.log("--------");
    console.log(report);
    res.status(200).end();
  } catch (e) {
    console.error(e);
    res.status(500).send("server error");
  }
};

export default handler;
