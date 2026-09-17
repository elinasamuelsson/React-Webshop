# Valuta & moms modulen

## Syfte
Modulen konverterar priser mellan olika valutor (`SEK, EUR, USD`) med växelkurser som hämtas från `/api/rates` och beräknar moms per varukategori (25 % standard, 12 % livsmedel, 6 % böcker).

## Klassernas roller och relationer
Modulen består av fyra klasser där `index.js` är den enda publika ingången.

`Money` är ett immutabelt värdeobjekt som representerar ett belopp i en specifik valuta. Beloppet lagras internt i minsta enhet (ören) som heltal för att undvika flyttalsavrundningsfel. Metoderna `add()`, `addTax()` och `convert()` returnerar alltid nya instanser. `add()` kastar ett fel om man försöker kombinera olika valutor vilket förhindrar att belopp blandas av misstag.

`TaxTable` är en regeltabell som slår upp momssats per kategori, med stöd för anpassade satser via konstruktorn.

`ExchangeRateClient` hämtar växelkurser via `fetch` och cachar resultatet så att inte varje prisberäkning kräver ett nytt nätverksanrop. Cachen gör att klassen måste vara en instans.

`PriceConverter` är modulens default-exporterade huvudklass och binder ihop de tre andra genom komposition: den skapar egna instanser av `TaxTable` och `ExchangeRateClient` i sin konstruktor och anropar deras metoder inifrån `run(values, context)` som är modulkontraktets ingångspunkt. Den håller en egen historik (`#history`) över tidigare beräkningar under sin livstid.

## Designval: Arv vs Komposition
Komposition används mellan de fyra klasserna. `Money`, `TaxTable` och `ExchangeRateClient` representerar tre olika ansvarsområden (värde, regeltabell, nätverksklient) utan gemensamt beteende där `PriceConverter` har varsin instans av de andra två.