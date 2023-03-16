export const extractFromScannedImage = (
  filePath: string,
  callback: (error: Error | null, data: any) => void
) => {
  const path = require("path");
  const pdf_extract = require("pdf-extract");
  const absolute_path_to_pdf = path.resolve(filePath);
  if (absolute_path_to_pdf.includes(" "))
    throw new Error(
      "will fail for paths with spaces like " + absolute_path_to_pdf
    );
  const options = {
    type: "ocr",
    ocr_flags: ["--psm 1"],
  };
  const processor = pdf_extract(absolute_path_to_pdf, options, () => {});
  processor.on("complete", (data: any) => callback(null, data));
  processor.on("error", callback);
};
