# UPPG 3. LAGERMODUL

## SYFTE

## KLASSERNAS ROLLER OCH RELATIONER

## DESIGNVAL

### DATABASEN

I databasen ligger två tabeller kallade stockItems och stockMovements.

stockItems id är en foreign key som refererar till varje enskild produkt i productstabellen, och reorderPoint är lägsta antalet varor som får finnas innan en varning ska skickas till adminpanelen som påminner att göra en inleverans. stockItems är en separat tabell för att inte productstabellen ska bli överfylld med egenskaper som inte är relevanta i alla applikationens delar.

I tabellen stockMovements spåras rörelserna för varje individuellt stockItem. id är rörelsens egna id, och stockItemId refererar till det stockItem rörelsen gäller. type specifierar om det är en inleverans eller en försäljning. quantity är antalet varor som går in eller ut, och tidsstämpeln specifierar när rörelsen hänt så att varning kan skickas till adminpanelen att göra inleverans vid ovanligt snabb försäljning av en vara.

Till en början var tanken att man i en routes.json-fil skulle ändra endpoint:en till att vara /inventory/stockItems och /inventory/stockMovements. Det visade sig dock att jag i research missat att man på v1.0 av json-server, vilket är den vi använder i projektet, inte kan använda routes.json. Istället har jag valt att som mindre optimal lösning ge databasservern en proxy i vite.config.js. I koden kan jag då referera till databasen som /api/inventory/stock\_\_\_ för att i bästa förmåga följa uppgiftsbeskrivningen.
