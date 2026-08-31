// 1. Multi-Layer 3D Depth Physics
const layerBg = document.getElementById('layerBg');
const layerMid = document.getElementById('layerMid');
const layerFore = document.getElementById('layerFore');

let isScheduled = false;

window.addEventListener('scroll', () => {
  if (!isScheduled) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      const bgScale = 1 + scrollY * 0.0003;
      const bgTranslate = scrollY * 0.04;
      layerBg.style.transform = `scale(${bgScale}) translateY(${bgTranslate}px)`;

      const midScale = 1 + scrollY * 0.0007;
      const midTranslate = scrollY * 0.1;
      layerMid.style.transform = `scale(${midScale}) translateY(${midTranslate}px)`;

      const foreScale = 1 + scrollY * 0.0016;
      const foreTranslate = scrollY * 0.22;
      const foreOpacity = Math.max(0, 0.3 - scrollY * 0.0005);
      
      layerFore.style.transform = `scale(${foreScale}) translateY(${foreTranslate}px)`;
      layerFore.style.opacity = foreOpacity;

      isScheduled = false;
    });

    isScheduled = true;
  }
});

// 2. Dynamic Articles Engine (JSON Connected)
let allArticlesData = [];

function createArticleCardHTML(article) {
  return `
    <article class="article-card" data-category="${article.category}">
      <div class="card-meta">
        <span class="card-tag">${article.categoryLabel}</span>
        <span class="card-date">${article.date} • ${article.readTime}</span>
      </div>
      <h3 class="card-title">
        <a href="${article.url}">${article.title}</a>
      </h3>
      <p class="card-summary">${article.summary}</p>
      <div class="card-footer">
        <a href="${article.url}" class="read-more">Read Guide →</a>
      </div>
    </article>
  `;
}

async function loadArticles() {
  const latestContainer = document.getElementById('latestFeedContainer');
  const mainContainer = document.getElementById('mainFeedContainer');

  try {
    const response = await fetch('data/articles.json');
    if (!response.ok) throw new Error('Failed to load articles');
    allArticlesData = await response.json();

    // 1. Render Top 3 Latest Articles
    const latestArticles = allArticlesData.slice(0, 3);
    latestContainer.innerHTML = latestArticles.map(createArticleCardHTML).join('');

    // 2. Render All Articles in Main Feed
    mainContainer.innerHTML = allArticlesData.map(createArticleCardHTML).join('');
  } catch (err) {
    console.error('Error fetching articles:', err);
    latestContainer.innerHTML = `<p style="color:#94a3b8">Unable to fetch latest updates.</p>`;
  }
}

// 3. Real-Time Search Filtering
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  const allCards = document.querySelectorAll('.article-card');

  allCards.forEach((card) => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    const summary = card.querySelector('.card-summary').textContent.toLowerCase();

    if (title.includes(query) || summary.includes(query)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
});

// 4. Category Filter Buttons
const catButtons = document.querySelectorAll('.cat-pill');

catButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    catButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    const mainContainerCards = document.querySelectorAll('#mainFeedContainer .article-card');

    mainContainerCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', loadArticles);

