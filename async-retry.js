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
          console.info("retrying for func1..");
        },
      }
    );
  }
}

class SchedulerAsync2 {
  constructor(interval, f) {
    this.interval = interval;
    this.f = f;
    this.fire();
  }

  async fire() {
    await retry(
      async () => {
        // not implemented https://github.com/zeit/async-retry/issues/43
        var res = await this.f();
        if (res.status === "STOP") return;

        setTimeout(async () => {
          await this.fire();
        }, res.next);
      },
      {
        onRetry: () => {
          console.info("retrying for func2..");
        },
      }
    );
  }
}

module.exports = {
  SchedulerAsync,
  SchedulerAsync2,
};
