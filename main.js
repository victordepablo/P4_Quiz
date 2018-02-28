
const readline = require('readline');

const figlet = require('figlet');
const chalk = require('chalk');

// Mensaje inicial
console.log(
    chalk.green.bold(
        figlet.textSync('CORE Quiz', {horizontalLayout: 'full'})
    )
);



console.log("CORE Quiz");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'quiz> ',
    completer(line) {
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
                 console.log(`Comando desconocido: '${cmd}'`);
                 console.log(`Use 'help' para ver todos los comandos disponibles.`);
                 rl.prompt();
                 break;
         }

})
.on('close', () => {
         console.log('Adios!');
         process.exit(0);
});


/**
 * Muestra la ayuda
 */
const helpCmd = () => {
    console.log("Commandos:");
    console.log("  h|help - Muestra esta ayuda.");
    console.log("  list - Listar los quizzes existentes.");
    console.log("  show <id> - Muestra la pregunta y la respuesta del quiz indicado..");
    console.log("  add - Añadir un nuevo quiz interactivamente");
    console.log("  delete<id>  Borrar el quiz indicado.");
    console.log("  edit<id> - Borrar el quiz indicado.");
    console.log("  test<id> - Borrar el quiz indicado.");
    console.log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    console.log("  credits - Créditos.");
    console.log("  q|quit - Salir del programa.");
    rl.prompt();
};

/**
 * Lista todos los quizzes existentes en el modelo.
 */
const listCmd = () => {
    console.log('Listar todos los quizzes existentes.');
    rl.prompt();
};

/**
 * Muestra el quiz indicado en el parametro: la pregunta y la respuesta
 *
 * @param id Clave del quiz a mostrar
 */
const showCmd = id => {
    console.log('Mostrar el quiz indicado.');
    rl.prompt();
};

/**
 * Añade un nuevo quiz al modelo.
 * Pregunta interactivamente por la pregunta y la respuesta.
 */
const addCmd = () => {
    console.log('Añadir un nuevo quiz');
    rl.prompt();
};

/**
 * Borra un quiz del modelo.
 *
 * @param id Clave del quiz a borrar en el modelo.
 */
const deleteCmd = id => {
    console.log('Borrar el quiz indicado.');
    rl.prompt();
};


/**
 * Edita un quiz del modelo.
 *
 * @param id Clave del quiz a editar en el modelo.
 */
const editCmd = id => {
    console.log('Editar el quiz indicado.');
    rl.prompt();
};

/**
 * Prueba un quiz, es decir, hace una preguntadel modelo a la que debemos de contestar.
 *
 * @param id clave del quiz a probar.
 */
const testCmd = id => {
    console.log('Probar el quiz indicado.');
    rl.prompt();
};

/**
 * Pregunta todos los quizzes existentes en el modelo en orden aleatorio.
 * Se gana si se contesta a todos satisfactoriamente.
 */
const playCmd = () =>{
    console.log('Jugar.');
    rl.prompt();
};

/**
 * Muestra los nombre de los autores de la practica.
 */
const creditsCmd = () => {
    console.log('Autores de la practica:');
    console.log('Victor De Pablo Gozalo');
    console.log('Mario Esperalta Delgado');
    rl.prompt();
};


/**
 * Terminar el programa.
 */
const quitCmd = () => {
    rl.close();
    rl.prompt();
};