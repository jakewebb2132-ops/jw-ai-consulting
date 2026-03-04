import './style.css';


document.querySelector('#app').innerHTML = `
  <section id="home" class="hero-section">
    <canvas id="neural-canvas"></canvas>
    <div class="hero-content">
      <div class="badge fade-up">JW AI Consulting</div>
      <h1 class="hero-title fade-up" style="animation-delay: 0.1s">
        Architecting the Intelligence Layer of Modern Enterprise.
      </h1>
      <p class="hero-subtitle fade-up" style="animation-delay: 0.2s">
        Bridging Human Vision with Machine Intelligence. We build competitive advantages through bespoke AI ecosystems that scale with human ambition.
      </p>
      <div class="hero-actions fade-up" style="animation-delay: 0.3s">
        <a href="#services" class="btn btn-primary">
          Explore Services
          <i class="ph-light ph-caret-right"></i>
        </a>
        <a href="#contact" class="btn btn-secondary glass-btn">Book a Discovery Call</a>
      </div>
    </div>
  </section>

  <section id="services" class="services-section">
    <div class="section-container">
      <div class="section-header fade-up">
        <h2 class="section-title">Core Service Pillars</h2>
        <p class="section-subtitle">Transforming fragmented workflows into cohesive, AI-driven operations.</p>
      </div>
      <div class="services-grid">
        <div class="glass-card service-card fade-up" style="animation-delay: 0.1s">
          <div class="card-icon"><i class="ph-light ph-map-trifold"></i></div>
          <h3>Strategic AI Roadmap & Advisory</h3>
          <p>Beyond the hype, into the architecture. We audit your technical landscape to design a multi-year AI integration roadmap.</p>
        </div>
        <div class="glass-card service-card fade-up" style="animation-delay: 0.2s">
          <div class="card-icon"><i class="ph-light ph-cpu"></i></div>
          <h3>Bespoke LLM Engineering</h3>
          <p>Your data is your competitive moat. We build, fine-tune, and deploy custom Large Language Models tailored to your industry.</p>
        </div>
        <div class="glass-card service-card fade-up" style="animation-delay: 0.3s">
          <div class="card-icon"><i class="ph-light ph-robot"></i></div>
          <h3>Intelligent Process Automation</h3>
          <p>Scaling without the friction of headcount. Transform fragmented workflows into cohesive, autonomous operations.</p>
        </div>
        <div class="glass-card service-card fade-up" style="animation-delay: 0.4s">
          <div class="card-icon"><i class="ph-light ph-tree-structure"></i></div>
          <h3>Enterprise Data Synthesis</h3>
          <p>Turning fragmented data into actionable intelligence. We architect the middleware required to make your enterprise data "AI-ready."</p>
        </div>
      </div>
    </div>
  </section>
`;



// Neural Canvas Background Logic
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    // Set height to parent section height
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.4)'; // subtle blue accent
      ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      // Only draw connections, skip dots for cleaner look or draw subtle dots

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - dist / 120) * 0.2})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// Entrance Reveal Animations (Simulating Framer Motion)
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animating in to keep it visible
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  elements.forEach(el => observer.observe(el));
}

// Initialize scripts
initNeuralCanvas();
initScrollAnimations();
