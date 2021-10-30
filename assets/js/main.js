

const URL_API        = "https://my-json-server.typicode.com/UlyssesOrtegaDeveloper/api-json/";

const select_meses   = document.querySelector('#mes');
const select_ano     = document.querySelector('#ano');
const select_empresa = document.querySelector('#empresa');


select_meses.addEventListener('change', e => {
    fnGetDatos(`${URL_API}/${select_ano.value}/${e.target.value}`, `${select_empresa.value}`); 
});


select_ano.addEventListener('change', e => {
    fnGetDatos(`${URL_API}/${e.target.value}/${select_meses.value}`, `${select_empresa.value}`); 
});


select_empresa.addEventListener('change', e => {
    fnGetDatos(`${URL_API}/${select_ano.value}/${select_meses.value}`, `${e.target.value}`);
});

// OK > Funcion automatica: Muestra en la pagina de inicio
// OK > segun el año y mes que estemos muestra los datos con la empresa rhenus como predeterminada

document.addEventListener('DOMContentLoaded', () => {

    // spinner hasta cargar la pagina
    document.querySelector('.spinner-wrapper').style.display = 'none';

    let fecha = new Date();
    let mes  = fecha.getMonth();
    let anio = fecha.getFullYear();

    fnGetDatos(`${URL_API}/${anio}/${mes}`, `rhenus`);
})

const message = document.querySelector('#message');
const resumen = document.querySelector('#resumen');
const arrayResumen = [resumen]
const barritas = document.querySelector('#contenedor-barritas')

let aData = [];
let aCabecera = [];
let aContenido = {};

const fnGetDatos = async (url, empresa) => {

    console.log('url ', url, 'empresa', empresa);

    try {
        message.innerHTML = 'Cargando ...';

        console.log('1. escaneando ...');
        /* let resultado = await fetch('./assets/json/db.json'); */
        let resultado = await fetch('./assets/json/db.json');

        console.log('2. creando objeto ...');
        aData = await resultado.json();

        console.log('3. objeto creado', aData);

        console.log('6. obteniendo contenido de tabla');  
        
        console.log(aData);

        fnContenidoTabla(aData, 2021, 9, 'rhenus');

        console.log('4. obteniendo cabecera de tabla');
        fnCabeceraTabla(aData, 2021, 9, 'rhenus');

        console.log('5. array cabecera', aCabecera);

        console.log('7. array contenido', aContenido);
        
    
        message.innerHTML = '';
    }
    
    catch (error) {
        console.log('ERROR >>', error.message);
        message.innerHTML = 'Error al cargar los datos';
    }
}