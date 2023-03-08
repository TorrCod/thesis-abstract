import type { NextApiRequest, NextApiResponse } from "next";
import { pdf } from "pdf-to-img";
import tesseract from "node-tesseract-ocr";

const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const dataBuffer = Buffer.from(req.body);
    const data = await pdf(dataBuffer);
    // create an array to store the generated image URLs
    let text = "";

    // iterate over the generated images and retrieve their URLs
    for await (const page of data) {
      //image generated
      const extText = await tesseract.recognize(page, config);
      text += extText;
    }

    return res.status(200).json({ data: text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Upload Failed" });
  }
};

export default handler;
