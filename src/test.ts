import { Adabas } from './adabas';

const adabas = new Adabas('host', 12);

adabas.read({ fnr: 11, fields: ['AA'] }).then( result => {
    console.log(result);
})
