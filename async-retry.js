const retry = require("async-retry");

class SchedulerAsync {
  constructor(interval, f) {
    this.interval = interval;
    this.f = f;
    this.fire();
  }

  async fire() {
    await retry(
      async () => {
        const res = await this.f();
        if (res.status === "STOP") return;

        setTimeout(async () => {
          await this.fire();
        }, res.next);
      },
      {
        onRetry: () => {
          console.info("retrying..");
        },
      }
    );
  }
}

module.exports = SchedulerAsync;
