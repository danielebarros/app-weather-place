
require('dotenv').config();

const { inquirerMenu,
    pausa,
    leerInput,
    listarLugares
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");



const main = async () => {
    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                console.log('Buscar lugar');
                //Mostrar mensaje
                const termino = await leerInput('Ciudad o Lugar: ');

                // Buscar los lugares
                const lugares = await busquedas.ciudad(termino);

                // Seleccionar el lugar
                const idSeleccionado =  await listarLugares(lugares);
                const lugaresSel = lugares.find(l => l.id === idSeleccionado)
                if (opt === 0 ){
                    continue;
                }

                //guardar en DB
                busquedas.agregarHistorial(lugaresSel.nombre);

                //Clima
                const climaLugar = await busquedas.climaLugar(lugaresSel.lat,lugaresSel.lng);
                
                //Mostar Resultados
                console.log('\nInformacion de la Ciudad\n'.green)
                console.log('CIudad: ',lugaresSel.nombre.cyan);
                console.log('Latitud: ',lugaresSel.lat);
                console.log('Longitud: ',lugaresSel.lng);
                console.log('Temp Actual: ', climaLugar.tempActual);
                console.log('Temp Maxima: ', climaLugar.tempMax);
                console.log('Temp Minima: ',climaLugar.tempMin);
                console.log('Cielo: ',climaLugar.descripCielo.green);

                break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i+1} -> `.green
                    console.log(`${idx}${lugar}`);  
                    if (i === 4){
                        return true;
                    }
                })
                //console.log(busquedas.historial)
                break;
        }
        if (opt !== 0) {
            await pausa();
        }
    } while (opt !== 0);
}

main();