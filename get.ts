import { Adabas } from "./src";

const adabas = new Adabas(12, { log: ['before', 'cb']});

adabas.read({ fnr: 11, isn: 207 }).then ( result => {
    console.log(result);
})