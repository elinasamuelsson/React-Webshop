import {useState, useEffect, useContext} from "react";
import {ToastContext} from "../context/ToastContext";
import moduleMaker from "../modules/moduleMaker";
import Form from "../components/Form";

import "./Admin.css";

function Admin() {
	let [report, setReport] = useState([]);
	let [formKey, setFormKey] = useState(0);

  // Kampanj typ
  const [selectedType, setSelectedType] = useState("");
  const [campaignFormKey, setCampaignFormKey] = useState(100);

	const {dispatch} = useContext(ToastContext);

	useEffect(() => {
		moduleMaker.InventoryModule.run().then(setReport);
	}, []);

	function createMovementTableData(item) {
		if (item.movements.length === 0) return "";

		return (
			<ul>
				{item.movements.map((m) => (
					<li key={m.id}>
						{m.timestamp} | {m.quantity} | {m.type}
					</li>
				))}
			</ul>
		);
	}

	function createWarningTableData(item) {
		const {fastMovementWarning, lowStockWarning} = item.warnings;

		if (!fastMovementWarning && !lowStockWarning) {
			return "";
		}

		return (
			<ul>
				{fastMovementWarning && <li>Ovanligt snabb försäljningshastighet!</li>}
				{lowStockWarning && <li>Lågt lagervärde!</li>}
			</ul>
		);
	}

	const formDescriptor = {
		stockItemId: {
			label: "Artikelnummer",
			type: "text",
			initialValue: "",
			required: true,
		},
		type: {
			label: "Händelsetyp",
			type: "text",
			initialValue: "",
			required: true,
		},
		quantity: {
			label: "Kvantitet",
			type: "text",
			initialValue: "",
			required: true,
		},
	};

	async function handleMovementSubmit(formData) {
		try {
			const {response, result} = await moduleMaker.InventoryModule.postMovement(formData);

			if (response && response.ok) {
				console.log(result);
				dispatch({type: "SHOW", payload: "Movement has been posted."});
				setFormKey((prev) => prev + 1);
				moduleMaker.InventoryModule.run().then(setReport);
			}
		} catch (e) {
			dispatch({type: "SHOW", payload: e.message});
		}
	}

  // Kampanj from descriptor och logik
  const campaignFormDescriptor = {
    code: {
      label: "Rabattkod", 
      type: "text", 
      initialValue: "", 
      required: true, 
    }, 
    ...(selectedType === "percentage" && {
      value: {
        label: "Procentsats (%)", 
        type: "number", 
        initialValue: "", 
        required: true, 
      }, 
    }), 
    ...(selectedType === "threshold" && {
      minAmount: {
        label: "Lägsta köpbelopp (kr)", 
        type: "number", 
        initialValue: "", 
        required: true, 
      }, 
      discountAmount: {
        label: "Rabatt (kr)", 
        type: "number", 
        initialValue: "", 
        required: true, 
      }
    }), 
    ...(selectedType === "buyXgetY" && {
      buyCount: {
        label: "Minsta antal produkter (X)", 
        type: "number", 
        initialValue: "", 
        required: true, 
      }, 
      payCount: {
        label: "Antal du betalar för (Y)", 
        type: "number", 
        initialValue: "", 
        required: true, 
      }, 
    }), 
  };

  async function handleCampaignSubmit(formData) {
    if (!selectedType) {
      dispatch({ type: "SHOW", payload: "Välj en kampanjtyp först." });
      return;
    }

    try {
      const payload = {
        // Formaterar sträng nummer till nummer
        code: formData.code?.trim(), 
        type: selectedType, 
        ...(formData.value && { value: Number(formData.value) }), 
        ...(formData.discountAmount && { discountAmount: Number(formData.discountAmount) }),
        ...(formData.minAmount && { minAmount: Number(formData.minAmount) }),
        ...(formData.buyCount && { buyCount: Number(formData.buyCount) }),
        ...(formData.payCount && { payCount: Number(formData.payCount) }),
      }

      const response = await fetch(`/api/campaigns`, {
        method: "POST", 
        body: JSON.stringify(payload), 
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        }, 
      }); 

      if (!response.ok) {
        throw new Error("Couldn't create campaign code.");
      }

      dispatch( { type: "SHOW", payload: `Kampanjkod '${payload.code}' har skapats!`}); 
      setSelectedType(""); 
      setCampaignFormKey((prev) => prev + 1); 
    } catch(error) {
      dispatch( {type: "SHOW", payload: error.message });
    }
  }

	return (
		<main>
			<h1>Admin</h1>
			<table className="inventoryTable">
				<thead>
					<tr>
						<td>Artikelnummer | Varunamn</td>
						<td>Lagervärde</td>
						<td>Senaste rörelser</td>
						<td>Varningar</td>
					</tr>
				</thead>
				<tbody>
					{report.map((item) => {
						const hasWarning = item.warnings.fastMovementWarning || item.warnings.lowStockWarning;
						return (
							<tr key={item.itemId} className={hasWarning ? "warningRow" : ""}>
								<td>
									{item.itemId} | {item.itemName}
								</td>
								<td>{item.balance}</td>
								<td>{createMovementTableData(item)}</td>
								<td>{createWarningTableData(item)}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<Form key={formKey} descriptor={formDescriptor} onSubmit={handleMovementSubmit} />

      {/* KAMPANJ SKAPANDE SEKTION */}
      <section>
        <h2>Skapa Kampanjkod</h2>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Välj kampanjtyp:
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">-- Välj kampanjtyp --</option>
              <option value="percentage">Procentrabatt</option>
              <option value="threshold">Tröskelrabatt</option>
              <option value="buyXgetY">Mängdrabatt (Köp X betala för Y)</option>
            </select>
          </div>

          {selectedType && (
            <Form key={campaignFormKey} descriptor={campaignFormDescriptor} onSubmit={handleCampaignSubmit} />
          )}
      </section>
		</main>
	);
}

export default Admin;
