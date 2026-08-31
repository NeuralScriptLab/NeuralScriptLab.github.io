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
// Every card is rendered from data/articles.json. A category page reads its
// own "category" key off <body data-category="..."> and simply filters the
// same JSON feed — so a brand-new article dropped into articles.json shows
// up automatically, already wearing that section's theme (the theme lives
// in CSS variables the cards inherit, nothing to re-style by hand).

function createArticleCardHTML(article, headingTag) {
  const tag = headingTag || 'h3';
  return `
    <article class="article-card" data-category="${article.category}">
      <div class="card-meta">
        <span class="card-tag">${article.categoryLabel}</span>
        <span class="card-date">${article.date} • ${article.readTime}</span>
      </div>
      <${tag} class="card-title">
        <a href="${article.url}">${article.title}</a>
      </${tag}>
      <p class="card-summary">${article.summary}</p>
      <div class="card-footer">
        <a href="${article.url}" class="read-more">Read Guide →</a>
      </div>
    </article>
  `;
}

function articlesJsonPath() {
  // Category pages live one folder down, in /categories/
  return document.body.dataset.category ? '../data/articles.json' : 'data/articles.json';
}

async function loadArticles() {
  const container = document.getElementById('articles');
  if (!container) return;

  const category = document.body.dataset.category; // set on category pages only
  const countBadge = document.getElementById('articleCount');

  try {
    const response = await fetch(articlesJsonPath());
    if (!response.ok) throw new Error('Failed to load articles');
    const allArticles = await response.json();

    let toRender;
    if (category) {
      // Category page: show every article whose "category" field matches,
      // newest first.
      toRender = allArticles.filter(a => a.category === category);
      if (countBadge) {
        countBadge.textContent = `${toRender.length} Guide${toRender.length === 1 ? '' : 's'} Available`;
      }
      container.innerHTML = toRender.length
        ? toRender.map(a => createArticleCardHTML(a, 'h2')).join('')
        : `<p style="color:var(--text-muted)">No guides published in this section yet — check back soon.</p>`;
    } else {
      // Homepage: show the 3 most recent articles across all categories.
      toRender = allArticles.slice(0, 3);
      container.innerHTML = toRender.map(a => createArticleCardHTML(a, 'h3')).join('');
    }
  } catch (err) {
    console.error('Error fetching articles:', err);
    container.innerHTML = `<p style="color:var(--text-muted)">Unable to fetch articles right now.</p>`;
  }
}

// 3. Real-Time Search Filtering (works on whichever cards are on the page)
const searchInput = document.getElementById('searchInput');

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const allCards = document.querySelectorAll('.article-card');

    allCards.forEach((card) => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      const summary = card.querySelector('.card-summary').textContent.toLowerCase();

      card.style.display = (title.includes(query) || summary.includes(query)) ? 'flex' : 'none';
    });
  });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', loadArticles);
