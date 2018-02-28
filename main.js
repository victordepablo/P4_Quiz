
const readline = require('readline');

const figlet = require('figlet');
const chalk = require('chalk');

/**
 * Dar color a un string
 *
 * @param msg  Es string al que hay que dar color.
 * @param color  El color con el que pintar msg.
 * @returns {strings} Devuelve el string msg con el color indicado
 */
const colorize = (msg, color) => {

    if (typeof color !== "undefined"){
        msg = chalk[color].bold(msg);
    }
    return msg;
};


/**
 * Escribe un mensaje de log
 *
 * @param msg El string a escribir
 * @param color Color del texto
 */
const log = (msg, color) => {
    console.log(colorize(msg, color));
};


/**
 * Escribe un mensaje de log grande.
 *
 * @param msg Texto a escribir
 * @param color Color del texto
 */
const biglog = (msg, color) => {
    log(figlet.textSync(msg, { horizontalLayout: 'full' }), color);
};


/**
 * Escribe el mensaje de error emsg.
 *
 * @param emsg Texto del mensaje de error.
 */
const errorlog = (emsg) => {
    console.log(`${colorize("Error", "red")}: ${colorize(colorize(emsg, "red"), "bgYellowBright")}`);
};

//Modelo de datos
//
// Enesta variable se mantienen todos los quizzes existentes.
// Es un array de objetos, donde cada objeto tiene los atributos question
// y answer para guardar el texto de la pregunta y el de la respuesta.
let quizzes = [
    {
        question: "Capital de Italia",
        answer: "Roma"
    },
    {
        question: "Capital de Francia",
        answer: "París"
    },
    {
        question: "Capital de España",
        answer: "Madrid"
    },
    {
        question: "Capital de Portugal",
        answer: "Lisboa"
    }
    ];

//
/**
 * Devuelve el numero total de preguntas existentes.
 *
 * @return {number} numero total de preguntas existentes.
 */
const count = () => quizzes.lenght;


/**
 * Añade un nuevo quiz
 *
 * @param question String con la pregunta.
 * @param answer String con la respuesta
 */
const add = (question, answer) => {
    quizzes.push({
        question: (question || "").trim(),
        answer: (answer || "").trim()
    });
};


/**
 * Actualiza el quiz situado en la posición index
 *
 * @param id Clave que identifica el quiz a actualizar.
 * @param question String con la pregunta.
 * @param answer String con la respuesta.
 */
const update = (id, question, answer) => {
    const quiz = quizzes[id];
    if (typeof quiz === "undefined"){
        throw new Error(`El valor del parametro id no es valido.`);
    }
    quizzes.splice(id, 1, {
            question: (question || "").trim(),
            answer: (answer || "").trim()
    });
};


/**
 * Devuelve todos los quizzes existentes.
 *
 * Devuelve un clon del valor guardado en la variable quizzes, es decir devuelve un
 * objeto nuevo con todas las preguntas existentes
 * Para clonar quizzes se usa stringify + parse.
 *
 * @returns {any}
 */
const getAll = () => JSON.parse(JSON.stringify(quizzes));


/**
 * Devuelve un clon del quiz almacenado en la posición dada.
 *
 * Para clonar el quiz se usa stringify + parse.
 *
 * @param id Clave que identifica el quiz a devolver.
 *
 * @returns {question, answer} Devuelve el objeto quiz de la posición dada
 */
const getByIndex = id => {

    const quiz = quizzes[id];
    if (typeof quiz === "undefined") {
        throw new Error(`El valor del parámetro id no es válido.`);
    }
    return JSON.parse(JSON.stringify(quiz));
};


//
/**
 * Elimina el quiz situado en la posición dada.
 *
 * @param id Clave que identifica el quiz a borrar..
 */
const deleteByIndex = id => {

    const quiz = quizzes[id];
    if (typeof quiz === "undefined") {
        throw new Error(`El valor del parámetro id no es válido.`);
    }
    quizzes.splice(id, 1);
};


