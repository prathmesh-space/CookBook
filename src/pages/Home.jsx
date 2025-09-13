import React from "react";
import bgImage from "../assets/cookbook-bg.png";

const Home = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
            <h1 className="home-heading">Welcome to CookBook</h1>

      <div className="grid-container-home">
        <div className="grid-item-home">
          <a className="h2Style" href="/search">
            Search
          </a>
          <p className="home-content">
            Discover new, mouthwatering recipes from our extensive collection of
            thousands of savory dishes.
            <br></br>
            Explore recipe details.
            <br></br>
            Simply type in your cravings and let the culinary adventure begin!
          </p>
        </div>
        <div className="grid-item-home">
          <a className="h2Style" href="/recommendations">
            Recommendations
          </a>
          <p className="home-content">
            Feeling adventurous?
            <br></br>
            Let our AI-powered recommendation system guide you!
            <br></br>
            Whether you're craving a specific type of cuisine or seeking
            culinary inspiration, our recommendation engine will spark your
            imagination and delight your taste buds.
          </p>
        </div>
        <div className="grid-item-home">
          <a className="h2Style" href="/create-recipe">
            Create Recipe
          </a>
          <p className="home-content">
            Can't find that special recipe?
            <br></br>
            Preserve your family favorites or unleash your creativity with our
            recipe creator.
            <br></br>
            Add your own ingredients, instructions, and personal touches to
            create your modern-day cookbook.
            <br></br>
            Keep track of and share your culinary masterpieces with ease.
          </p>
        </div>
        <div className="grid-item-home">
          <a className="h2Style" href="/calendar">
            Calendar
          </a>
          <p className="home-content">
            Never forget a meal again!
            <br></br>
            Plan your meals days, weeks, or even months in advance with our
            intuitive calendar feature.
            <br></br>
            Keep track of your daily calorie intake and manage your meals
            effortlessly.
            <br></br>
            From breakfast to dinner, your culinary journey starts here.
          </p>
        </div>
      </div>
    </div>
    
  );
};

export default Home;