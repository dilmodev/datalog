const { RESTDataSource } = require("apollo-datasource-rest");

class API extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.publicapis.org/";
  }

  async getAllEntries() {
    const { entries } = await this.get("entries");
    console.log(entries);
    return Array.isArray(entries)
      ? entries.map((entry) => this.entryReducer(entry))
      : [];
  }

  async getCategories() {
    const categories = await this.get("categories");
    return Array.isArray(categories)
      ? categories.map((category) => this.categoryReducer(category))
      : [];
  }

  async getEntriesByCategory(category) {
    const categoryTrimmed = category.split(" ")[0];

    const { entries } = await this.get(`entries?category=${categoryTrimmed}`);

    if (Array.isArray(entries)) {
      return entries
        .map((entry) => {
          return this.entryReducer(entry);
        })
        .filter((e) => {
          return (
            categoryTrimmed !== "Currency" || e.category === "Currency Exchange"
          );
        });
    } else {
      return [];
    }
  }

  categoryReducer(category) {
    return {
      title: category,
    };
  }

  entryReducer(entry) {
    return {
      title: entry.API,
      category: entry.Category,
      description: entry.Description,
      https: entry.HTTPS,
      authRequired: entry.Auth !== "",
      supportsCors: entry.Cors === "yes",
      link: entry.Link,
    };
  }
}

module.exports = API;