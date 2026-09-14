# UPPG 3. LAGERMODUL

## SYFTE

Modulens syfte är att förse adminpanelen med data som kan sorteras i en tabell för enkel översikt över webshoppens lagersaldo, med varningar där saldot är lågt eller sjunker ovanligt fort.

Vid köp av en vara sjunker lagersaldot för berörda varor, och man kan via ett formulär i adminpanelen göra inleveranser och justeringar. Modulen tar in resultatet och sänder det till stockMovements-tabellen i databasen.

## KLASSERNAS ROLLER OCH RELATIONER

stockItems kan ha stockMovements, kopplade tillsammans med id:t i stockItem och stockItemId i stockMovement.

Modulens administration sköts genom inventoryService som är ett logiklager som arbetar som en relay mellan databasen och applikationen.

stockItems och stockMovements agerar som en ram för hur in- och utdata som hanteras av inventoryService. Vardera klass sköter validering av sina fält, och ser till att all in- och utdata har ett enhetligt utseende.

index.js är ingången modulen utifrån, och kallar på inventoryService för att utföra de händelser som specifieras.

## DESIGNVAL

### DATABASEN

I databasen ligger två tabeller kallade stockItems och stockMovements.

stockItems id är en foreign key som refererar till varje enskild produkt i productstabellen, och reorderPoint är lägsta antalet varor som får finnas innan en varning ska skickas till adminpanelen som påminner att göra en inleverans. stockItems är en separat tabell för att inte productstabellen ska bli överfylld med egenskaper som inte är relevanta i alla applikationens delar.

I tabellen stockMovements spåras rörelserna för varje individuellt stockItem. id är rörelsens egna id, och stockItemId refererar till det stockItem rörelsen gäller. type specifierar om det är en inleverans eller en försäljning. quantity är antalet varor som går in eller ut, och tidsstämpeln specifierar när rörelsen hänt så att varning kan skickas till adminpanelen att göra inleverans vid ovanligt snabb försäljning av en vara.

Till en början var tanken att man i en routes.json-fil skulle ändra endpoint:en till att vara /inventory/stockItems och /inventory/stockMovements. Det visade sig dock att jag i research missat att man på v1.0 av json-server, vilket är den vi använder i projektet, inte kan använda routes.json.
Istället har jag valt att som mindre optimal lösning ge databasservern en proxy i vite.config.js. I koden kan jag då referera till databasen som /api/inventory/stock\_\_\_ för att i bästa förmåga följa uppgiftsbeskrivningen.

### stockItem och stockMovement

Klasserna stockItem och stockMovement representerar båda en post i databastabellen med samma namn. Att göra varje post i tabellerna till antingen ett stockItem eller stockMovement innebär att man enklare kan sätta regler för hur varje post får se ut. Valideringen blir på så vis enklare.

I stockMovement används två statiska metoder för att kalla på constructor:n, eftersom objektet kan skapas på två olika sätt; som ny händelse eller som existerande händelse hämtad från databasen. Beroende på skapandesätt krävs olika vägar att hantera objektets id. Egentligen hade en metod räckt för nyskapande, och databashämtningen hade kunnat kalla på constructor:n men för tydlighetens skull används istället två olika metoder för olika syften.

### inventoryService

Det är i inventoryService som själva logiken sker, från insamling till urval av data, och uppbyggnad av den rapport som sedan lämnar modulen. Även intag av data och POST till databasen sker i inventoryService.

Den största delen av databearbetningen sker med hjälp av arrowfunktioner och arraymetoder.

- .map() används vid flera tillfällen för att förändra den ursprungliga datan till något nytt; i fetch-metoderna för att lägga om det ursprungliga json-svaret från databasen till stockobjekt, och i returnDataReport för att sålla ut och slå ihop data från de två tabellerna till en array av objekt med relevant data.
- .filter() används i samband med den sistnämnda .map()-metoden för att samla alla movements för ett item i samma objekt genom att jämföra id:n.
- .reduce() används för att slå ihop rörelsernas kvantiteter in och ut för att nå ett lagervärde.
- .sort() sorterar lagerrörelserna per datum och lägger den senaste händelsen i listan längst fram.
