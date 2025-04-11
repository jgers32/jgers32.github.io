// Konami Code Sequence
const konamiSequence = [
	"ArrowUp", "ArrowUp",
	"ArrowDown", "ArrowDown",
	"ArrowLeft", "ArrowRight",
	"ArrowLeft", "ArrowRight",
	"b", "a"
  ];
  
  let konamiProgress = 0;
  
  document.addEventListener("keydown", function (e) {
	const key = e.key;
	if (key === konamiSequence[konamiProgress]) {
	  konamiProgress++;
  
	  if (konamiProgress === konamiSequence.length) {
		// Darken background
		document.body.style.backgroundColor = "black";
		document.body.style.transition = "background-color 0.2s ease-in";
  
		// Hide content
		const academicContent = document.querySelector(".academic-content");
		if (academicContent) academicContent.style.display = "none";
  
		// Flash message
		const flash = document.createElement("div");
		flash.textContent = "🛠️ Maker Mode Activated!";
		flash.style.position = "fixed";
		flash.style.top = "50%";
		flash.style.left = "50%";
		flash.style.transform = "translate(-50%, -50%)";
		flash.style.fontSize = "2rem";
		flash.style.color = "#00ff99";
		flash.style.zIndex = 10001;
		flash.style.opacity = 1;
		flash.style.transition = "opacity 0.6s";
		document.body.appendChild(flash);
  
		setTimeout(() => flash.style.opacity = 0, 600);
		setTimeout(() => flash.remove(), 1000);
  
		// Full-screen black fade
		const fadeOverlay = document.createElement("div");
		fadeOverlay.style.position = "fixed";
		fadeOverlay.style.top = 0;
		fadeOverlay.style.left = 0;
		fadeOverlay.style.width = "100vw";
		fadeOverlay.style.height = "100vh";
		fadeOverlay.style.backgroundColor = "black";
		fadeOverlay.style.zIndex = 10000;
		fadeOverlay.style.opacity = 0;
		fadeOverlay.style.transition = "opacity 0.8s ease-in-out";
		document.body.appendChild(fadeOverlay);
  
		// Trigger fade
		setTimeout(() => {
		  fadeOverlay.style.opacity = 1;
		}, 200);
  
		// Redirect after fade
		setTimeout(() => {
		  window.location.href = "/maker/";
		}, 1200);
  
		konamiProgress = 0;
	  }
	} else {
	  konamiProgress = 0;
	}
  });
  