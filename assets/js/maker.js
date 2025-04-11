document.addEventListener("DOMContentLoaded", function () {
	const bootLines = [
	  "Flashing ATmega328P...",
	  "Spooling filament...",
	  "Compiling circuit netlist...",
	  "Launching OctoPrint...",
	  "Pinging Raspberry Pi cluster...",
	  "Measuring CO₂ levels...",
	  "Warming up soldering iron...",
	  "Syncing maker projects...",
	  "Scanning 3D print queue...",
	  "Calibrating hedgehog tracker...",
	  "Loading sensor firmware...",
	  "Mounting PCB schematics...",
	  "Linking MQTT topics...",
	  "Opening garage door... ✔️",
	  "Bringing up homelab network...",
	  "Unlocking secret maker mode..."
	];
  
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
  
	  setTimeout(() => {
		makerContent.style.display = "block";
		makerContent.classList.add("fade-in");
  
		setTimeout(() => {
		  makerBody.classList.add("visible");
		}, 600);
	  }, 300);
	}
  
	// Exit button
	const exitBtn = document.getElementById("exit-maker");
	if (exitBtn) {
	  exitBtn.addEventListener("click", () => {
		window.location.href = "/";
	  });
	}
  });
  