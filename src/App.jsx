import { useState, useEffect} from 'react'
import './App.css'

function calculatePlatesKG(weight) {
  const barWeight = 20;
  if (weight < barWeight) {
    weight = barWeight;
  }
  const plates = [
    { weight: 25, color: 'red', height: '9.81em'},
    { weight: 20, color: 'blue', height: '9.81em'},
    { weight: 15, color: 'yellow', height: '8.72em'},
    { weight: 10, color: 'green', height: '7.085em'},
    { weight: 5, color: 'white', height: '4.97em'},
    { weight: 2.5, color: 'black', height: '4.142em'},
    { weight: 1.25, color: 'silver', height: '3.488em'}
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
  if (weight < barWeight) {
    weight = barWeight;
  }
  const plates = [
    { weight: 45, color: '#646cff', height: '9.81em'},
    { weight: 35, color: '#646cff', height: '7.848em'},
    { weight: 25, color: '#646cff', height: '6.11em'},
    { weight: 10, color: '#646cff', height: '4.989em'},
    { weight: 5, color: '#646cff', height: '4.344em'},
    { weight: 2.5, color: '#646cff', height: '3.53em'},
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
  const [plates, setPlates] = useState([{weight: 45, color: '#646cff', height: '9.81em'}])

  useEffect(() => {
    if (unit === 'kg') {
      setPlates(calculatePlatesKG(weight));
    } else {
      setPlates(calculatePlatesLB(weight));
    }
  }, [weight, unit]);

  const getTextColor = (backgroundColor) => {
    return backgroundColor === 'white' || backgroundColor === 'yellow' 
      || backgroundColor === 'silver' ? 'black' : 'white';
  };

  const getTotalWeight = (plates, unit) => {
    let total = 0;
    if (unit === 'kg') {
      total = 20;
    } else {
      total = 45;
    }
    for (const plate of plates) {
      total += plate.weight * 2;
    }
    return total;
  }

  const convertUnit = (weight, unit) => {
    if (unit === 'kg') {
      return weight * 2.20462;
    } else {
      return weight / 2.20462;
    }
  }

  const getPlateCount = (plateStack, unit) => {
    const plateCount = {};
    let output = "";

    plateStack.forEach(plate => {
      if (plateCount[plate.weight]) {
        plateCount[plate.weight]+=2;
      } else {
        plateCount[plate.weight] = 2;
      }
    });

    const sortedEntries = Object.entries(plateCount).sort((a, b) => b[0] - a[0]);

    sortedEntries.forEach(([key, value], index) => {
      if (index === sortedEntries.length - 1) {
        output += `${value} x ${key} ${unit}`;
      } else {
        output += `${value} x ${key} ${unit}, `;
      }
    });
    return output;
  }

  return (
    <>
      <div className="calculatedWeight">{getTotalWeight(plates, unit)} {unit} =  {convertUnit(
        getTotalWeight(plates, unit), unit).toFixed(2)} {unit === 'kg' ? 'lb' : 'kg'}
        <p>{getPlateCount(plates, unit)}</p>
      </div>

      <div className="barbell">
        <div className="leftPlates">
          {plates.map((plate, index) => (
            <div key={index} className = "plate-left" style={{ backgroundColor: plate.color, color: getTextColor(plate.color), height: plate.height}}> 
              <div className = 'weightLabel'>{plate.weight} </div>
              </div>
          )).reverse()}
        </div>
        <div className="rightPlates">
          {plates.map((plate, index) => (
            <div key={index} className = "plate-right" style={{ backgroundColor: plate.color, color: getTextColor(plate.color), height: plate.height}}> 
            <div className = 'weightLabel'>{plate.weight} </div>
            </div>
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