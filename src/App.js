import './App.css';
import { useState, useEffect } from 'react'


function App() {

  const [restaurantSearchText, setRestaurantSearchText] = useState("") ;
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const [nextPageToken, setNextPageToken] = useState("");
  const [numberOfRenders, setNumberOfRenders] = useState(0);
  const [singleRestaurant, setSingleRestaurant] = useState()
  const [singleRestaurantAddress, setSingleRestaurantAddress] = useState("")

  const handleRestaurantSubmit = async (event) => {
    event.preventDefault()
    setRestaurants([])
    setError("")
    setNextPageToken("") 
    setNumberOfRenders(0)
    setSingleRestaurantAddress("")
    try {
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
      const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)]
      setSingleRestaurant(randomRestaurant)
      setMapAddress()
      // console.log(randomRestaurant.formatted_address)
      // try {
      //   console.log(singleRestaurant.formatted_address)
      //   const response = await fetch (`http://localhost:3001/maps?center=${encodeURIComponent(singleRestaurant.formatted_address)}`);
      //   if (!response.ok) {
      //     throw new Error(`Error.  Status: ${response.status}`);
      //   }
      //   console.log(singleRestaurant)
      //   const data = await response.json();
      //   const results = data.results;
      // }
      // catch (error) {
      //   setError(`Error: ${error.message}`);
      // }
    }
    else {
      try {
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
  };

  const setMapAddress = async () => {
    try {
      console.log(singleRestaurant.formatted_address)
      const response = await fetch (`http://localhost:3001/maps?center=${encodeURIComponent(singleRestaurant.formatted_address)}`);
      if (!response.ok) {
        throw new Error(`Error.  Status: ${response.status}`);
      }
      console.log(singleRestaurant)
      const data = await response.json();
      const results = data.results;
    }
    catch (error) {
      setError(`Error: ${error.message}`);
    }
  }

  

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
        {singleRestaurant? (
          <div>
            <br></br>
            <br></br>
            Name: {singleRestaurant.name}
            <br></br>
            <br></br>
            Address: {singleRestaurant.formatted_address}
            <br></br>
            <br></br>
            Rating: {singleRestaurant.rating}
            <br></br>
            <br></br>
            Asdress I am trying to console.log: {singleRestaurant.formatted_address}
          </div>
          ): (
           "")
        }
      </div>
      <div>
        <br></br>
        <br></br>
        {singleRestaurantAddress ? (
          <div>
            "True, dummy"
          </div>
        ) : (
          <div>
            "False, dummy"
          </div>
        )
        }
      </div>
    </div>
  );
}

export default App;
