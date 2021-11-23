const inquirer = require('inquirer');
require('colors');


//Menu de opciones
const menuOpts = [
    {
        type: 'list',
        name: 'option',
        message: 'Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.-'.green} Buscar lugar`
            },
            {
                value: 2,
                name: `${'2.-'.green} Historial de busquedas`
            },
            {
                value: 0,
                name: `${'0.-'.green} Salir`
            }

        ]
    }
];

//Funcion que me permite presionar un enter para continuar
const pausa = async () => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'ENTER'.yellow} para continuar...\n`,
        }
    ]
    console.log('\n');
    await inquirer.prompt(question)
}

//Funcion que imprime el menu de opciones
const inquirerMenu = async () => {
    console.clear();

    console.log('=========================='.green);
    console.log('  Selecciones una opcion '.white);
    console.log('========================== \n'.green);


    const { option } = await inquirer.prompt(menuOpts)

    return option;
}

//Funcion que tomar el valor de la opcion ingresada
const leerInput = async (message) => {
    const question = [
        {
            type: 'input',
            name: 'descrip',
            message,
            //Valida que el valor de entrada exista, es decir, que tenga un valor
            validate(value) {
                if (!value) {
                    return 'por favor ingrese un valor';
                };
                return true;
            }
        }
    ];
    const { descrip } = await inquirer.prompt(question);
    return descrip;
}

//Menu de opciones para borrar una tarea
const listarLugares = async (lugares = []) => {

    const choices = lugares.map((lugar, i) => {

        const idx = `${i + 1}.-`.green;

        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    })

    choices.unshift({
        value: '0',
        name: '0.-'.green + ' Cancelar',
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas)
    return id;
}

const confirmar = async (message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt(question);
    return ok;
}

const mostrarListadoChecklist = async (tareas = []) => {

    const choices = tareas.map((tarea, i) => {
        const idx = `${i + 1}.-`.green;

        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false,
        }
    })

    const preguntas = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }
    ]

    const { ids } = await inquirer.prompt(preguntas)
    return ids;
}


module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist,
}