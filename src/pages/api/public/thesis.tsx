import { getDistinctData, getOneData, getData } from "@/lib/mongo";
import { parseQuery } from "@/utils/server-utils";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
    default: {
      const { query, option } = parseQuery(req);
      const thesisItems = await getData(
        "thesis-abstract",
        "thesis-items",
        query,
        {
          limit: option?.limit,
          projection: option?.projection,
        }
      );
      return res.status(200).json(thesisItems);
    }
  }
};

export default handler;
