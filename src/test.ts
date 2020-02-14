import { Adabas } from './adabas';
import { AdabasMap } from '.';

const adabas = new Adabas(12);

const map = new AdabasMap(11).alpha(8, 'AA');

adabas.read({ map }).then( result => {
    console.log(result);
})
