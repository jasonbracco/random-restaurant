import './App.css';
import { useState } from 'react'

function App() {

  const [inputText, setInputText] = useState("") 
  console.log(inputText)

  function handleInputChange(event) {
    setInputText(event.target.value)
  }

  function handleRestaurantSubmit(event) {
    event.preventDefault();
    console.log(inputText)
    setInputText("")
  }


  return (
    <div className="main-container">
      <p className="welcome-text">Enter in a restaurant here!!</p>
      <form onSubmit={handleRestaurantSubmit} className="neighborhood-searchbar">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter A Neighborhood to Search..."
        />
        <button>Find a Restaurant!</button>
      </form>
    </div>
  );
}

export default App;
