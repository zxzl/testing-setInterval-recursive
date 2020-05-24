const Scheduler = require("./index");

describe("scheduler", () => {
  it("should fire according to interval", () => {
    jest.useFakeTimers();

    const mockFn = jest
      .fn(() => {})
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(2000)
      .mockReturnValueOnce("stop");
    const interval = 1000;
    const scheduler = new Scheduler(interval, mockFn);

    jest.advanceTimersByTime(10);
    expect(mockFn.mock.calls.length).toBe(1);

    jest.advanceTimersByTime(1000);
    expect(mockFn.mock.calls.length).toBe(2);

    jest.advanceTimersByTime(2000);
    expect(mockFn.mock.calls.length).toBe(3);

    jest.advanceTimersByTime(1000);
    expect(mockFn.mock.calls.length).toBe(3);
  });
});
