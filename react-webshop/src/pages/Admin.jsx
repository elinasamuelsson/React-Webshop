import { useState } from "react";

function Admin() {

  const [isPercent, setIsPercent] = useState(false);
  const [isThreshold, setIsThreshold] = useState(false);
  const [isBundle, setIsBundle] = useState(false);

  const [code, setCode] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [minAmount, setMinAmount] = useState(0);
  const [buyCount, setBuyCount] = useState(0);
  const [payCount, setPayCount] = useState(0);

  function setCampaignType(type) {
    if (type === "percentage") {
      setIsPercent(true);
      setIsBundle(false);
      setIsThreshold(false);
      return;
    }

    if (type === "threshold") {
      setIsThreshold(true);
      setIsPercent(false);
      setIsBundle(false);
      return;
    }

    if (type === "buyXgetY") {
      setIsBundle(true);
      setIsPercent(false);
      setIsThreshold(false);
      return;
    }

    setIsPercent(false);
    setIsBundle(false);
    setIsThreshold(false);
    return;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`/api/campaigns`, {
        method: "POST", 
        body: JSON.stringify({
          code: code, 
          type: type, 
          value: value, 
          discountAmount: discountAmount, 
          minAmount: minAmount, 
          buyCount: buyCount, 
          payCount: payCount
        }), 
        headers: {
          "Content-type": "application/json: charset=UTF-8"
        }
      });

      if (!response.ok) {
        console.log("Something went wrong.");
      }

      const result = await response.json();
      return {response, result};
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div style={{color: "white"}}>
      <h1>Admin</h1>

      <form onSubmit={handleSubmit}>
        <h2>Add Discount Code</h2>
        <label>
          Code: 
          <input type="text" required onChange={(e) => setCode(e.target.value)}/>
        </label>

        <label>
          Type: 
          <select onChange={(e) => {
            setCampaignType(e.target.value);
            setType(e.target.value);
          }} required>
            <option>Select campaign type</option>
            <option value="percentage">Percent</option>
            <option value="threshold">Threshold</option>
            <option value="buyXgetY">Bundle</option>
          </select>
        </label>

        {isPercent && 
          <label>
            Percent: 
            <input onChange={(e) => setValue(e.target.value)} type="number" max={100} min={0} placeholder="20" required/>
          </label>
        }

        {isThreshold && 
          <>
            <label>
              Required Amount: 
              <input onChange={(e) => setMinAmount(e.target.value)} type="number" max={100} min={0} placeholder="500" required/>
            </label>

            <label>
              Discount Amount: 
              <input onChange={(e) => setDiscountAmount(e.target.value)} type="number" max={100} min={0} placeholder="100" required/>
            </label>
          </>
        }

        {isBundle && 
          <>
            <label>
              Minimum product amount: 
              <input onChange={(e) => setBuyCount(e.target.value)} type="number" placeholder="3"/>
            </label>

            <label>
              Pay count: 
              <input onChange={(e) => setPayCount(e.target.value)} type="number" placeholder="2"/>
            </label>
          </>
        }

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Admin;