import './App.css';
import { useState, useEffect } from 'react'


function App() {

  const [restaurantSearchText, setRestaurantSearchText] = useState("") ;
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const [nextPageToken, setNextPageToken] = useState("");
  const [numberOfRenders, setNumberOfRenders] = useState(0);
  const [singleRestaurant, setSingleRestaurant] = useState()
  console.log(restaurants)
  console.log(singleRestaurant)

  const handleRestaurantSubmit = async (event) => {
    event.preventDefault()
    setRestaurants([])
    setError("")
    setNextPageToken("") 
    setNumberOfRenders(0)
    try {
      console.log(`Inital Render`)
      const response = await fetch(`http://localhost:3001/places?query=${restaurantSearchText}`);
      if(!response.ok) {
        throw new Error(`Error.  Status: ${response.status}`);
      }

      const data = await response.json();
      const results = data.results;
      setNextPageToken(data.next_page_token)

      if (results.length > 0) {
        setRestaurants(results);
        setError('');
      }
      else {
        setRestaurants([]);
        setError('No restaurants found here');
      }
    }
    catch (error) {
      setRestaurants([]);
      setError(`Error: ${error.message}`);
    }
    setNumberOfRenders(1)
  }

  const fetchNextPage = async () => {
    if (numberOfRenders > 3) {
      setSingleRestaurant(restaurants[Math.floor(Math.random() * restaurants.length)])
    }
    else {
      try {
        console.log(`Secondary Page Render`)
        if (nextPageToken) {
          const response = await fetch(`http://localhost:3001/places?nextPageToken=${encodeURIComponent(nextPageToken)}`);
          if (!response.ok) {
            throw new Error(`Error.  Status: ${response.status}`);
          }

          const data = await response.json();
          const results = data.results;

          if (results.length > 0) {
            setRestaurants([...restaurants, ...results]);
            setNextPageToken(data.next_page_token);
          }
          else {
            setNextPageToken(undefined);
          }
        }
      }
      catch (error) {
        setError(`Error: ${error.message}`);
      }
    }
    setNumberOfRenders(numberOfRenders + 1);
    // setSingleRestaurant(restaurants[Math.floor(Math.random() * restaurants.length)])
  };

  useEffect(() => {
    if (nextPageToken){
      fetchNextPage();
    }
  }, [nextPageToken]);



  return (
    <div className="main-container">
      <p className="welcome-text">Enter in a New York City Neighborhood Here</p>
      <p>When you click the button, a random restaurant will appear like magic!</p>
      <form onSubmit={handleRestaurantSubmit} className="neighborhood-searchbar">
        <input
          type="text"
          value={restaurantSearchText}
          onChange={(event) => setRestaurantSearchText(event.target.value)}
          placeholder="Enter A Neighborhood to Search..."
        />
        <button>Find a Restaurant!</button>
      </form>
      <div>
        {singleRestaurant? singleRestaurant.name : ""}
      </div>
    </div>
  );
}

export default App;