// Mensaje inicial
biglog ('CORE Quiz', 'green');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: colorize("quiz > ", 'blue'),
    completer: (line) => {
    const completions = 'h help add delete edit list test p play credits q quit'.split(' ');
    const hits = completions.filter((c) => c.startsWith(line));
    // show all completions if none found
    return [hits.length ? hits : completions, line];
}
});

rl.prompt();

rl.on('line', (line) => {

    let args = line.split(" ");
    let cmd =args[0].toLowerCase().trim();

         switch (cmd) {
              case '':
                  rl.prompt();
                  break;

              case 'help':
              case 'h':
                  helpCmd();
                  break;


              case 'quit':
              case 'q':
                  quitCmd();
                  break;

             case 'add':
                 addCmd();
                 break;

             case 'List':
                 listCmd();
                 break;

             case 'show':
                 showCmd(args[1]);
                 break;

             case 'test':
                 testCmd(args[1]);
                 break;

             case 'play':
             case 'p':
                 playCmd();
                 break;

             case 'delete':
                 deleteCmd(args[1]);
                 break;

             case 'edit':
                 editCmd(args[1]);
                 break;

             case 'credits':
                 creditsCmd();
                 break;


             default:
                 log(`Comando desconocido: '${colorize(cmd, 'red')}'`);
                 log(`Use ${colorize('help', 'green')}' para ver todos los comandos disponibles.`);
                 rl.prompt();
                 break;
         }

})
.on('close', () => {
         log('Adios!');
         process.exit(0);
});


/**
 * Muestra la ayuda
 */
const helpCmd = () => {
    log("Commandos:");
    log("  h|help - Muestra esta ayuda.");
    log("  list - Listar los quizzes existentes.");
    log("  show <id> - Muestra la pregunta y la respuesta del quiz indicado..");
    log("  add - Añadir un nuevo quiz interactivamente");
    log("  delete<id>  Borrar el quiz indicado.");
    log("  edit<id> - Borrar el quiz indicado.");
    log("  test<id> - Borrar el quiz indicado.");
    log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("  credits - Créditos.");
    log("  q|quit - Salir del programa.");
    rl.prompt();
};

/**
 * Lista todos los quizzes existentes en el modelo.
 */
const listCmd = () => {
    log('Listar todos los quizzes existentes.', 'red');
    rl.prompt();
};

/**
 * Muestra el quiz indicado en el parametro: la pregunta y la respuesta
 *
 * @param id Clave del quiz a mostrar
 */
const showCmd = id => {
    log('Mostrar el quiz indicado.', 'red');
    rl.prompt();
};

/**
 * Añade un nuevo quiz al modelo.
 * Pregunta interactivamente por la pregunta y la respuesta.
 */
const addCmd = () => {
    log('Añadir un nuevo quiz', 'red');
    rl.prompt();
};

/**
 * Borra un quiz del modelo.
 *
 * @param id Clave del quiz a borrar en el modelo.
 */
const deleteCmd = id => {
    log('Borrar el quiz indicado.', 'red');
    rl.prompt();
};


/**
 * Edita un quiz del modelo.
 *
 * @param id Clave del quiz a editar en el modelo.
 */
const editCmd = id => {
    log('Editar el quiz indicado.', 'red');
    rl.prompt();
};

/**
 * Prueba un quiz, es decir, hace una preguntadel modelo a la que debemos de contestar.
 *
 * @param id clave del quiz a probar.
 */
const testCmd = id => {
    log('Probar el quiz indicado.', 'red');
    rl.prompt();
};

/**
 * Pregunta todos los quizzes existentes en el modelo en orden aleatorio.
 * Se gana si se contesta a todos satisfactoriamente.
 */
const playCmd = () =>{
    log('Jugar.', 'red');
    rl.prompt();
};

/**
 * Muestra los nombre de los autores de la practica.
 */
const creditsCmd = () => {
    log('Autores de la practica:');
    log('Victor De Pablo Gozalo', 'green');
    log('Mario Esperalta Delgado', 'green');
    rl.prompt();
};


/**
 * Terminar el programa.
 */
const quitCmd = () => {
    rl.close();
    rl.prompt();
};