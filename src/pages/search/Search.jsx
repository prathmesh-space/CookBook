import React, { useState, useEffect } from "react";
import { Button, Row, Col, Container, Spinner } from "reactstrap";
import MealCard from "../../components/meal-card/MealCard.jsx";
import SearchBox from "./components/SearchBox.jsx";
import MealDataManager from "../../utils/MealDataManager.js";
import InfiniteScroll from "react-infinite-scroll-component";

const Search = () => {
  const [searchResults, setSearchResults] = useState("initial page load");
  const [query, setQuery] = useState("");
  const [numResults, setNumResults] = useState(-1);
  const [mealOfTheDay, setMealOfTheDay] = useState(null);
  const [resultsLoaded, setResultsLoaded] = useState(false);

  useEffect(() => {
    const fetchMealOfTheDay = async () => {
      try {
        const mealDataManager = new MealDataManager();
        const meal = await mealDataManager.getRandomMeal();
        setMealOfTheDay(meal);
      } catch (error) {
        console.error("Error fetching meal of the day: ", error);
      }
    };

    fetchMealOfTheDay();
  }, []);

  const handleFindMeal = async () => {
    try {
      const mealDataManager = new MealDataManager();
      const meal = await mealDataManager.getRandomMeal();
      setMealOfTheDay(meal);
    } catch (error) {
      console.error("Error fetching random meal: ", error);
    }
  };

  const handleSearchResults = (results) => {
    setSearchResults(results.resultsList);
    setNumResults(results.totalResults);
    setResultsLoaded(true);
  };

  const mealDataManager = new MealDataManager();

  const spinner = (
    <Col className="d-flex m-5 p-0 justify-content-center">
      <Spinner>Loading</Spinner>
    </Col>
  );
  //for infinte scroll
  const fetchMoreResults = async () => {
    try {
      // Wait for the query to complete and get the results
      const spoonacularQueryResults =
        await mealDataManager.queryRecipeFromSpoonacular(
          query,
          searchResults.length
        );

      setSearchResults(
        searchResults.concat(spoonacularQueryResults.resultsList)
      );
      //spoonacular caps results to 1000
      if (searchResults.length >= numResults || searchResults.length >= 999) {
        console.log(
          "searchResults.length=" +
            searchResults.length +
            " numResults=" +
            numResults
        );
        setNumResults(false);
      }
    } catch (error) {
      console.error("error: " + error); // Handle errors if the Promise is rejected
    }
  };

  // conditionally render the results
  let results;

  // if page loaded
  if (searchResults == "initial page load") {
    results = (
      <Col className="d-flex m-5 p-0 justify-content-center">
        <p className="text-secondary"></p>
      </Col>
    );
    // if there are results then put it into results varible to render
  } else if (Array.isArray(searchResults)) {
    results = (
      <InfiniteScroll
        dataLength={searchResults.length}
        next={fetchMoreResults}
        hasMore={numResults}
        loader={spinner}
        endMessage={
          <Col className="d-flex m-5 p-0 justify-content-center">
            <p className="text-secondary">
              Total {searchResults.length} results
            </p>
          </Col>
        }
      >
        <Container className="d-flex col-12 flex-wrap mt-3">
          {searchResults.map((meal, index) => (
            <MealCard key={index} meal={meal} />
          ))}
        </Container>
      </InfiniteScroll>
    );

    // if there are no results then we want to render a spinner :D
  } else if (!Array.isArray(searchResults)) {
    results = spinner;
  }

  return (
    <Container>
      <h1 className="d-flex justify-content-center">Search for recipes</h1>
      <Row>
        <Container className="d-flex justify-content-center">
          <SearchBox
            onSearch={handleSearchResults}
            query={query}
            setQuery={setQuery}
          />
        </Container>
      </Row>
      <Row>
        {!resultsLoaded && (
          <div className="motd-container">
            <div>
              <div className="search-random-button-container">
                <Button className="search-random-button" onClick={handleFindMeal}>
                  Discover a Meal!
                </Button>
              </div>
              {mealOfTheDay && (
                <div className="motd">
                  <MealCard meal={mealOfTheDay} />
                </div>
              )}
            </div>
            <div className="search-how-to">
              <h2>Find the recipes you need!</h2>
              <p>
                Welcome to our recipe search! Start your culinary adventure by
                entering your search query in the box above. Need inspiration?
                Click "Discover a Meal!" for a delicious suggestion!
              </p>
              <h3>Search Tips:</h3>
              <ul>
                <li>
                  Try searching by ingredients, dish names, or cuisine types.
                </li>
                <li>
                  Search up some of those leftover ingredients you have in your
                  fridge!
                </li>
                <li>
                  Scroll through the results and click on a recipe card to view
                  details.
                </li>
              </ul>
            </div>
          </div>
        )}
      </Row>
      <Row>
        <Container id="search-results-container" className="col-8">
          {results}
        </Container>
      </Row>
    </Container>
  );
};

export default Search;
