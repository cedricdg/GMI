
class Recognizer {

  constructor() {
    this.training_data = [];
    this.labels = [];
  }

  fit(dataset) {
    this.training_data = [];
    this.labels = []
    const all_gestures = dataset.getAllGestures();
    const all_labels = dataset.getAllLabels();
    for (let i = 0; i < all_gestures.length; i++) {
        this.training_data.push(all_gestures[i]);
        this.labels.push(all_labels[i]);
    }
    // do clever fitting here

    return true; // flag saying that the model is trained basically
  }

  predict(data) {
    // random prediction
    const min = 1;
    const max = this.labels[this.labels.length-1] + 1;
    return Math.floor(Math.random() * (max - min)) + min;
  }

}

export default Recognizer;