
class Dataset {

  constructor () {
    this.gesture = []
    this.allGestures = [];
    this.allLabels = [];
  }

  fillGesture(data) {
    this.gesture.push(data);
  }

  addGestureWithLabel(label) {
    this.allGestures.push(this.gesture);
    this.gesture = [];
    this.allLabels.push(label);
  }

  getNumGestures() {
    return this.allGestures.length;
  }

  getCurrentGesture() {
    return this.gesture;
  }

  getGestures() {
    return this.allGestures;
  }

  getLabels() {
    return this.allLabels;
  }

}

export default Dataset;