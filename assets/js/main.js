/// COMENZAMOS !
const URL_API        = "https://my-json-server.typicode.com/UlyssesOrtegaDeveloper/json-delivery";

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

/// OK > Funcion automatica: Muestra en la pagina de inicio
/// OK > segun el año y mes que estemos muestra los datos con la empresa rhenus como predeterminada

document.addEventListener('DOMContentLoaded', () => {

    /// spinner hasta cargar la pagina
    document.querySelector('.spinner-wrapper').style.display = 'none';

    let fecha = new Date();
    let mes  = fecha.getMonth();
    let anio = fecha.getFullYear();

    fnGetDatos(`${URL_API}/${anio}/${mes}`, `rhenus`);
})

const message = document.querySelector('#message');
const resumen = document.querySelector('#resumen');
const arrayResumen = [resumen]
const barritas = document.querySelector('#contenedor-barritas');


let aData = [];
let aCabeceraTabla = [];
let aContenidoTabla = [];
/* let aTabla = [[],[],[],[],[],[],[],[]]; */

const fnGetDatos = async (url, empresa) => {

    try {
        message.innerHTML = 'Cargando ...';

        /* let resultado = await fetch('https://my-json-server.typicode.com/UlyssesOrtegaDeveloper/json-delivery/2021/9'); */
        
        let resultado = await fetch(url);

        aData = await resultado.json();

        fnTabla(aData, empresa);

        message.innerHTML = '';
    }
    
    catch (error) {
        console.log('ERROR >>', error.message);
        message.innerHTML = 'Error al cargar los datos';
    }
}


