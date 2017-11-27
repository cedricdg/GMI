
class Dataset {

  constructor () {
    this.gestures = [];
    this.labels = [];
  }

  add_gesture(data, label) {
    this.gestures.push(data);
    this.labels.push(label);
  }

  get_num_gestures() {
    return this.gestures.length;
  }

  get_gestures() {
    return this.gestures;
  }

  get_labels() {
    return this.labels;
  }

}

export default Dataset;