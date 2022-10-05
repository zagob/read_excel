const { join } = require("path");
const fs = require("fs");
const xlsx = require("node-xlsx");

(async () => {
  const directory = join(__dirname, "docs");

  const dcs = fs.readdirSync(directory);

  if (dcs.length === 0) {
    return console.log("Nenhum arquivo encontrado");
  }

  dcs.forEach((item) => {
    const workSheetsFromFile = xlsx.parse(directory + `/${item}`);

    const l = workSheetsFromFile
      .filter((item) => item.name === "Lançamentos")
      .map((item) => item.data)
      .flat(2);

    const test = JSON.stringify(l);

    const patterData =
      /(?<=lançamentos","","","","",")([0-9]{2}\/[0-9]{2}\/[0-9]{4})/gi;
    const patterSal = /(?<=PAGTO SALARIO)","[0-9]{4}",([0-9]{4}.[0-9]{2})/gi;
    const patterAdiantamento =
      /(?<=PAGTO ADIANTAMENTO SALAR)","[0-9]{4}",([0-9]{4}.[0-9]{2})/gi;

    const data = test.match(patterData);
    const adiantamentoSal = test.match(patterAdiantamento)[0].split(",")[2];
    const sal = test?.match(patterSal);

    const valueSal = sal ? sal.toString().split(",")[sal.length + 1] : "null";

    const total = Number(valueSal) + Number(adiantamentoSal);

    const formatNumberCurrency = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(total);

    console.log({
      data: data[0],
      sal: valueSal,
      adiantamento: adiantamentoSal,
      total: formatNumberCurrency,
    });
  });
})();
