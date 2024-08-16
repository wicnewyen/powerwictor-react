import { useState, useEffect} from 'react'
import './App.css'

function calculatePlatesKG(weight) {
  const barWeight = 25;
  const plates = [
    { weight: 25, color: 'red' },
    { weight: 20, color: 'blue' },
    { weight: 15, color: 'yellow' },
    { weight: 10, color: 'green' },
    { weight: 5, color: 'white' },
    { weight: 2.5, color: 'black' },
    { weight: 1.25, color: 'silver' }
  ];

  let weightEachSide = (weight - barWeight) / 2;
  const plateStack = [];

  for (let i = 0; i < plates.length; i++) {
    const plate = plates[i];
    const plateCount = Math.floor(weightEachSide / plate.weight);
    weightEachSide -= plateCount * plate.weight;

    for (let j = 0; j < plateCount; j++) {
      plateStack.push(plate);
    }
  }

  return plateStack;
}

function calculatePlatesLB(weight) {

  const barWeight = 45;

  const plates = [
    { weight: 45, color: '#646cff' },
    { weight: 35, color: '#646cff' },
    { weight: 25, color: '#646cff' },
    { weight: 10, color: '#646cff' },
    { weight: 5, color: '#646cff' },
    { weight: 2.5, color: '#646cff' },
  ]

  let weightEachSide = (weight - barWeight) / 2;
  const plateStack = [];

  for (let i = 0; i < plates.length; i++) {
    const plate = plates[i];
    const plateCount = Math.floor(weightEachSide / plate.weight);
    weightEachSide -= plateCount * plate.weight;

    for (let j = 0; j < plateCount; j++) {
      plateStack.push(plate);
    }
  }

  return plateStack;
}

function App() {
  const [weight, setWeight] = useState(135)
  const [unit, setUnit] = useState('lb')
  const [plates, setPlates] = useState([{weight: 45, color: '#646cff'}])

  useEffect(() => {
    if (unit === 'kg') {
      setPlates(calculatePlatesKG(weight));
    } else {
      setPlates(calculatePlatesLB(weight));
    }
  }, [weight, unit]);

  const handleKgChange = (e) => {
    const value = parseFloat(e.target.value);
    setWeight(value);
    setUnit('kg');
  };

  const handleLbChange = (e) => {
    const value = parseFloat(e.target.value);
    setWeight(value);
    setUnit('lb');
  };

  const getTextColor = (backgroundColor) => {
    return backgroundColor === 'white' ? 'black' : 'white';
  };

  return (
    <>
      <div className="barbell">
        <div className="leftPlates">
          {plates.map((plate, index) => (
            <div key={index} className = "plate-left" style={{ backgroundColor: plate.color, color: getTextColor(plate.color)}}> {plate.weight} </div>
          )).reverse()}
        </div>
        <div className="rightPlates">
          {plates.map((plate, index) => (
            <div key={index} className = "plate-right" style={{ backgroundColor: plate.color, color: getTextColor(plate.color)}}> {plate.weight}</div>
          ))}
        </div>
          
      </div>
      
      <h1>powerwictor</h1>
      <div className="entry">
        <input type="number" id="inputWeight" value={weight} onChange={(e) => {
          setWeight(parseFloat(e.target.value))
        }} /> 
        <div className="currentUnit">{unit}</div>

      </div>
      

      <div id="selection">
        <div className="unit">
          <button className={unit === 'kg' ? 'selected' : ''} onClick={() => setUnit('kg')}>
              <h2>kg</h2>
            </button>
            <h3>plates</h3>
            <button className={unit === 'lb' ? 'selected' : ''} onClick={() => setUnit('lb')}>
              <h2>lb</h2>
            </button>
        </div>
        
      </div>

      <div id="selection">
        <div className="unit">
        <button className={unit === 'kg' ? 'selected' : ''} onClick={() => setUnit('kg')}>
              <h2>20 kg</h2>
            </button>
            <h3>bar</h3>
            <button className={unit === 'lb' ? 'selected' : ''} onClick={() => setUnit('lb')}>
              <h2>45 lb</h2>
            </button>
        </div>
        
      </div>
      
      
    </>
  )
}

export default App