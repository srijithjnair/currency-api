const statusEl = document.getElementById('status');
const refreshBtn = document.getElementById('refreshBtn');
const avgBtn = document.getElementById('avgBtn');
const slippageBtn = document.getElementById('slippageBtn');
const messageEl = document.getElementById('message');
const tbody = document.querySelector('#quotesTable tbody');
const averageResultEl = document.getElementById('averageResult');
const slippageTbody = document.querySelector('#slippageTable tbody');

async function fetchQuotes() {
  statusEl.textContent = 'Loading...';
  messageEl.textContent = '';
  tbody.innerHTML = '';
  // hide results from other sections while loading
  averageResultEl.textContent = '--';
  slippageTbody.innerHTML = '';

  try {
    const res = await fetch('/quotes');
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const quotes = await res.json();

    if (!Array.isArray(quotes) || quotes.length === 0) {
      messageEl.textContent = 'No quotes available.';
      statusEl.textContent = 'Idle';
      return;
    }

    quotes.forEach((q, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${escapeHtml(q.source)}</td>
        <td>${formatNumber(q.buy_price)}</td>
        <td>${formatNumber(q.sell_price)}</td>
      `;
      tbody.appendChild(tr);
    });

    statusEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
  } catch (err) {
    messageEl.textContent = 'Failed to load quotes: ' + err.message;
    statusEl.textContent = 'Error';
  }
}

async function fetchAverage() {
  statusEl.textContent = 'Loading averages...';
  messageEl.textContent = '';
  averageResultEl.textContent = '';
  try {
    const res = await fetch('/average');
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();

    averageResultEl.textContent = `Buy: ${formatNumber(data.average_buy_price)}  •  Sell: ${formatNumber(data.average_sell_price)}  •  Sources: ${data.total_sources}`;
    statusEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
  } catch (err) {
    averageResultEl.textContent = 'Failed to load averages.';
    messageEl.textContent = 'Failed to load averages: ' + err.message;
    statusEl.textContent = 'Error';
  }
}

async function fetchSlippage() {
  statusEl.textContent = 'Loading slippage...';
  messageEl.textContent = '';
  slippageTbody.innerHTML = '';
  try {
    const res = await fetch('/slippage');
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();

    const slippage = data.slippage || [];
    if (!Array.isArray(slippage) || slippage.length === 0) {
      messageEl.textContent = 'No slippage data available.';
      statusEl.textContent = 'Idle';
      return;
    }

    slippage.forEach((s, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${escapeHtml(s.source)}</td>
        <td>${formatNumber(s.buy_price_slippage)}</td>
        <td>${formatNumber(s.sell_price_slippage)}</td>
      `;
      slippageTbody.appendChild(tr);
    });

    statusEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
  } catch (err) {
    messageEl.textContent = 'Failed to load slippage: ' + err.message;
    statusEl.textContent = 'Error';
  }
}

function formatNumber(n) {
  return typeof n === 'number' ? n.toFixed(4) : n;
}

function escapeHtml(s) {
  if (typeof s !== 'string') return s;
  return s.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
}

refreshBtn.addEventListener('click', fetchQuotes);
avgBtn.addEventListener('click', fetchAverage);
slippageBtn.addEventListener('click', fetchSlippage);

// Auto-load quotes on page open
fetchQuotes();
