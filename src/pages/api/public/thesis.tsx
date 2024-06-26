import { ThesisState } from "@/context/types.d";
import { getDistinctData, getOneData, getDataWithPaging } from "@/lib/mongo";
import { sleep } from "@/utils/helper";
import {
  calculateThesisCount,
  parseQuery,
  validateAuth,
} from "@/utils/server-utils";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const isValidated = await validateAuth(req, res);
  if (isValidated.error) {
    return res.status(400).json(isValidated);
  }
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  switch (req.query.objective) {
    case "get-distinct-years": {
      const distinctYears = (await getDistinctData(
        "thesis-abstract",
        "thesis-items",
        "year"
      )) as number[];
      distinctYears.sort((a, b) => b - a);
      const stringifyYears = distinctYears.map((item) => item.toString());
      return res.status(200).json([...new Set(stringifyYears)]);
    }
    case "get-one": {
      const _id = req.query._id as string | undefined;
      if (!_id) return res.status(404).send("no id");
      const thesisItem = await getOneData("thesis-abstract", "thesis-items", {
        _id: new ObjectId(_id),
      });
      if (!thesisItem) return res.status(404);
      return res.status(200).json(thesisItem);
    }
    case "get-thesis-count": {
      const thesisCount = await calculateThesisCount();
      return res.status(200).json({
        thesisCount,
        totalCount: thesisCount.reduce((acc, { count }) => acc + count, 0),
      });
    }
    default: {
      const { query, option } = parseQuery(req);
      const pageSize = (req.query.pageSize &&
        parseInt(req.query.pageSize as string)) as number;
      const pageNo = (req.query.pageNo &&
        parseInt(req.query.pageNo as string)) as number;

      const thesisItems = (await getDataWithPaging(
        "thesis-abstract",
        "thesis-items",
        { pageNo: pageNo, pageSize },
        query,
        {
          limit: option?.limit,
          projection: option?.projection,
        }
      )) as unknown as ThesisState;
      return res.status(200).json(thesisItems);
    }
  }
};

export default handler;
