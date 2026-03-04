import { Document, Query, QueryOptions } from "mongoose";
import { matchInnerRegex } from "./commonUtils";

/**
 * @description provides filtering, sorting, limiting fields, pagination, and searching
 * @query ?name=abc&price[gte]=100&price[lte]=200&sort=price&fields=name,price&page=2&limit=10
 * @query ?name=abc (exact match)
 * @query ?name=/abc/ (regex)
 * @query ?sort=-price (descending order)
 * @query ?fields=-name (exclude name)
 * @query ?page=2&limit=10 (pagination)
 * @query ?search=abc (search in dynamic fields)
 *
 * using Example:-
 *
 * const features = new ApiFeatures(Product.find(), req.query)
 *                  .filter()
 *                  .search("name", "email")
 *                  .sort()
 *                  .limitFields()
 *                  .paginate();
 *
 * const products = await features.query;
 */
class ApiFeatures<T extends Document> {
  public query: Query<T[], T, {}>;
  public queryString: QueryOptions;

  constructor(query: Query<T[], T, {}>, queryString: QueryOptions) {
    this.query = query;
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

    this.query = this.query.find(
      JSON.parse(queryStr, (_, value) => {
        if (typeof value === "string" && value === "[currentDate]") {
          return new Date();
        }
        return value;
      })
    );
    return this;
  }

  search(...fields: string[]): this {
    if (this.queryString.search) {
      const searchRegex = new RegExp(this.queryString.search as string, "i");

      const searchConditions = fields.map((field) => ({
        [field]: searchRegex,
      }));

      this.query = this.query.find({ $or: searchConditions });
    }
    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate(): this {
    const page = Number(this.queryString.page || 1);
    const limit = Number(this.queryString.limit || 100);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default ApiFeatures;
