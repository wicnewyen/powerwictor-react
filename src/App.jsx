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

function calculatePlates(weight, unit) {
  return unit === 'kg' ? calculatePlatesKG(weight) : calculatePlatesLB(weight);
}

const warmupSettings = {
  lb: { bar: 45, jump: 90, increment: 5, minStep: 30 },
  kg: { bar: 20, jump: 50, increment: 2.5, minStep: 15 },
};

// Add a big plate (45 lb / 25 kg) to each side until close to the top set,
// then close the gap to the last warmup in even steps.
function calculateWarmups(target, unit, reps) {
  const { bar, jump, increment, minStep } = warmupSettings[unit];
  const round = (weight) => Math.round(weight / increment) * increment;

  // last warmup is ~40 lb under the top set for 1-3 reps, ~30 lb for 4+
  const offset = reps === '1-3' ? 40 : 30;
  const lastWarmup = round(target - (unit === 'kg' ? offset / 2.20462 : offset));
  if (lastWarmup <= bar) {
    return target > bar ? [bar] : [];
  }

  // stop adding plates past 85% of the top set or when crowding the last warmup
  const warmups = [];
  let base = bar;
  while (base + jump <= target * 0.85 && base + jump <= lastWarmup - minStep / 2) {
    base += jump;
    warmups.push(base);
  }
  if (warmups.length === 0) {
    warmups.push(bar);
  }

  // each remaining jump is at most 12.5% of the top set
  const maxStep = Math.max(target * 0.125, minStep);
  const steps = Math.ceil((lastWarmup - base) / maxStep);
  for (let i = 1; i <= steps; i++) {
    warmups.push(round(base + (lastWarmup - base) * i / steps));
  }

  return warmups;
}

function App() {
  const [weight, setWeight] = useState(135)
  const [unit, setUnit] = useState('lb')
  const [plates, setPlates] = useState([{weight: 45, color: '#646cff', height: '9.81em'}])
  const [showWarmups, setShowWarmups] = useState(false)
  const [reps, setReps] = useState('1-3')

  useEffect(() => {
    setPlates(calculatePlates(weight, unit));
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
        plateCount[plate.weight]+=1;
      } else {
        plateCount[plate.weight] = 1;
      }
    });

    const sortedEntries = Object.entries(plateCount).sort((a, b) => b[0] - a[0]);

    const suffix = unit ? ` ${unit}` : '';
    sortedEntries.forEach(([key, value], index) => {
      if (index === sortedEntries.length - 1) {
        output += `${value} x ${key}${suffix}`;
      } else {
        output += `${value} x ${key}${suffix}, `;
      }
    });
    return output;
  }

  const target = getTotalWeight(plates, unit);

  return (
    <>
      <div className="calculatedWeight">{getTotalWeight(plates, unit)} {unit} =  {convertUnit(
        getTotalWeight(plates, unit), unit).toFixed(2)} {unit === 'kg' ? 'lb' : 'kg'}
        <p>EACH SIDE: {getPlateCount(plates, unit)}</p>
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

      <div id="warmups">
        <button className={showWarmups ? 'selected' : ''} onClick={() => setShowWarmups(!showWarmups)}>
          <h2>warmups</h2>
        </button>
        {showWarmups && (
          <>
            <div className="unit">
              <button className={reps === '1-3' ? 'selected' : ''} onClick={() => setReps('1-3')}>
                <h2>1-3</h2>
              </button>
              <h3>reps</h3>
              <button className={reps === '4+' ? 'selected' : ''} onClick={() => setReps('4+')}>
                <h2>4+</h2>
              </button>
            </div>
            <ol className="warmupList">
              {[...calculateWarmups(target, unit, reps), target].map((warmup, index, sets) => (
                <li key={index} className={index === sets.length - 1 ? 'topSet' : ''}>
                  <span className="warmupWeight">{warmup} {unit}</span>
                  <span className="warmupPlates">
                    {getPlateCount(calculatePlates(warmup, unit)) || 'empty bar'}
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </>
  )
}

export default App