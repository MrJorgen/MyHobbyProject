import { Bird } from "./bird.js";
import { sprites } from "./sprites.js";
import { NeuralNetwork } from "./lib/nn.js";

export function nextGeneration(totalBirds, birdsHeaven, width, centerY) {

  calculateFitness(birdsHeaven);
  let newPopulation = [];
  newPopulation.push(findBest(birdsHeaven));

  // Start at 1 because the first one is a copy of the best one
  for (let i = 1; i < totalBirds; i++) {
    let randomBirdColor = Math.floor(Math.random() * sprites.bird.length);
    let newBird = new Bird(Math.round(width / 4), Math.round(centerY), randomBirdColor);

    // 1% of the new population will be fresh random birds
    if (i > totalBirds * 0.01) {
      newPopulation.push(pickOne(newBird, birdsHeaven));
      // birds[i] = pickOne(newBird, birdsHeaven);
    }
    else {
      newPopulation.push(newBird);
      // birds[i] = newBird;
    }
  }
  birdsHeaven = null;
  return newPopulation;
  // return birds;
}

function findBest(birdsHeaven) {
  let bestIndex = 0, bestFitness = -Infinity;
  for (let i = 0; i < birdsHeaven.length; i++) {
    if (birdsHeaven[i].fitness > bestFitness)  {
      bestIndex = i;
    }
  }
  return birdsHeaven[bestIndex];
}

function pickOne(child, birdsHeaven) {
  let index = 0, r = Math.random();

  while (r > 0) {
    r -= birdsHeaven[index].fitness;
    index++;
  }
  index--;

  child.brain = null;
  child.brain = new NeuralNetwork(birdsHeaven[index].brain);

  child.brain.mutate(0.05);
  return child;
}

// fitness = total distance travelled – distance to the closest gap

function calculateFitness(birdsHeaven) {
  let sum = 0;
  for (let bird of birdsHeaven) {
    // bird.score = (bird.score - bird.gapDist < 0) ? 0 : (bird.score - bird.gapDist);
    sum += bird.score;
  }


  for (let bird of birdsHeaven) {
    bird.fitness = bird.score / sum;
  }
}
