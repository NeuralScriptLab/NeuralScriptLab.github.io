// 1. Multi-Layer 3D Depth Physics
const layerBg = document.getElementById('layerBg');
const layerMid = document.getElementById('layerMid');
const layerFore = document.getElementById('layerFore');

let isScheduled = false;

window.addEventListener('scroll', () => {
  if (!isScheduled) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      // Layer 1: Background gentle scale
      const bgScale = 1 + scrollY * 0.0003;
      const bgTranslate = scrollY * 0.04;
      layerBg.style.transform = `scale(${bgScale}) translateY(${bgTranslate}px)`;

      // Layer 2: Midground zoom
      const midScale = 1 + scrollY * 0.0007;
      const midTranslate = scrollY * 0.1;
      layerMid.style.transform = `scale(${midScale}) translateY(${midTranslate}px)`;

      // Layer 3: Foreground rapid zoom dive
      const foreScale = 1 + scrollY * 0.0016;
      const foreTranslate = scrollY * 0.22;
      const foreOpacity = Math.max(0, 0.35 - scrollY * 0.0005);
      
      layerFore.style.transform = `scale(${foreScale}) translateY(${foreTranslate}px)`;
      layerFore.style.opacity = foreOpacity;

      isScheduled = false;
    });

    isScheduled = true;
  }
});

// 2. Real-Time Search Filtering
const searchInput = document.getElementById('searchInput');
const articleCards = document.querySelectorAll('.article-card');

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();

  articleCards.forEach((card) => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    const summary = card.querySelector('.card-summary').textContent.toLowerCase();

    if (title.includes(query) || summary.includes(query)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
});

// 3. Category Filter Buttons
const catButtons = document.querySelectorAll('.cat-pill');

catButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    catButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    articleCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

