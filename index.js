class Scheduler {
  constructor(interval, f) {
    this.interval = interval;
    this.f = f;
    this.fire();
  }

  fire() {
    const res = this.f();
    if (res === "stop") return;

    setTimeout(() => {
      this.fire();
    }, res);
  }
}

module.exports = Scheduler;
