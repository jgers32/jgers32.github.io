document.addEventListener("DOMContentLoaded", function () {
  const bootLines = [
    "Flashing STM32...",
    "Spooling filament...",
    "Pinging Raspberry Pi cluster...",
    "Measuring CO₂ levels...",
    "Warming up soldering iron...",
    "Scanning 3D print queue...",
    "Calibrating hedgehog tracker...",
    "Loading sensor firmware...",
    "Mounting PCB schematics...",
    "Linking MQTT topics...",
    "Bringing up homelab network...",
    "Unlocking secret maker mode...",
    "Logging Player One into the OASIS..."
  ];

  const successLine = "[ SUCCESS ] Maker Page Loaded!";
  const bootLogContainer = document.getElementById("boot-logs");
  const makerContent = document.querySelector(".maker-content");
  const makerBody = document.getElementById("maker-body");

  if (bootLogContainer && makerContent && makerBody) {
    const shuffled = bootLines.sort(() => 0.5 - Math.random()).slice(0, 5);

    shuffled.forEach((line, index) => {
      const log = document.createElement("p");
      log.textContent = `[ OK ] ${line}`;
      log.style.animation = `terminal-typing 1s steps(30, end) forwards`;
      log.style.animationDelay = `${0.2 * index}s`;
      log.style.overflow = "hidden";
      log.style.whiteSpace = "nowrap";
      log.style.width = "0";
      bootLogContainer.appendChild(log);
    });

    const successLog = document.createElement("p");
    successLog.textContent = successLine;
    successLog.style.animation = `terminal-typing 1s steps(30, end) forwards`;
    successLog.style.animationDelay = `${0.2 * shuffled.length}s`; 
    successLog.style.overflow = "hidden";
    successLog.style.whiteSpace = "nowrap";
    successLog.style.width = "0";
    bootLogContainer.appendChild(successLog);

    setTimeout(() => {
      makerContent.style.display = "block";
      makerContent.classList.add("fade-in");

      setTimeout(() => {
        makerBody.classList.add("visible");
		}, 600);
	}, 300);
	}

  const exitBtn = document.getElementById("exit-maker");
  if (exitBtn) {
    exitBtn.addEventListener("click", () => {
      window.location.href = "/";
    });
  }
});
