const fs = require("fs");


module.exports = function parseCSV(csv, path) {
  const rows = csv.trim().split("\n");
  const rawData = rows.map((d) => d.split(","));

  const headers = rawData[0];
  const data = rawData.slice(1);

  const parsedData = data.map((row) => {
    const authServerData = {};
    headers.forEach((h, i) => {
      let trimmed = h.trim();
      //   console.log(trimmed)

      let camelize = trimmed
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, ""); // cammelcase
      

      authServerData[camelize] = row[i].trim(); /// se adauga la fiecare header continutul.
    });
    
    return authServerData; // returneaza obiectul sub forma de json
  });

  fs.unlink(path, () => {}); // remove la file dupa

  return parsedData;
};
