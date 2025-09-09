class Plan {
  constructor(date, meals) {
    this.date = date;
    this.meals = meals;
  }

  toString() {
    return this.date + ", " + this.meals.map((meal) => meal.name).join(", ");
  }
}

export { Plan };
