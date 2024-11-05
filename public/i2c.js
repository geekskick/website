var tick = 0;
const MAX_TICKS = 52;
const MIN_ACTIVE_TICK = 13 * 2;
const MAX_ACTIVE_TICK = MIN_ACTIVE_TICK + 2 * 8;
function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}
function generateJson(
  slaveAddress,
  rw,
  masterData,
  actualSlaveAddress,
  ackOrNack
) {
  const start = "10";
  const stop = "1";
  const idle = "1";
  const addressMatch = slaveAddress == actualSlaveAddress ? "0" : "1";

  const json = {
    signal: [
      { name: "SCLK", wave: "h.pP....................H." },
      {
        name: "SDA",
        wave:
          start +
          slaveAddress +
          rw +
          idle +
          "|" +
          addressMatch +
          masterData +
          idle +
          "|" +
          ackOrNack +
          stop +
          idle,
      },
      {
        name: "Note",
        wave: "=77......7=|37.......=|37=",
        data: [
          "Idle",
          "Start",
          "Address",
          "rW",
          "Idle",
          "ACK",
          "Data",
          "Idle",
          "Ack",
          "Stop",
          "Idle",
        ],
      },
      {},
    ],
    foot: { tock: 0 },
  };
  const alpha = "ABCDEFGHIJKLMNOP";
  json.edge = [];
  for (var i = 0; i < json.signal.length; i++) {
    json.signal[i].node = setCharAt(".." + ".", 0, alpha[i]);
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

  const addressLength = parseInt(document.getElementById("addrLength").value);

  s.innerHTML = JSON.stringify(
    generateJson(
      getBinStringFromId("slaveAddress", addressLength),
      document.getElementById("rw").value,
      getBinStringFromId("masterData"),
      getBinStringFromId("actualSlaveAddress", addressLength),
      document.getElementById("an").value
    )
  );

  document.getElementById("slaveAddress").value = getBinStringFromId(
    "slaveAddress",
    addressLength
  );
  document.getElementById("actualSlaveAddress").value = getBinStringFromId(
    "actualSlaveAddress",
    addressLength
  );
  document.getElementById("waveDisplay").innerHTML = "";
  document.getElementById("waveDisplay").appendChild(s);

  WaveDrom.ProcessAll();

  const j = SVG("#svgcontent_0");

  j.findOne("#wavearcs_0").each(function (i, childen) {
    this.x(0);
  }, true);
}

function reset() {
  tick = 0;
  bit = 0;
  document.getElementById("slaveAddress").value = "1";

  //document.getElementById("rw").disabled = false;
  document.getElementById("tick").disabled = false;
  document.getElementById("addrLength").disabled = false;
  document.getElementById("masterData").disabled = false;
  document.getElementById("slaveData").value = "00001111";
  document.getElementById("masterData").value = "11110000";
  document.getElementById("waveDisplay").innerHTML = "";
  document.getElementById("masterInput").value = "";
  document.getElementById("actualSlaveAddress").value = "1";

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
function createDescription(tick) {
  if (tick == MAX_TICKS) {
    setDescription(`Reached end of ticks`);
  } else if (tick == 0) {
    setDescription("SDA line is Idle, pulled high by Pull up resistor");
  } else if (tick == 2) {
    setDescription(
      `Master sends start signal by pulling SDA low. This is so that multiple masters can decide what to do, sometimes a repeated start condition is sent`
    );
  } else if (tick == 4) {
    setDescription(`Master sends address of the slave it's talking to`);
  } else if (tick == 18) {
    setDescription(`Master sends 1 to indicate it's writing to the slave`);
  } else if (tick == 20) {
    setDescription(
      `Master releases SDA line to allow a slave to Acknowledge that it's ready to receive data`
    );
  } else if (tick == 22) {
    setDescription(`Master waits cause slave might be slow`);
  } else if (tick == 24) {
    setDescription(
      `Slave sends an ACK by pulling SDA line low to indicate it's ready to get data`
    );
  } else if (tick == 26) {
    setDescription(`Master sends it's data`);
  } else if (tick == 26 + 16) {
    setDescription(
      `Master releases SDA line to allow a slave to Acknowledge that it has data`
    );
  } else if (tick == 26 + 16 + 2) {
    setDescription(`Master waits cause slave might be slow`);
  } else if (tick == 26 + 16 + 2 + 2) {
    setDescription(
      `Slave sends an ACK by pulling SDA line low to indicate it's ready to get data`
    );
  }
}
function animateTick() {
  if (tick == 0) {
    if (!allInputsValid()) {
      return;
    }
    document.getElementById("masterData").disabled = true;
    document.getElementById("slaveData").disabled = true;
    doit();
  }
  document.getElementById("tick").disabled = true;
  const now = tick++;
  createDescription(now);
  if (now == MAX_TICKS) {
    return;
  }

  var time = new SVG.Timeline();
  time.on("finished", (o) => {
    if (now < MAX_TICKS) {
      document.getElementById("tick").disabled = false;
    }
    if (now >= MIN_ACTIVE_TICK && now < MAX_ACTIVE_TICK && tick % 2 == 0) {
      moveBit("masterData", "slaveInput");
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
  document.getElementById("speedLabel").innerHTML =
    document.getElementById("speed").value;
}

function pulseText(id) {
  const elem = document.getElementById(id);
  elem.style.animation = "pulse 500ms linear infinite";
  setTimeout(() => {
    elem.style.animation = "";
  }, 500);
}
