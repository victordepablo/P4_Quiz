
const Sequelize = require('sequelize');
const {log, biglog, errorlog, colorize} = require("./out");
const {models}= require('./model');
const quizzes = require('./quizzes');
/**
 * Muestra la ayuda
 *
 * @param rl Objeto readline usando para implementar el CLI
 */
exports.helpCmd = rl => {
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
 * @param rl Objeto readline usando para implementar el CLI
 */
exports.listCmd = rl => {
    models.quiz.findAll()
        .then(quizzes => {
            quizzes.forEach(quiz => {
                log(` [${colorize(quiz.id, 'magenta')}]:  ${quiz.question}`);
            });
        })
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        });
};

/**
 * Esta funcion devuelve una promesa que:
 *   - Valida que se ha introducido un valor para el parametro.
 *   - Convierte el parametro en un numero entero.
 *
 * @param id Parametro con el indice a validar.
 */

const validateId = id => {
    return new Sequelize.Promise((resolve, reject) => {
        if (typeof id === "undefined"){
            reject(new Error(`Falta el parametro <id>.`));
        } else {
            id = parseInt(id); //coger la parte entera y descartar lo demas
            if (Number.isNaN(id)) {
                reject(new Error(`El valor del parámetro <id> no es un número`))
            }else{
                resolve(id);
            }
        }
    });
};
/**
 * Muestra el quiz indicado en el parametro: la pregunta y la respuesta
 *
 * @param rl Objeto readline usando para implementar el CLI
 * @param id Clave del quiz a mostrar
 */
exports.showCmd = (rl, id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if (!quiz) {
                throw new Error(`No existe un quiz asociado al id=${id}.`);
            }
            log(` [${colorize(quiz.id, 'magenta')}]:   ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(error => {
             errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        });
};

/**
 * Esta funcion convierte la llamada rl.question, que está basada en callbacks, en una
 * basada en promesas.
 *
 * Esta función devuelve una promesa cuando se cumple, proporciona el texto introducido.
 * Entonces la llamada a then que hay que hacer la promesa será:
 *    .then(answer => {...})
 *
 * También colorea en rojo el texto de la pregunta, elimina espacios al principio y f
 * @param rl Objeto readline usado para implementar el CLI.
 * @param text Pregunta que hay que hacerle al usuario.
 */

const makeQuestion = (rl, text) => {

    return new Sequelize.Promise((resolve, reject) => {
        rl.question(colorize(text, 'red'), answer => {
            resolve(answer.trim());
        });
    });
};
/**
 * Añade un nuevo quiz al modelo.
 * Pregunta interactivamente por la pregunta y la respuesta.
 *
 * Hay que recordar que el funcionamiento de la función rl.question es asincrono.
 * El prompt hay que sacarlo cuando ya se ha terminado la interacción con el usuario,
 * es decir, la llamada rl.prompt() se debe hacer en la callback de la segunda
 * llamada a rl.question.
 *
 * @param rl Objeto readline usando para implementar el CLI
 */
exports.addCmd = rl => {
    makeQuestion(rl, ' Introduzca una pregunta: ')
        .then(q => {
            return makeQuestion(rl, ' Introduzca la respuesta ')
                .then(a => {
                    return {question: q, answer: a};
                });
        })
        .then(quiz => {
            return models.quiz.create(quiz);
        })
        .then((quiz) => {
            log(` ${colorize('Se ha añadido', 'magenta')}: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(Sequelize.ValidationError, error => {
            errorlog('El quiz es erroneo:');
            error.errors.forEach(({message}) => errorlog(message));
        })
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
    });
};

/**
 * Borra un quiz del modelo.
 *
 * @param rl Objeto readline usando para implementar el CLI
 * @param id Clave del quiz a borrar en el modelo.
 */
exports.deleteCmd = (rl,id) => {
    validateId(id)
        .then(id => models.quiz.destroy({where: {id}}))
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        });
};

