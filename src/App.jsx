import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="barbell">
        <div className="plate-left"></div>
        <div className="plate-right"></div>
      </div>
      
      <h1>powerwictor</h1>
      <div className="entry">
        <input type="number" value={count} onChange={(e) => setCount(parseInt(e.target.value))} />
      </div>
      <div id="selection">
        <div className="unit">
          <button><h2>kg</h2></button>
          <button><h2>lb</h2></button>
        </div>
        <div className="selected"></div>
      </div>
      
      
    </>
  )
}

export default App