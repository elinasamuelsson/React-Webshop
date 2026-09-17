# Domänmodul: Kampanj- och Rabattmotor

## Syfte
Syftet med `CampaignEngineModule` är att validera kampanjkoder samt beräkna och applicera rabatter på en varukorg. Modulen har stöd för tre olika kampanjtyper: **procentrabatt**, **tröskelrabatt** och **mängdrabatt** ("köp X, betala för Y").

---

## Modulens Arkitektur & Klasser

### 1. `CampaignEngineModule` (Fasad / Huvudmodul)
Klassen fungerar som modulens gränssnitt utåt (Fasad-mönster) och samordnar hämtning av kampanjdata, validering och priskalkylering.

* **`fetchCampaigns()`**: Hämtar tillgängliga kampanjer asynkront från `/api/campaigns`. För att undvika onödiga nätverksanrop lagras resultatet i minnet (`campaignCache`) med en giltighetstid (TTL) på 5 minuter.
* **`run(inputs, context)`**: Huvudmetod som tar emot kampanjkod och varukorgsdata. Metoden validerar indata, hämtar regler och returnerar en prisspecifikation.

**Valideringar:**
* Kontrollerar att användaren har angivit en kampanjkod och att den inte består av enbart tomma tecken (whitespaces).
* Verifierar asynkront att den angivna koden existerar i databasen.

**Inbyggda JavaScript-metoder som används:**
* `trim()` – Tar bort tomrum i början och slutet av kampanjkoden (t.ex. `" SOMMAR20 "` blir `"SOMMAR20"`).
* `find()` – Söker upp det specifika kampanjobjektet i den hämtade listan baserat på koden.

---

### 2. `PriceCalculator`
Klassens ansvar är att beräkna varukorgens ordinarie totalpris samt applicera kampanjregler för att generera det slutgiltiga priset och rabattsumman.

* Räknar ut ordinarie totalpris utifrån artiklarna i varukorgen.
* Skickar totalpriset och varukorgens innehåll vidare till `CampaignRule` för rabattberäkning.

---

### 3. `CampaignRule`
Representerar en enskild kampanjregel och innehåller beräkningslogiken för de tre kampanjtyperna:

#### A. Procentrabatt (`percentage`)
Beräknar rabatten som en procentsats av det totala ordinarie priset.
* **Formel:** `Rabatt = (Procent / 100) * Ordinarie Pris`
* **Exempel:** Vid 20% rabatt på 49 kr beräknas rabatten till `(20 / 100) * 49 = 9.8 kr`. Slutpriset blir `49 - 9.8 = 39.2 kr` (avrundas till 39 kr).

#### B. Tröskelrabatt (`threshold`)
Ge en fast rabattsumma om kundens köp överstiger ett visst minimibelopp.
* **Validering:** Verifierar att varukorgens ordinarie totalpris uppnår tröskelvärdet (`minAmount`).
* **Exempel:** Handla för minst 500 kr och få 100 kr rabatt (Totalt: 500 - 100 = 400 kr).

#### C. Mängdrabatt / Köp X betala för Y (`buyXgetY`)
Identifierar och ger rabatt motsvarande priset på de billigaste artiklarna i varukorgen.
* **Validering:** Verifierar att varukorgen innehåller **minst** X antal produkter (`buyCount`).
* **Logik:** Sorterar alla artiklars enskilda priser och drar av priset för de billigaste produkterna som motsvarar antalet gratisartiklar (`buyCount - payCount`).

**Inbyggda JavaScript-metoder som används:**
* `flatMap()` - Den här metoden är kombination av `flat()` & `map()` funktioner. Istället att använda var funktion för sig så är det mer effektivt att använda `flatMap()`.

---

## Designval: Arv vs. Komposition

* **Komposition har valts:** Modulen använder komposition eftersom `CampaignEngineModule`, `PriceCalculator` och `CampaignRule` har helt skilda ansvarsområden (Separation of Concerns).
* **Möjlighet till framtida arv:** Om kampanjreglerna växer i komplexitet kan `CampaignRule` med fördel refaktoreras till en bas-klass, där specifika klasser (`PercentageRule`, `ThresholdRule`, `BuyXGetYRule`) ärver från bas-klassen (Polymorfism).

---

## Databasstruktur (`db.json`)

Tabellen `campaigns` innehåller alla tillgängliga kampanjer med följande attribut:

* `code` *(String)*: Unik kampanjkod (t.ex. `"SOMMAR20"`).
* `type` *(String)*: Kampanjtyp (`"percentage"`, `"threshold"`, eller `"buyXgetY"`).

### Typ-specifika attribut:
* **Procentrabatt:**
  * `value` *(Number)*: Procentsats som ska dras av (t.ex. `20`).
* **Tröskelrabatt:**
  * `minAmount` *(Number)*: Lägsta belopp som krävs i varukorgen (t.ex. `500`).
  * `value` / `discountAmount` *(Number)*: Rabbattsumma i kronor (t.ex. `100`).
* **Mängdrabatt:**
  * `buyCount` *(Number)*: Antal produkter som krävs i varukorgen (t.ex. `3`).
  * `payCount` *(Number)*: Antal produkter kunden betalar för (t.ex. `2`).