import { addData } from "@/lib/mongo";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files } from "formidable";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { uid } = req.query;

    // const contentType = req.headers["content-type"];
    // if (contentType === "application/pdf") {
    //   // await addData("thesis-abstract", "pdf-files", req.body);
    //   return res.status(200).json({ message: "Upload Success (PDF)" });
    // } else if (contentType === "image/jpeg" || contentType === "image/png") {
    //   return res.status(200).json({ message: "Upload Success (Image)" });
    // } else {
    //   return res.status(400).json({
    //     error: "Invalid content type. Only PDF, JPEG or PNG are allowed.",
    //   });
    // }
    await addData("thesis-abstract", "pdf-files", { uid: uid, file: req.body });
    console.log("done");

    return res.status(200).json({ error: "Upload Failed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Upload Failed" });
  }
};

export default handler;