/// fn > crea la tabla de Section_0 donde muestra la lista de ruta diaria
const fnTabla = async(data, empresa) => {

    let myTabla = [[],[],[],[],[],[],[],[]];
    let cabecera = [];
    let contenido = [];

    /// transformamos los objetos en arrays
    data.ruta.map(element => {

        if (element.empresa == empresa) {
            
            cabecera = Object.keys(element);
            contenido.push(Object.values(element));
        }
    });

    /// DESTRUCTURING para quitar 'observaciones'
    let [cab1, cab2, cab3, cab4, cab5, cab6, cab7, cab8, cab9] = cabecera;
    cabecera = [cab1, cab2, cab3, cab4, cab5, cab6, cab7, cab8];


    /// insertamos los datos en el array myTabla
    cabecera.map((element, i) => {

        myTabla[i].push(element);

            contenido.map((element, j) => { 

                myTabla[i].push(Object.values(contenido[j])[i])
            });
    })

    /// DESTRUCTURING para quitar el nombre de la empresa
    let [, ...tablaDestructurada] = myTabla;

    /// HTML limpiar tabla
    tablaDestructurada.forEach((item, i) => {

        tablaDestructurada[0].forEach((items, j) => {

            document.querySelector('#idTabla'+i).innerHTML = ``;
        })
    })

    /// HTML TABLA SECTION_0
    tablaDestructurada.forEach((item, i) => {

        tablaDestructurada[0].forEach((items, j) => {

            document.querySelector('#idTabla'+i).innerHTML += `<li>${tablaDestructurada[i][j]}</li>`;
        })
    })




    /// DESTRUCTURING para quitar los dias
    /// Paso. 1 -> para poder sumar
    let [, ...tablaDestructuradaX2] = tablaDestructurada;

    /// DESTRUCTURING para poder sumar
    /// Paso. 2 -> tabla completada para poder sumar
    let tablaNumerica = [];      

    tablaDestructuradaX2.map((element, i) => {

        [, ...tablaNumerica[i]] = element;
    })


    /// PRECIOS
    const tablaPrecios = [
        3.94,   /// entregas
        3.94,   /// recogidas
        //6,      /// recogidaEspecial
        0.073,  /// kilos
        5,      /// especiales
        7,      /// berioska
        3.94    /// extras
    ]


    /// OK > SUMAS REALIZADAS
    let tablaSumas = [];
    let sumaTotalResumen = 0;

    tablaNumerica.map((element, i) => {
        
        tablaSumas[i] = tablaNumerica[i].reduce((prev, item) => {

            return prev + item;
        })

        /// HTML > Section_1 > se inserta en pestaña 'estadisticas' entregas, recogidas, kilos, especiales, berioska y extras
        document.querySelector('#idSuma_'+i).innerHTML = tablaSumas[i];
        
        /// HTML > Section_2 > se inserta en pestaña 'resumen' entregas, recogidas, kilos, especiales, berioska y extras
        document.querySelector('#idResumenA_'+i).innerHTML = tablaSumas[i];
        /// Factura
        document.querySelector('#idResumenA_'+i+'_factura').innerHTML = tablaSumas[i];
        /// HTML > Section_2 > insertando precios
        document.querySelector('#idResumenB_'+i).innerHTML = tablaPrecios[i];
        /// Factura
        document.querySelector('#idResumenB_'+i+'_factura').innerHTML = tablaPrecios[i];
        /// HTML > Section_2 > insertando precios
        document.querySelector('#idResumenC_'+i).innerHTML = (tablaPrecios[i] * tablaSumas[i]).toFixed(2);
        /// Factura
        document.querySelector('#idResumenC_'+i+'_factura').innerHTML = (tablaPrecios[i] * tablaSumas[i]).toFixed(2);
        
        /// Suma de totales para insertar en html a continuacion
        sumaTotalResumen += tablaPrecios[i] * tablaSumas[i]; 
    })

    /// TOTAL SUMA EN RESUMEN
    document.querySelector('#idResumenC_6').innerHTML = sumaTotalResumen.toFixed(2)+'€';
    
    /// FACTURA BASE IMPONIBLE
    const BASE = document.querySelector('#idimpuestosC_6_factura').innerHTML = sumaTotalResumen.toFixed(2);
    /// FACTURA IGIC
    const IGIC = document.querySelector('#idimpuestosC_7_factura').innerHTML = (sumaTotalResumen * (3 / 100)).toFixed(2);
    /// FACTURA IRPF
    const IRPF = document.querySelector('#idimpuestosC_8_factura').innerHTML = (sumaTotalResumen * (1 / 100)).toFixed(2);
    /// TOTAL
    let total = document.querySelector('#idimpuestosC_9_factura');
    total.innerHTML = (parseFloat(BASE) + parseFloat(IGIC)) - parseFloat(IRPF)+' €';



    /// FACTURA > mes y año
    aMeses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

    document.querySelector('#idMes').innerHTML = aMeses[select_meses.value];
    document.querySelector('#idAno').innerHTML = select_ano.value;



    let diasTrabajados = tablaNumerica[0].length;
    let sumaMedia = tablaSumas[0] + tablaSumas[1] + tablaSumas[5];
    let media = sumaMedia / diasTrabajados;


    /// OK > HTML > Section_2 > 'MEDIA DIARIA' se suma entregas, recogidas y extras para sacar la media
    document.querySelector('#idMedia').innerHTML = media.toFixed(2);
    /// OK > HTML > Section_2 > 'DIAS TRABAJADOS'
    document.querySelector('#idDiasTrabajados').innerHTML = diasTrabajados;

    /// LIMPIA LAS BARRAS ANTERIORES
    barritas.innerHTML = '';

    /// OK > HTML > Section_1 > 'BARRITAS'
    tablaNumerica[0].forEach((item, index) => {

        let letra = fnCalcularLetraDia(aData, empresa);

        barritas.innerHTML += `<div class="barrita">${tablaNumerica[0][index]} <br> ${letra[index]}</div>`;
    });


    /// CALCULAMOS PORCENTAJE
    let porcentaje = 0;
    let numMaximoEntregas = Math.max(...tablaNumerica[0]);
    
    tablaNumerica[0].forEach((item, index) => {

        porcentaje = ((tablaNumerica[0][index] * 100) / numMaximoEntregas)+'%';
        
        if (index == 0) document.querySelectorAll('.barrita')[index].style.height = porcentaje;
        if (index > 0) document.querySelectorAll('.barrita')[index].style.height = porcentaje;
    })


    /// HTML LIMPIAR TABLA  > TABLA SECTION_2 Factura
    tablaDestructurada.forEach((item, i) => {

        tablaDestructurada[0].forEach((items, j) => {

            document.querySelector('#idTabla'+i+'_factura').innerHTML = ``;
        })
    })


    /// HTML TABLA SECTION_2 Factura
    tablaDestructurada.forEach((item, i) => {

        tablaDestructurada[0].forEach((items, j) => {

            if (tablaDestructurada[i][j] === 0) {
                document.querySelector('#idTabla'+i+'_factura').innerHTML += `<li><br></li>`;
            } else {
                document.querySelector('#idTabla'+i+'_factura').innerHTML += `<li>${tablaDestructurada[i][j]}</li>`;
            }

        })

        document.querySelector('#idTabla'+i+'_factura').innerHTML += `<li><br></li>`;
        
        
        /* document.querySelector('#idTabla'+i+'_factura').innerHTML += `<li>${tablaSumas[i]}</li>`; */
        
    })

}



