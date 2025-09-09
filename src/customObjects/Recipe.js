class Recipe {
  constructor(
    cuisine,
    dishType,
    id,
    image,
    ingredients,
    instructions,
    name,
    servings,
    summary,
  ) {
    this.cuisine = cuisine;
    this.dishType = dishType;
    this.id = id;
    this.image = image;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.name = name;
    this.servings = servings;
    this.summary = summary;
    this.isSaved = false;
  }
  toString() {
    return (
      this.cuisine +
      ", " +
      this.dishType +
      ", " +
      this.id +
      ", " +
      this.image +
      ", " +
      this.ingredients +
      ", " +
      this.instructions +
      ", " +
      this.name +
      ", " +
      this.servings +
      ", " +
      this.summary
    );
  }
}

export { Recipe };
