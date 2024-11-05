var tick = 0;
const DATA_START = 2;
const DATA_LENGTH = 8;
const MIN_ACTIVE_TICK = DATA_START * 2;

function getMaxActiveTick(dataLength) {
  return (DATA_START + dataLength) * 2;
}

function getMaxTicks(dataLength, parityLength, numberOfStopBits) {
  return getMaxActiveTick(dataLength) + (parityLength + numberOfStopBits) * 2;
}
var MAX_ACTIVE_TICK = 0;
var MAX_TICKS = 0;

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}
function generateJson(txData, rxData, parity, numberOfStopBits) {
  const dots = ".".repeat(7);
  const idle = "1";
  const start = "0";
  const stopBitsRounded = Math.round(numberOfStopBits);
  console.log(numberOfStopBits, stopBitsRounded);
  const stopBits = stopBitsRounded == 1 ? "1" : "1.";
  const paritySignalCalculator = (data) => {
    if (parity == "off") {
      return "";
    }
    const numberOfOnes = (data.match(/1/g) || []).length;
    if (parity == "odd") {
      return numberOfOnes % 2 == 0 ? "1" : "0";
    }
    if (parity == "even") {
      return numberOfOnes % 2 == 0 ? "0" : "1";
    }
  };
  const txParitySignal = paritySignalCalculator(txData);
  const rxParitySignal = paritySignalCalculator(rxData);

  const json = {
    signal: [
      {
        name: "Tx",
        wave: idle + start + txData + txParitySignal + stopBits + idle,
      },
      {
        name: "Rx",
        wave: idle + start + rxData + rxParitySignal + stopBits + idle,
      },
      {
        name: "Note",
        wave:
          "===" +
          ".".repeat(txData.length - 1) +
          (txParitySignal != "" ? "=" : "") +
          "=" +
          ".".repeat(stopBits.length - 1) +
          "=",
        data: ["Idle", "Start", "Data", "Parity", "Stop", "Idle"],
      },
      {},
    ],
    foot: { tock: 0 },
  };

  if (parity == "off") {
    json.signal[2].data.splice(3, 1);
  }

  MAX_TICKS = json.signal[0].wave.length * 2;
  const alpha = "ABCDEFGHIJKLMNOP";
  json.edge = [];
  for (var i = 0; i < json.signal.length; i++) {
    json.signal[i].node = setCharAt(".." + dots + ".", 0, alpha[i]);
    json.edge.push(alpha[i] + "-" + alpha[i + 1]);
  }
  json.edge.pop();
  json.edge[json.edge.length - 1] += " Now";

  console.log(json);
  return json;
}

function validInput(s) {
  return s.match(/[01]{8}/);
}

function allInputsValid() {
  return true;
}

function getBinStringFromId(id, bits = 8) {
  let s = document.getElementById(id).value;
  if (s.length > bits) {
    s = s.substring(0, bits);
  } else if (s.length < bits) {
    s = s.padStart(bits, "0");
  }
  return s;
}

function doit() {
  if (!allInputsValid()) {
    return;
  }
  const s = document.createElement("script");
  s.setAttribute("type", "wavedrom");
  if (tick == MAX_TICKS) {
    tick = 0;
  }

  const dataBits = parseInt(document.getElementById("dataBits").value);

  s.innerHTML = JSON.stringify(
    generateJson(
      getBinStringFromId("d1TxData", dataBits),
      getBinStringFromId("slaveData", dataBits),
      document.getElementById("parity").value,
      parseFloat(document.getElementById("stopBits").value)
    )
  );
  document.getElementById("d1TxData").value = getBinStringFromId(
    "d1TxData",
    dataBits
  );
  document.getElementById("slaveData").value = getBinStringFromId(
    "slaveData",
    dataBits
  );
  document.getElementById("waveDisplay").innerHTML = "";
  document.getElementById("waveDisplay").appendChild(s);
  MAX_ACTIVE_TICK = getMaxActiveTick(dataBits);

  WaveDrom.ProcessAll();

  const j = SVG("#svgcontent_0");

  j.findOne("#wavearcs_0").each(function (i, childen) {
    this.x(0);
  }, true);
}

function reset() {
  tick = 0;

  document.getElementById("waveDisplay").innerHTML = "";
  document.getElementById("masterInput").value = "";
  document.getElementById("slaveInput").value = "";
  document.getElementById("tick").disabled = false;
  document.getElementById("slaveData").disabled = false;
  document.getElementById("d1TxData").disabled = false;
  document.getElementById("parity").disabled = false;
  document.getElementById("stopBits").disabled = false;
  document.getElementById("dataBits").disabled = false;

  doit();
}

function moveBit(from, to) {
  const slaveIn = document.getElementById(from).value[0];
  document.getElementById(from).value = document
    .getElementById(from)
    .value.substring(1);
  document.getElementById(to).value =
    document.getElementById(to).value + slaveIn;
  pulseText(to);
}

function setDescription(text) {
  document.getElementById("description").textContent = text;
}

function animateTick() {
  if (tick == 0) {
    if (!allInputsValid()) {
      return;
    }
    document.getElementById("d1TxData").disabled = true;
    document.getElementById("slaveData").disabled = true;
    document.getElementById("stopBits").disabled = true;
    document.getElementById("parity").disabled = true;
    document.getElementById("dataBits").disabled = true;
    doit();
  }
  document.getElementById("tick").disabled = true;
  const now = tick++;
  if (tick == MAX_TICKS) {
    setDescription("No more ticks to do");
    return;
  } else if (tick == 1) {
    setDescription("Signals Idle");
  } else if (tick == 3) {
    setDescription("Start of signal to get the receivers attention");
  } else if (tick == 5) {
    setDescription("Sending Data");
  } else if (tick > MAX_ACTIVE_TICK) {
    setDescription("Either Parity or stop bit");
  }

  var time = new SVG.Timeline();
  time.on("finished", (o) => {
    if (now < MAX_TICKS) {
      document.getElementById("tick").disabled = false;
    }
    if (now >= MIN_ACTIVE_TICK && now < MAX_ACTIVE_TICK && now % 2 == 0) {
      moveBit("d1TxData", "slaveInput");
      moveBit("slaveData", "masterInput");
    }
  });
  const j = SVG("#svgcontent_0");

  j.findOne("#wavearcs_0").each(function (i, childen) {
    this.timeline(time);
    const speed = parseInt(document.getElementById("speed").value);
    this.animate(speed, 100, "now").x(this.x() + 20);
  }, true);
}

function updateLabel() {
  document.getElementById("speedLabel").textContent =
    document.getElementById("speed").value;
}

function updateDataBitsLabel() {
  document.getElementById("dataBitsLabel").textContent =
    document.getElementById("dataBits").value;
}
function updateStopBitsLabel() {
  document.getElementById("stopBitsLabel").textContent =
    document.getElementById("stopBits").value;
}

function pulseText(id) {
  const elem = document.getElementById(id);
  elem.style.animation = "pulse 500ms linear infinite";
  setTimeout(() => {
    elem.style.animation = "";
  }, 500);
}