//----------------------------------------- 
///         PESTAÑA ESTADISTICAS
//------------------------------------------




/// fn > se activa dentro de fnRellenarBarritas
/// calcula la letra de la semana (lunes = L, martes = M, etc) para que la funcion principal pueda insertarla dentro de las barritas
const fnCalcularLetraDia = (data, empresa) => {

    const semana = ['D','L','M','X','J','V','S'];
    let letras = [];

    data.ruta.forEach((item, index) => {
        
        if (item.empresa == empresa) {
            
            let d = new Date(select_ano.value, data.id, item.dia);
            
            letras.push(semana[d.getDay()]);
        }
    })

    return letras; 
}
















const fnSection_1 = async() => {
 
    const fnResumen = (data) => {   /// nos muestra el numero total de Entregas, recogidas, etc ...

        let contenedorMediaCantidad = document.querySelector('#contenedor-media-cantidad');

        let diasTrabajados = data[0].length;

        try {
            
            /// limpiamos anteriores registros
            for(let i = 0; i < arrayResumen.length; i++){
                    
                arrayResumen[i].innerHTML = ``;
            }

            let keys = Object.keys(objSumas);
            let values = Object.values(objSumas);

            /// insertamos en HTML
            for(let i = 0; i < values.length; i++){
            
                resumen.innerHTML += `<li><div class="resumenValues counter" data-target="${values[i]}">0</div><div class="resumenKeys">${keys[i]}</div></li>`; 
            }

            resumen.innerHTML += `<li><div class="resumenValues counter" data-target="${diasTrabajados}">0</div><div class="resumenKeys">Dias trabajados</div></li>`; 
            
            /// hayando la media
            let media = (objSumas.entregas + objSumas.recogidas + objSumas.extras) / diasTrabajados;
            
            const precios = {"bultos": 3.94, "recogidas": 3.94, "recogidasEspeciales": 6, "kilos": 0.04, "especiales": 5, "extras": 3.94};
            
            let acumulado = (objSumas.entregas * precios.bultos) + (objSumas.recogidas * precios.recogidas) + (objSumas.kilos * precios.kilos) + (objSumas.especiales * precios.especiales) + (objSumas.extras * precios.extras);


            /// media y cantidad
            contenedorMediaCantidad.innerHTML = `<div class="media">${media}<br><span class='subtexto'>media</span></div><li class="cantidad">${acumulado.toFixed(2)}€<br><span class='subtexto'>acumulado</span></li>`;
            

        } catch (error) {
            console.log('ERROR', error.message);
        }
    }

    /// Ejecuta dentro de fnResumen
    const fnCounterUp = () => {

        const counters = document.querySelectorAll('.counter');

        counters.forEach(counter => {

            const updateCounter = () => {

                const target = +counter.getAttribute('data-target');
                const c = +counter.innerText;
                const increment = Math.ceil(target / 500);

                if(c < target) {
                    counter.innerText = c + increment;
                    setTimeout(updateCounter, 1);
                } else {
                    counter.innerText = target;
                }
            };

            updateCounter();
        });
    }

    /// fn > se activa en fnInicial
    /// lista todas las barras (numero de dias trabajados) en la pestaña 'resumen' a 10%
    const fnRellenarBarritas = (data, dataB, empresa) => {
        
        try {

            let letra = fnCalcularLetraDia(dataB, empresa);
            
            barritas.innerHTML = '';
            
            data[0].forEach((item, index) => {

                barritas.innerHTML += `<div class="barrita">${data[0][index]} <br> ${letra[index]}</div>`;
            });

        } catch (error) {
            console.log('ERROR', error.message);
        }
    }

    /// fn > se activa al pulsar el btn 'resumen' o los select 'elegir empresa', 'mes' o 'año'
    /// inserta el numero de entregas diarias en las barras creadas en fnRellenarBarritas, y con ayuda del CSS le da un bonito movimiento 
    const fnMagia = (data) => {
        
        try {

            let porcentaje = 0;
            let numMaximoEntregas = Math.max(...data[0]);
            
            data[0].forEach((item, index) => {

                // matematiqueando
                porcentaje = ((data[0][index] * 100) / numMaximoEntregas)+'%';
                
                if (index == 0) document.querySelectorAll('.barrita')[index].style.height = porcentaje;
                if (index > 0) document.querySelectorAll('.barrita')[index].style.height = porcentaje;
            })

        } catch (error) {
            console.log('ERROR', error.message);
        }
    }

    /// fn > se activa dentro de fnRellenarBarritas
    /// calcula la letra de la semana (lunes = L, martes = M, etc) para que la funcion principal pueda insertarla dentro de las barritas
    const fnCalcularLetraDia = (data, empresa) => {

        const semana = ['D','L','M','X','J','V','S'];
        let letras = [];

        data.mes.forEach((item, index) => {

            if (index > 1 && item.empresa == empresa) {
                let d = new Date(data.ano, data.id, data.mes[index].solapa1);
                letras.push(semana[d.getDay()]);
            }
        })

        return letras; 
    }



    /// Eventos 

    /// Al pulsar el BOTON 'Resumen' de la barra bottom mobile, acciona el evento 'fnMagiaBarritas'
    /// este evento inserta el numero de entregas a las barras con una transicion de movimiento
    const evBtnResumen = document.querySelector('#idFooterMobile');
    evBtnResumen.addEventListener('click', e => {

        if (e.target.dataset.titulo === 'Estadisticas') {

            setTimeout(() => {
                fnMagia(arrayDatos);
                fnCounterUp();
            }, 500);
        }
    });


    const evBtnElegirEmpresa = document.querySelector('#empresa');
    evBtnElegirEmpresa.addEventListener('click', () => { fnSetTimeOutMagic(); });

    const evBtnElegirMes = document.querySelector('#mes');
    evBtnElegirMes.addEventListener('click', () => { fnSetTimeOutMagic(); });

    const evBtnElegirAno = document.querySelector('#ano');
    evBtnElegirAno.addEventListener('click', () => { fnSetTimeOutMagic(); });

    /// fn > se activa dentro de los eventos 'elegir empresa', 'elegir mes' o 'elegir año'
    const fnSetTimeOutMagic = () => {
        
        setTimeout(() => {
            fnMagia(arrayDatos);
            fnCounterUp();
        }, 500);
    }


}



