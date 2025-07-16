---
layout: maker
permalink: /maker/
title: Maker Mode
---
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.cells.min.js"></script>

<h3 style="color: #00ff99;">Booting into Maker Mode...</h3>
<canvas id="matrix-bg"></canvas>
<script>
  const canvas = document.getElementById('matrix-bg');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);
  const characters = "01▌▚▞▒▓█░#@$%^&*".split(""); // mix it up a bit

  function drawMatrixRain() {
    ctx.fillStyle = "rgba(15, 15, 15, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(128, 128, 128, 0.4)";
    ctx.font = `${fontSize}px 'Source Code Pro', monospace`;

    drops.forEach((y, x) => {
      const char = characters[Math.floor(Math.random() * characters.length)];
      ctx.fillText(char, x * fontSize, y * fontSize);

      if (y * fontSize > canvas.height && Math.random() > 0.975) {
        drops[x] = 0;
      }

      drops[x]++;
    });
  }

  setInterval(drawMatrixRain, 33);

  // Handle resizing
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
</script>


<div id="boot-logs"></div>
<div class="maker-content" style="display:none;">
  <div id="maker-body" class="maker-body-content">
    <button id="exit-maker">Return to Academic Mode</button>
    <br />
    <h3>Welcome to my <i>maker</i> corner of the internet!</h3>
    <p>Outside of research, I love 3D printing, tinkering (& breaking things...) with my homelab, hooking up new sensors for my hedgehog's <i>smart home</i>, repurposing old tech as futuristic decor, and building whatever I can get my hands on. I'm also obsessed with the <i>Ready Player One</i> series -- can you tell with some of the project names?</p>
    <p>Here are some of my more recent side projects:</p>
    <br/>
    <div class="project-grid">
    <div class="project-card">
      <img src="/images/projects/midnight-gunter.jpg" alt="PC: MidnightGunter">
      <div class="content">
        <h3>PC: MidnightGunter</h3>
        <p>
          specs: amd ryzen 9 9950x3d granite, gigabyte x870e aorus elite, asus 5070ti prime OC16gb, flare x5 series 2x 16gb, samsung 9100 pro 2tb, wd blue sn7100 1tb msi mag a850gl pcie5 850w plus gold atx, montech xr tempered glass midtower atx case
        </p>
      </div>
    </div>
    <div class="project-card">
      <img src="/images/projects/reggie.jpg" alt="Reggie's Wheel Dashboard">
      <div class="content">
        <h3>Reggie's Wheel Tracker</h3>
        <p>
          Magnetic reed switch + RPi Zero W + MQTT hosted on my homelab.
        </p>
      </div>
    </div>
    <div class="project-card">
      <img src="/images/projects/oasis.jpg" alt="2025 Homelab">
      <div class="content">
        <h3>OASIS Homelab</h3>
        <p>
          Ubuntu, Pi5 (8gb ram), nvme base duo, 2x WD blue sn580 1tb = OASIS. (my user is parzival ;) )
        </p>
      </div>
    </div>
    <div class="project-card">
      <img src="/images/projects/pcb-wall-art.jpeg" alt="PCB Wall Art">
      <div class="content">
        <h3>PCB Wall Art</h3>
        <p>
          Salvaged parts from laptops and consoles mounted to a painted fence post. Gift to my fiance highlighting important geographical places for us.
        </p>
      </div>
    </div>
    <div class="project-card">
      <img src="/images/projects/pcb-earrings.jpg" alt="PCB Earrings">
      <div class="content">
        <h3>PCB Earrings</h3>
        <p>
          Leftover tiny PCBs became fun custom earrings.
        </p>
      </div>
    </div>
    <div class="project-card">
      <img src="/images/projects/circuitplayground.png" alt="Neon Light Decoration">
      <div class="content">
        <h3>Neon Light Decoration</h3>
        <p>
          Fiber optics + NeoPixels + cardboard = hypnotic light show.
        </p>
      </div>
    </div>
    <div class="project-card">
      <img src="/images/projects/counter.png" alt="Relationship Clock">
      <div class="content">
        <h3>Relationship Clock</h3>
        <p>
          LCD display counting minutes since we started dating. :)
        </p>
      </div>
    </div>
    <div class="project-card">
      <img src="/images/projects/ornaments-2.png" alt="3D Printed Ornaments">
      <div class="content">
        <h3>3D Printed Ornaments</h3>
        <p>
          Custom-designed in TinkerCad & printed with filament swap layers for friends and family.
        </p>
      </div>
    </div>
    <div class="project-card">
      <img src="/images/projects/rickrobot.png" alt="Rick Robot">
      <div class="content">
        <h3>Rick Robot</h3>
        <p>
          Autonomous rover using Pi + CV + voice to fetch objects.
        </p>
        <ul>
          <li><a href="https://summer.hackclub.com/" target="_blank">Hack Club Hardware Grant</a></li>
          <li><a href="https://youtu.be/aRzoo11jABo" target="_blank">Adafruit Show & Tell</a></li>
        </ul>
      </div>
    </div>
    <div class="project-card">
      <img src="/images/projects/tesla.png" alt="TSLA Stock Ticker">
      <div class="content">
        <h3>$TSLA Stock Ticker</h3>
        <p>
          Pi Zero W with LCD1602 pulling data from a stock API in real time.
        </p>
      </div>
    </div>
    <div class="project-card">
      <img src="/images/projects/sense.png" alt="Environmental Room Sensor">
      <div class="content">
        <h3>Room Sensor</h3>
        <p>
          LED-based 'traffic light' feedback on temp/humidity from SHT40.
        </p>
        <ul>
          <li>Green = Good</li>
          <li>Yellow = Fair</li>
          <li>Red = Bad</li>
          <li>White = Error</li>
        </ul>
      </div>
    </div>
    <!-- <p>Often when I'm researching things for side projects I come across other projects I truly admire. Whether it is the concept, implementation, or just something I wish I had thought of. Here are some projects I admire:</p>
    <ul>
      <li>test</li>
    <ul> -->
</div>
