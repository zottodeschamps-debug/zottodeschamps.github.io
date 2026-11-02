(() => {
  const servingsOutput = document.querySelector('#servings-output');
  const servingsLabel = document.querySelector('#servings-label');
  const amounts = [...document.querySelectorAll('.amount[data-base]')];
  const scaledInstructions = [...document.querySelectorAll('.scaled[data-base]')];
  const checks = [...document.querySelectorAll('.ingredients-list input[type="checkbox"]')];
  let servings = 4;

  // Format scaled amounts with French decimal and plural conventions.
  function formatAmount(value, unit) {
    const rounded = Math.round(value * 100) / 100;
    const number = Number.isInteger(rounded) ? String(rounded) : String(rounded).replace('.', ',');
    if (!unit) return number;
    if (unit === 'litre') return `${number} ${rounded > 1 ? 'litres' : 'litre'}`;
    if (unit === 'gousses') return `${number} ${rounded > 1 ? 'gousses' : 'gousse'}`;
    if (unit === 'petite cuillère') return `${number} ${rounded > 1 ? 'petites cuillères' : 'petite cuillère'}`;
    if (unit === 'cuillères à soupe') return `${number} ${rounded > 1 ? 'cuillères à soupe' : 'cuillère à soupe'}`;
    return `${number} ${unit}`;
  }

  function updateServings() {
    servingsOutput.value = servings;
    servingsOutput.textContent = servings;
    servingsLabel.textContent = servings;
    amounts.forEach((item) => {
      const scaled = Number(item.dataset.base) * servings / 4;
      item.textContent = formatAmount(scaled, item.dataset.unit);
    });
    scaledInstructions.forEach((item) => {
      const scaled = Number(item.dataset.base) * servings / 4;
      item.textContent = formatAmount(scaled, item.dataset.unit);
    });
  }

  document.querySelector('#servings-minus').addEventListener('click', () => {
    if (servings > 1) { servings -= 1; updateServings(); }
  });
  document.querySelector('#servings-plus').addEventListener('click', () => {
    if (servings < 24) { servings += 1; updateServings(); }
  });

  function updateProgress() {
    const ready = checks.filter((input) => input.checked).length;
    document.querySelector('#progress-label').textContent = `${ready} / ${checks.length} préparés`;
    document.querySelector('#progress-fill').style.width = `${checks.length ? ready / checks.length * 100 : 0}%`;
  }
  checks.forEach((input) => input.addEventListener('change', updateProgress));

  document.querySelector('#print-recipe').addEventListener('click', () => window.print());

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
})();
