# ShippingModule – Fraktberäknare

## Syfte

ShippingModule beräknar fraktofferter för en varukorg utifrån vikt, volym och destination.
Den frågar flera transportörer med olika prismodeller (viktbaserad, zonbaserad och
volymetrisk) och returnerar en sorterad lista med offerter, billigast först. Modulen
är gruppens lösning på US5 – att kunden ska kunna se fraktkostnad baserat på sin
varukorg och destination.

## Klassernas roller och relationer

Modulen består av fyra klasser, uppdelade genom **komposition**:

- **`ShippingModule`** (`index.js`) är modulens publika ingång och kontraktslager.
  Den exponerar `run(values, context)` enligt gruppens modulkontrakt, och håller
  ett kort cache-minne mellan anrop. Den delegerar själva beräkningsarbetet till
  `ShippingQuoteService`.
- **`ShippingQuoteService`** hämtar transportörsdata asynkront från `/api/carriers`
  och `/api/productDimensions`, skapar ett `Parcel`-objekt och ett `Carrier`-objekt
  per transportör, beräknar en offert från var och en, och returnerar den sorterade
  listan. Den hanterar även fel per transportör – om en transportör misslyckas
  hoppas den över istället för att hela processen kraschar.
- **`Parcel`** representerar varukorgens fysiska egenskaper: total vikt, volym och
  den beräknade volymetriska vikten. Den vet ingenting om pris eller transportörer.
- **`Carrier`** representerar en enskild transportör och känner till sin egen
  prismodell (viktbaserad, zonbaserad eller volymetrisk). Den tar emot ett
  `Parcel`-objekt och ett postnummer, och räknar ut sitt eget pris.

## Designval: komposition, inte arv

Klasserna är fristående och samverkar genom att skicka data till varandra (`Parcel`
skickas in i `Carrier.calculatePrice(parcel, postalCode)`), snarare än att ärva
gemensam kod. Detta valdes eftersom `Parcel` och `Carrier` representerar helt olika
begrepp (ett paket respektive en transportör) utan en naturlig "är-en"-relation
mellan dem – arv hade tvingat fram en konstlad hierarki. Komposition gör det också
enkelt att testa varje klass isolerat, och att lägga till fler transportörer eller
paketegenskaper utan att röra befintlig kod.

## Motiverat skäl att vara en instans

`ShippingModule` bär ett kort cache-minne (`cache`, `cacheTimestamp`) mellan anrop.
Om samma varukorg och postnummer efterfrågas igen inom 30 sekunder, returneras det
sparade resultatet istället för att göra nya nätverksanrop till `/api/carriers`.
Detta motsvarar t.ex. att kunden råkar ladda om checkout-sidan utan att något i
varukorgen ändrats.

## Felhantering

Om `postalCode` saknas i `values` kastas ett tydligt fel innan något API-anrop görs.
Om en enskild transportör misslyckas att leverera en offert, exkluderas den ur
resultatet utan att stoppa övriga. Om ingen transportör alls svarar, returneras en
tom lista, vilket UI-lagret använder för att visa ett felmeddelande till kunden.

## Kända avgränsningar

- Postnummerzoner baseras på en förenklad regel (första siffran i postnumret),
  inte en fullständig geografisk zonkarta.
- Produktdimensioner är satta som ett gemensamt standardvärde för alla produkter
  i `db.json`, eftersom sortimentet (VHS-kassetter) är fysiskt homogent.