/**
 * Edita un quiz del modelo.
 *
 * Hay que redcordar que el funcionamiento de la funcion rl.question es asíncrono.
 * El prompt hay que sacarlo cuando ya se ha terminado la interacción con el usuario,
 * es decir, la llamada a rl.prompt() se debe hacer en la callback de la segunda
 * llamada a rl.question.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a editar en el modelo.
 */
exports.editCmd = (rl, id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if (!quiz) {
                throw new Error(`No existe un quiz asociado al id=${id}.`);
            }

            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);
            return makeQuestion(rl, 'Introduzca la respuesta: ')
                .then(q => {
                    process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
                    return makeQuestion(rl, 'Introduzca la respuesta ')
                        .then(a => {
                            quiz.question = q;
                            quiz.answer = a;
                            return quiz;
                        });
                });
        })
    .then(quiz =>{
        return quiz.save();
    })
    .then(quiz =>{
        log(`Se ha cambiado el quiz ${colorize(quiz.id,'magenta')} por: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
    })
    .catch(Sequelize.ValidationError, error => {
        errorlog('El quiz es erroneo: ');
        error.errors.forEach(({message}) => errorlog(message));
    })
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        });
};


/**
 * Prueba un quiz, es decir, hace una preguntadel modelo a la que debemos de contestar.
 *
 * @param rl Objeto readline usando para implementar el CLI
 * @param id clave del quiz a probar.
 */
exports.testCmd = (rl,id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if (!quiz) {
                throw new Error(`El parámetro ID no se reconoce.`);
            }
            log(` [${colorize(quiz.id, 'blue')}]: ${quiz.question}`);
            return makeQuestion(rl, ' Introduzca la respuesta: ')
                .then(h => {
                    if(quiz.answer.toLowerCase() === h.toLowerCase().trim()){
                        log("Su respuesta es CORRECTA", 'green');
                    } else{
                        log("Su respuesta es INCORRECTA", 'red');
                    }
                });
        })
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        });


}


/**
 * Pregunta todos los quizzes existentes en el modelo en orden aleatorio.
 * Se gana si se contesta a todos satisfactoriamente.
 *
 * @param rl Objeto readline usando para implementar el CLI
 */

exports.playCmd = (rl) => {
    let toBeResolved = [];
    let score = 0;


    const playOne = () => {
        return new Promise((resolver,rechazar) => {

            if(toBeResolved.length <=0){
                console.log("No hay nada mas que preguntar.");
                log("Fin del examen. Número de aciertos aciertos:" + score);
                resolver();
                return;
            }
            let position = Math.ceil(toBeResolved.length*Math.random())-1;
            let quiz = toBeResolved[position];
            toBeResolved.splice(position,1);

            makeQuestion(rl, quiz.question+'? ')
                .then(answer => {
                    if(quiz.answer.toUpperCase().trim() === answer.toUpperCase().trim()){
                        score++;
                        log("CORRECTO", 'green')
                        console.log("Lleva ",score, "aciertos");
                        resolver(playOne());
                    } else {
                        log("INCORRECTO", 'red')
                        console.log("Fin del examen. Aciertos:" + score);
                        resolver();
                    }
                })
        })
    }

    models.quiz.findAll({raw: true})
        .then(quizzes => {
            toBeResolved = quizzes;
        })
        .then(() => {
            return playOne();
        })
        .catch(error => {
            console.log(error);
        })
        .then(() => {
            biglog(score,'magenta');
            rl.prompt();
        })
};






/**
 * Muestra los nombre de los autores de la practica.
 *
 * @param rl Objeto readline usando para implementar el CLI
 */
exports.creditsCmd = rl => {
    log('Autores de la practica:');
    log('victordepablo', 'green');
    log('marioesperalta', 'green');
    rl.prompt();
};


/**
 * Terminar el programa.
 *
 * @param rl Objeto readline usando para implementar el CLI
 */
exports.quitCmd = rl => {
    rl.close();
};
