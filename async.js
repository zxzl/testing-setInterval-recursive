class SchedulerAsync {
  constructor(interval, f) {
    this.interval = interval;
    this.f = f;
    this.fire();
  }

  async fire() {
    const res = await this.f();
    if (res.status === "STOP") return;

    setTimeout(async () => {
      await this.fire();
    }, res.next);
  }
}

module.exports = SchedulerAsync;
