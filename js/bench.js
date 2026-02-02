class BenchMarker {
  #disable = false;
  #name;
  #marks = [];
  constructor(name = "BenchMark", disable = false) {
    this.#disable = disable;
    this.#name = name;
    this.markNow("Start");
  }

  markNow(name = "") {
    if (this.#disable) return;

    if (name.length == 0) {
      name = String(this.#marks.length);
    }
    this.#marks.push({ time: performance.now(), name: name });
  }

  finish(name = "") {
    if (this.#disable) return;
    this.markNow(name);

    console.log(`Benchmark : ${this.#name}`);
    for (let i = 1; i < this.#marks.length; i += 1) {
      let time1 = this.#marks[i - 1];
      let time2 = this.#marks[i];
      console.log(
        `  ${time1.name} -> ${time2.name} : ${this.perfTimeToString(time2.time - time1.time)}`,
      );
    }
    console.log(
      `  Total : ${this.perfTimeToString(this.#marks[this.#marks.length - 1].time - this.#marks[0].time)}`,
    );
  }

  perfTimeToString(time) {
    if (time === 0) {
      return "0";
    }

    let timeSecond = time / 1000;
    let seconds = Math.round(timeSecond);
    if (seconds != 0) {
      return `${timeSecond} s`;
    }

    let timeMilli = (timeSecond - seconds) * 1000;
    let millis = Math.round(timeMilli);
    if (millis != 0) {
      return `${timeMilli} ms`;
    }

    //Useless js trop lent pour moins que millis looser
    let timeMicro = (timeMilli - millis) * 1000;
    let micro = Math.round(timeMicro);
    if (micro != 0) {
      return `${timeMicro} µs`;
    }

    let timeNano = (timeMicro - micro) * 1000;

    return `${timeNano} ns`;
  }
}

export { BenchMarker };
