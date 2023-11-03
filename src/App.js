import './App.css';
import { useState } from 'react'


function App() {

  const [restaurantSearchText, setRestaurantSearchText] = useState("") ;
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  console.log(restaurants)
  console.log(error)

  const handleRestaurantSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`http://localhost:3001/places?query=${restaurantSearchText}`);
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
        {restaurants.map((r) => 
          <p key={r.name}>{r.name}</p>
        )}
      </div>
    </div>
  );
}

export default App;
