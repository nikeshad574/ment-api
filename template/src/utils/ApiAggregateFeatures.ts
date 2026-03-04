import { Aggregate, Document, QueryOptions } from "mongoose";
import { matchInnerRegex } from "./commonUtils";

class ApiAggregateFeatures<T extends Document> {
  public aggregation: Aggregate<T[]>;
  public queryString: QueryOptions;

  constructor(aggregation: Aggregate<T[]>, queryString: QueryOptions) {
    this.aggregation = aggregation;
    this.queryString = queryString;
  }

  filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match: string) => `$${match}`
    );

    // for regex user name=/name/
    queryStr = queryStr.replace(
      /"\/([^\/]+)\/"/g,
      (match: string) =>
        `{ "$regex": "${matchInnerRegex(
          match,
          /"\/([^\/]+)\/"/
        )}", "$options": "i"}`
    );

    // Use a reviver in JSON.parse to convert YYYY-MM-DD strings to Date objects
    this.aggregation = this.aggregation.match(
      JSON.parse(queryStr, (_, value) => {
        if (typeof value === "string" && value === "[currentDate]") {
          return new Date();
        }
        return value;
      })
    );

    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.aggregation = this.aggregation.sort(sortBy);
    } else {
      this.aggregation = this.aggregation.sort("-createdAt");
    }

    return this;
  }

  search(...fields: string[]): this {
    if (this.queryString.search) {
      const searchRegex = new RegExp(this.queryString.search as string, "i");

      const searchConditions = fields.map((field) => ({
        [field]: searchRegex,
      }));

      this.aggregation = this.aggregation.match({ $or: searchConditions });
    }
    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",");
      this.aggregation = this.aggregation.project(
        fields.reduce((acc: any, field: string) => {
          acc[field] = 1;
          return acc;
        }, {})
      );
    } else {
      this.aggregation = this.aggregation.project({ __v: 0 });
    }

    return this;
  }

  paginate(): this {
    const page = Number(this.queryString.page || 1);
    const limit = Number(this.queryString.limit || 100);
    const skip = (page - 1) * limit;

    this.aggregation = this.aggregation.skip(skip).limit(limit);

    return this;
  }
}

export default ApiAggregateFeatures;
