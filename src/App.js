import './App.css';
import { useState } from 'react'

function App() {

  const [restaurantSearchText, setRestaurantSearchText] = useState("") ;
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  console.log(restaurantSearchText)
  console.log(error)

  const apiKey = 'AIzaSyAK9CEKSZvK2Aw2fyVlyx-Z42QTgOzqoCM'

  const handleRestaurantSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants%in%${restaurantSearchText}%new%york&key=${apiKey}`);
      if(!response.ok) {
        throw new Error(`Error!  Status: ${response.status}`);
      }

      const data = await response.json();
      const results = data.results;
      console.log(data)
      console.log(results)
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
  }




  return (
    <div className="main-container">
      <p className="welcome-text">Enter in a restaurant here</p>
      <form onSubmit={handleRestaurantSubmit} className="neighborhood-searchbar">
        <input
          type="text"
          value={restaurantSearchText}
          onChange={(event) => setRestaurantSearchText(event.target.value)}
          placeholder="Enter A Neighborhood to Search..."
        />
        <button>Find a Restaurant!</button>
      </form>
    </div>
  );
}

export default App;
