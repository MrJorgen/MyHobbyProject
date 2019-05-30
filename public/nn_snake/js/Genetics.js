export class Genetics {
    constructor() {

    }
    newSnake(oldSnake, newSnake) {
        oldSnake.fitness = this.calculateFitness(oldSnake);
        newSnake.fitness = this.calculateFitness(newSnake);
        if(oldSnake.fitness > newSnake.fitness) {
            // Old snake is better, mutate and return
            oldSnake.brain.mutate(0.1);
            return oldSnake.brain.copy();
        }
        else {
            newSnake.brain.mutate(0.2);
            return newSnake.brain.copy();
        }
    }

    calculateFitness(calcSnake) {
        let fitness = calcSnake.age + calcSnake.score * 10;
        console.log(fitness);
        return fitness;
    }
}