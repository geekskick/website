var tick = 0;
const MAX_TICKS = 20;
const MIN_ACTIVE_TICK = 1 * 2;
const MAX_ACTIVE_TICK = 9 * 2;
function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}
function generateJson(csState, mosiData, misoData, cpha, cpol) {
  const dots = ".".repeat(7);
  const pulse = cpol == 1 ? "N" : "P";

  const json = {
    signal: [
      { name: "SCLK", wave: cpol + pulse + dots + pulse },
      { name: "CS", wave: "1" + csState + dots + "1" },
      { name: "MOSI", wave: "z" + mosiData + "z" },
      { name: "MISO", wave: "z" + misoData + "z" },
      {},
    ],
    foot: { tock: 0 },
  };
  const alpha = "ABCDEFGHIJKLMNOP";
  json.edge = [];
  for (var i = 0; i < json.signal.length; i++) {
    json.signal[i].node = setCharAt(".." + dots + ".", 0, alpha[i]);
    json.edge.push(alpha[i] + "-" + alpha[i + 1]);
  }
  json.edge.pop();
  json.edge[json.edge.length - 1] += " Now";

  return json;
}

function validInput(s) {
  return s.match(/[01]{8}/);
}

function allInputsValid() {
  if (!validInput(document.getElementById("mosi").value)) {
    console.log("Mosi input invalid");
    document.getElementById("mosi").classList.add("error");
    return false;
  } else {
    document.getElementById("mosi").classList.remove("error");
  }
  if (!validInput(document.getElementById("miso").value)) {
    console.log("Miso invalid");
    document.getElementById("miso").classList.add("error");
    return false;
  }
  document.getElementById("miso").classList.remove("error");
  return true;
}

function getBinStringFromId(id) {
  let s = document.getElementById(id).value;
  if (s.length > 8) {
    s = s.substring(0, 8);
  } else if (s.length < 8) {
    s = s.padStart(8, "0");
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

  s.innerHTML = JSON.stringify(
    generateJson(
      "0",
      getBinStringFromId("mosi"),
      getBinStringFromId("miso"),
      document.getElementById("cpha").value,
      document.getElementById("cpol").value
    )
  );
  document.getElementById("mosi").value = getBinStringFromId("mosi");
  document.getElementById("miso").value = getBinStringFromId("miso");
  document.getElementById("waveDisplay").innerHTML = "";
  document.getElementById("waveDisplay").appendChild(s);

  WaveDrom.ProcessAll();

  const j = SVG("#svgcontent_0");

  j.findOne("#wavearcs_0").each(function (i, childen) {
    this.x(0);
  }, true);

  document.getElementById("description").innerHTML =
    "The clock is idle " +
    (document.getElementById("cpol").value == 1 ? "high" : "low") +
    " and data is actioned on the " +
    (document.getElementById("cpha").value == 0 ? "first" : "second") +
    " edge seen";
}

function reset() {
  tick = 0;
  bit = 0;
  document.getElementById("mosi").disabled = false;
  document.getElementById("miso").disabled = false;
  document.getElementById("tick").disabled = false;
  document.getElementById("cpha").disabled = false;
  document.getElementById("cpol").disabled = false;
  document.getElementById("waveDisplay").innerHTML = "";
  document.getElementById("masterInput").value = "";
  document.getElementById("slaveInput").value = "";
  document.getElementById("mosi").value = "10100101";
  document.getElementById("miso").value = "01011010";
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

function animateTick() {
  if (tick == 0) {
    if (!allInputsValid()) {
      return;
    }
    document.getElementById("miso").disabled = true;
    document.getElementById("mosi").disabled = true;
    document.getElementById("cpha").disabled = true;
    document.getElementById("cpol").disabled = true;
    doit();
  }
  document.getElementById("tick").disabled = true;
  const now = tick++;
  if (tick == MAX_TICKS) {
    return;
  }

  var time = new SVG.Timeline();
  time.on("finished", (o) => {
    if (now < MAX_ACTIVE_TICK) {
      document.getElementById("tick").disabled = false;
    }
    if (
      now >= MIN_ACTIVE_TICK &&
      now < MAX_ACTIVE_TICK &&
      (now + parseInt(document.getElementById("cpha").value)) % 2 == 0
    ) {
      moveBit( "miso", "masterInput");
      moveBit( "mosi", "slaveInput");
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
