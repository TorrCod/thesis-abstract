import type { NextApiRequest, NextApiResponse } from "next";
import tesseract from "node-tesseract-ocr";
import formidable, { File } from "formidable";
import { extractFromScannedImage } from "@/lib/node_pdf";

//set bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) reject(reject);
        const absoluteFilePath = (files.file as File).filepath; // Get the file object
        console.log(absoluteFilePath);
        extractFromScannedImage(absoluteFilePath, (err, data) => {
          if (err) reject(reject);
          fields["text"] = data;
          resolve({ err, fields, files });
        });
      });
    });
    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Upload Failed" });
  }
};

export default handler;
