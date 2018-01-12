/**
 * Recongizer class
 * Simple template-based recognizer
 */

import * as utils from './utils'


class Recognizer {

  constructor() {
    this.trainingData = [];
    this.trainingLabels = [];
  }


  fit(dataset) {
    this.trainingData = dataset.getGestures();
    this.trainingLabels = dataset.getLabels();
  }

  predict(gesture) {
    let minDistance = Infinity;
    let minIndex = -1;

    // TODO Translate Starting point of gestures

    for (let i=0; i < this.trainingData.length; i++) {

      const template = this.trainingData[i];
      let dist = 0.0;
      for (let k=0; k < Math.min(template.length, gesture.length); k++){
          dist = dist + utils.distance(template[k], gesture[k]);
      }

      if (dist < minDistance){
        minDistance = dist;
        minIndex = i;
      }


    }
    return this.trainingLabels[minIndex];

  }

}

export default Recognizer;
