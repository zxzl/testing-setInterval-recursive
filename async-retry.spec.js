const Scheduler = require("./async-retry").SchedulerAsync;
const Scheduler2 = require("./async-retry").SchedulerAsync2;

describe("scheduler", () => {
  it("should retry when error comes up after promise", async () => {
    jest.useFakeTimers();

    // @See https://stackoverflow.com/a/52196951/2895025
    const mockFn = jest
      .fn()
      .mockResolvedValueOnce({ status: "GO", next: 1000 })
      .mockResolvedValueOnce({ status: "GO", next: 2000 })
      .mockResolvedValueOnce("Injected failure")
      .mockResolvedValueOnce({ status: "STOP" });
    const interval = 1000;
    const scheduler = new Scheduler(interval, mockFn);

    jest.advanceTimersByTime(10);
    await flushPromises();

    expect(mockFn.mock.calls.length).toBe(1);

    jest.advanceTimersByTime(1000);
    await flushPromises();
    expect(mockFn.mock.calls.length).toBe(2);

    jest.advanceTimersByTime(2000);
    await flushPromises();

    expect(mockFn.mock.calls.length).toBe(3);

    jest.advanceTimersByTime(100000);
    await flushPromises();

    expect(mockFn.mock.calls.length).toBe(4);
  });

  it("should retry when error comes from rejected promise", async () => {
    jest.useFakeTimers();

    // @See https://stackoverflow.com/a/52196951/2895025
    const mockFn = jest
      .fn()
      .mockResolvedValueOnce({ status: "GO", next: 1000 })
      .mockResolvedValueOnce({ status: "GO", next: 2000 })
      .mockRejectedValue(new Error("Injected failure"))
      .mockResolvedValueOnce({ status: "STOP" });
    const interval = 1000;
    const scheduler = new Scheduler2(interval, mockFn);

    jest.advanceTimersByTime(10);
    await flushPromises();

    expect(mockFn.mock.calls.length).toBe(1);

    jest.advanceTimersByTime(1000);
    await flushPromises();
    expect(mockFn.mock.calls.length).toBe(2);

    jest.advanceTimersByTime(2000);
    await flushPromises();

    expect(mockFn.mock.calls.length).toBe(3);

    jest.advanceTimersByTime(10000);
    await flushPromises();

    // expect(mockFn.mock.calls.length).toBe(4);
  });
});

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}
