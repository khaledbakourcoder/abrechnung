import { useState } from 'react'
import './App.css'
import { CiCalculator2 } from "react-icons/ci";
import { GiFuelTank } from "react-icons/gi";
function App() {
  const [inputs, setInputs] = useState({
    kleingeld: '',
    euro5: '',
    euro10: '',
    euro20: '',
    euro50: '',
    euro100: '',
  });
  const [outputs,setOutputs]= useState({
    kleingeld: '',
    euro5: '',
    euro10: '',
    euro20: '',
    euro50: '',
    euro100: ''
  });

  const [result, setResult] = useState(null);

  const values = {
    kleingeld: 1,
    euro5: 5,
    euro10: 10,
    euro20: 20,
    euro50: 50,
    euro100: 100,
  };

  const images = {
    kleingeld: '/kleingeld.svg',
    euro5: '/5euro.svg',
    euro10: '/10euro.svg',
    euro20: '/20euro.svg',
    euro50: '/50euro.svg',
    euro100: '/100euro.svg',
  };

  const handleInputChange = (field, val) => {
    setInputs({ ...inputs, [field]: val });
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    const counts = {
      kleingeld: parseFloat(inputs.kleingeld) || 0,
      euro5: parseInt(inputs.euro5, 10) || 0,
      euro10: parseInt(inputs.euro10, 10) || 0,
      euro20: parseInt(inputs.euro20, 10) || 0,
      euro50: parseInt(inputs.euro50, 10) || 0,
      euro100: parseInt(inputs.euro100, 10) || 0,
    };

    const totalInCassa =
        counts.kleingeld +
        (counts.euro5 * values.euro5) +
        (counts.euro10 * values.euro10) +
        (counts.euro20 * values.euro20) +
        (counts.euro50 * values.euro50) +
        (counts.euro100 * values.euro100);

    const targetStock = 500;
    const amountToRemove = totalInCassa - targetStock;

    let runningTotal = amountToRemove;
    const breakdown = [];

    if (amountToRemove > 0) {
      const denominations = [
        { key: 'euro100', val: 100, name: '100 €', img: images.euro100, isCoin: false },
        { key: 'euro50', val: 50, name: '50 €', img: images.euro50, isCoin: false },
        { key: 'euro20', val: 20, name: '20 €', img: images.euro20, isCoin: false },
        { key: 'euro10', val: 10, name: '10 €', img: images.euro10, isCoin: false },
        { key: 'euro5', val: 5, name: '5 €', img: images.euro5, isCoin: false },
      ];

      denominations.forEach(denom => {
        const availableBills = counts[denom.key];
        const neededBills = Math.floor(runningTotal / denom.val);
        const billsToTake = Math.min(neededBills, availableBills);

        if (billsToTake > 0) {
          breakdown.push({ name: denom.name, count: `${billsToTake}x`, img: denom.img, isCoin: false });
          runningTotal -= billsToTake * denom.val;
        }
      });

      if (runningTotal > 0 && counts.kleingeld > 0) {
        const kleingeldToTake = Math.min(runningTotal, counts.kleingeld);
        breakdown.push({ name: 'Kleingeld', count: `${kleingeldToTake.toFixed(2)} €`, img: images.kleingeld, isCoin: true });
        runningTotal -= kleingeldToTake;
      }
    }

    setResult({
      totalInCassa,
      amountToRemove,
      breakdown,
      remainingToRemove: runningTotal
    });
  };

  return (
      <div className="app-container">
        <div className="billing-card">

          {/* HEADER */}
          <div className="header-section">
            <h2 className="header-title"><GiFuelTank className={"tank--icon"}/> Kassen-Abrechnung</h2>
            <div className="target-badge">
              Soll-Bestand: <strong className="target-amount">500,00 €</strong>
            </div>
          </div>

          {/* INPUT FORM */}
          <form onSubmit={handleCalculate} className="billing-form">

            <div className="input-row row-kleingeld">
              <img src={images.kleingeld} alt="Kleingeld" className="coin-img" />
              <input type="number" step="0.01" min="0" value={inputs.kleingeld} placeholder="0.00" onChange={(e) => handleInputChange('kleingeld', e.target.value)} className="currency-input" />
            </div>

            <div className="input-row row-5euro">
              <img src={images.euro5} alt="5 Euro" className="bill-img" />
              <input type="number" min="0" value={inputs.euro5} placeholder="0" onChange={(e) => handleInputChange('euro5', e.target.value)} className="currency-input" />
            </div>

            <div className="input-row row-10euro">
              <img src={images.euro10} alt="10 Euro" className="bill-img" />
              <input type="number" min="0" value={inputs.euro10} placeholder="0" onChange={(e) => handleInputChange('euro10', e.target.value)} className="currency-input" />
            </div>

            <div className="input-row row-20euro">
              <img src={images.euro20} alt="20 Euro" className="bill-img" />
              <input type="number" min="0" value={inputs.euro20} placeholder="0" onChange={(e) => handleInputChange('euro20', e.target.value)} className="currency-input" />
            </div>

            <div className="input-row row-50euro">
              <img src={images.euro50} alt="50 Euro" className="bill-img" />
              <input type="number" min="0" value={inputs.euro50} placeholder="0" onChange={(e) => handleInputChange('euro50', e.target.value)} className="currency-input" />
            </div>

            <div className="input-row row-100euro">
              <img src={images.euro100} alt="100 Euro" className="bill-img" />
              <input type="number" min="0" value={inputs.euro100} placeholder="0" onChange={(e) => handleInputChange('euro100', e.target.value)} className="currency-input" />
            </div>

            <button type="submit" className="submit-btn">
              Abrechnung erstellen <CiCalculator2 className={"calc--icon"}/>
            </button>
          </form>

          {/* RESULTS SECTION */}
          {result && (
              <div className="results-box">
                <div className="result-row">
                  <span style={{ color: '#94a3b8' }}>Gezählter Kasseninhalt:</span>
                  <span style={{ fontWeight: '600', color: '#fff' }}>{result.totalInCassa.toFixed(2)} €</span>
                </div>

                {result.amountToRemove > 0 ? (
                    <>
                      <div className="withdraw-total-box">
                        <span className="withdraw-title">Entnahmegesamt:</span>
                        <span className="withdraw-amount">{result.amountToRemove.toFixed(2)} €</span>
                      </div>

                      <h4 className="instruction-title">👉 Das musst du rausnehmen:</h4>
                      <ul className="instruction-list">
                        {result.breakdown.map((item, index) => (
                            <li key={index} className="instruction-item">
                              <div className="left-group">
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className={item.isCoin ? "result-coin-img" : "result-bill-img"}
                                />
                              </div>
                              <span className="item-count">Nimm {item.count} raus</span>
                            </li>
                        ))}
                      </ul>
                    </>
                ) : result.amountToRemove === 0 ? (
                    <div className="status-perfect">
                      Punktlandung! Genau 500,00 € in der Kasse.
                    </div>
                ) : (
                    <div className="status-minus">
                      Kassenminus! Es fehlen {(500 - result.totalInCassa).toFixed(2)} € zu den 500 € Grundbestand.
                    </div>
                )}
              </div>
          )}

        </div>
      </div>
  )
}

export default App