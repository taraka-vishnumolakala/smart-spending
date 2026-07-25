const transactions = [
  {
    date: "2026-07-24",
    merchant: "Starbucks",
    initials: "ST",
    category: "Dining",
    account: "Amex Blue Cash",
    confidence: 99,
    amount: 6.75,
    recurring: false,
  },
  {
    date: "2026-07-24",
    merchant: "Whole Foods Market",
    initials: "WF",
    category: "Groceries",
    account: "Amex Blue Cash",
    confidence: 99,
    amount: 87.64,
    recurring: false,
  },
  {
    date: "2026-07-23",
    merchant: "Uber",
    initials: "UB",
    category: "Transport",
    account: "Chase Checking",
    confidence: 96,
    amount: 18.36,
    recurring: false,
  },
  {
    date: "2026-07-22",
    merchant: "Amazon",
    initials: "AM",
    category: "Shopping",
    account: "Capital One",
    confidence: 88,
    amount: 142.19,
    recurring: false,
  },
  {
    date: "2026-07-21",
    merchant: "AT&T",
    initials: "AT",
    category: "Bills",
    account: "Chase Checking",
    confidence: 99,
    amount: 66.99,
    recurring: true,
  },
  {
    date: "2026-07-19",
    merchant: "Trader Joe's",
    initials: "TJ",
    category: "Groceries",
    account: "Amex Blue Cash",
    confidence: 99,
    amount: 64.22,
    recurring: false,
  },
  {
    date: "2026-07-17",
    merchant: "Netflix",
    initials: "N",
    category: "Entertainment",
    account: "Capital One",
    confidence: 99,
    amount: 22.99,
    recurring: true,
  },
  {
    date: "2026-07-14",
    merchant: "Target",
    initials: "TG",
    category: "Shopping",
    account: "Capital One",
    confidence: 82,
    amount: 96.48,
    recurring: false,
  },
  {
    date: "2026-07-12",
    merchant: "Sweetgreen",
    initials: "SG",
    category: "Dining",
    account: "Amex Blue Cash",
    confidence: 95,
    amount: 19.84,
    recurring: false,
  },
  {
    date: "2026-07-08",
    merchant: "Spotify",
    initials: "SP",
    category: "Entertainment",
    account: "Chase Checking",
    confidence: 99,
    amount: 11.99,
    recurring: true,
  },
  {
    date: "2026-07-05",
    merchant: "Shell",
    initials: "SH",
    category: "Transport",
    account: "Amex Blue Cash",
    confidence: 91,
    amount: 48.17,
    recurring: false,
  },
  {
    date: "2026-07-02",
    merchant: "Con Edison",
    initials: "CE",
    category: "Bills",
    account: "Chase Checking",
    confidence: 99,
    amount: 118.42,
    recurring: true,
  },
  {
    date: "2026-06-27",
    merchant: "Costco",
    initials: "CO",
    category: "Groceries",
    account: "Amex Blue Cash",
    confidence: 97,
    amount: 132.46,
    recurring: false,
  },
  {
    date: "2026-06-21",
    merchant: "DoorDash",
    initials: "DD",
    category: "Dining",
    account: "Capital One",
    confidence: 95,
    amount: 58.32,
    recurring: false,
  },
  {
    date: "2026-06-14",
    merchant: "Apple Music",
    initials: "AM",
    category: "Entertainment",
    account: "Chase Checking",
    confidence: 99,
    amount: 10.99,
    recurring: true,
  },
  {
    date: "2026-06-08",
    merchant: "CVS Pharmacy",
    initials: "CV",
    category: "Shopping",
    account: "Capital One",
    confidence: 76,
    amount: 38.72,
    recurring: false,
  },
];

const categoryColors = {
  Dining: "#16aa79",
  Groceries: "#38aeba",
  Shopping: "#e79512",
  Transport: "#f16c61",
  Bills: "#4e98d9",
  Entertainment: "#8f7ccf",
};

const chartData = {
  july: {
    current: [110, 335, 470, 620, 730, 1010, 1290, 1460, 1810, 2190, 2510, 2890, 3160, 3460, 3820, 4280],
    previous: [160, 410, 620, 850, 1090, 1360, 1620, 1940, 2270, 2620, 2980, 3370, 3760, 4140, 4460, 4650],
    labels: ["Jul 1", "Jul 7", "Jul 13", "Jul 19", "Jul 25", "Jul 31"],
  },
  june: {
    current: [160, 410, 620, 850, 1090, 1360, 1620, 1940, 2270, 2620, 2980, 3370, 3760, 4140, 4460, 4650],
    previous: [130, 360, 590, 810, 1050, 1280, 1550, 1780, 2110, 2450, 2810, 3200, 3510, 3870, 4210, 4490],
    labels: ["Jun 1", "Jun 7", "Jun 13", "Jun 19", "Jun 25", "Jun 30"],
  },
  all: {
    current: [350, 690, 980, 1350, 1760, 2290, 2840, 3470, 4150, 4970, 5730, 6510, 7280, 8010, 8460, 8930],
    previous: [400, 780, 1180, 1590, 2010, 2570, 3120, 3690, 4280, 4930, 5610, 6320, 7010, 7680, 8230, 8690],
    labels: ["Jun 1", "Jun 13", "Jun 25", "Jul 7", "Jul 19", "Jul 31"],
  },
};

const els = {
  date: document.querySelector("#dateFilter"),
  account: document.querySelector("#accountFilter"),
  category: document.querySelector("#categoryFilter"),
  search: document.querySelector("#searchFilter"),
  rows: document.querySelector("#transactionRows"),
  empty: document.querySelector("#emptyState"),
  resultCount: document.querySelector("#resultCount"),
  tableSummary: document.querySelector("#tableSummary"),
  totalSpending: document.querySelector("#totalSpending"),
  totalIncome: document.querySelector("#totalIncome"),
  totalSaved: document.querySelector("#totalSaved"),
  totalRecurring: document.querySelector("#totalRecurring"),
  savingsRate: document.querySelector("#savingsRate"),
  donutTotal: document.querySelector("#donutTotal"),
  donut: document.querySelector("#categoryDonut"),
  categoryList: document.querySelector("#categoryList"),
  contextButton: document.querySelector("#contextButton"),
  canvas: document.querySelector("#trendChart"),
  toast: document.querySelector("#toast"),
  uploadDialog: document.querySelector("#uploadDialog"),
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const moneyDetailed = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function filterTransactions() {
  const query = els.search.value.trim().toLowerCase();

  return transactions.filter((transaction) => {
    const month = transaction.date.slice(0, 7);
    const dateMatches =
      els.date.value === "all" ||
      (els.date.value === "july" && month === "2026-07") ||
      (els.date.value === "june" && month === "2026-06");
    const accountMatches =
      els.account.value === "all" || transaction.account === els.account.value;
    const categoryMatches =
      els.category.value === "all" || transaction.category === els.category.value;
    const searchMatches =
      !query ||
      transaction.merchant.toLowerCase().includes(query) ||
      transaction.category.toLowerCase().includes(query) ||
      transaction.account.toLowerCase().includes(query);

    return dateMatches && accountMatches && categoryMatches && searchMatches;
  });
}

function renderTable(rows) {
  els.rows.innerHTML = rows
    .map(
      (transaction) => `
        <tr>
          <td>${new Date(`${transaction.date}T12:00:00`).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}</td>
          <td>
            <span class="merchant-cell">
              <span class="merchant-logo">${transaction.initials}</span>
              ${transaction.merchant}
            </span>
          </td>
          <td>
            <span class="category-chip category-${transaction.category}">
              ${transaction.category}
            </span>
          </td>
          <td>${transaction.account}</td>
          <td>
            <span class="confidence ${transaction.confidence >= 90 ? "high" : "medium"}">
              ${transaction.confidence}%
            </span>
          </td>
          <td class="amount-column">${moneyDetailed.format(transaction.amount)}</td>
        </tr>
      `,
    )
    .join("");

  els.empty.hidden = rows.length > 0;
  els.resultCount.textContent = `${rows.length} transaction${rows.length === 1 ? "" : "s"}`;
  els.tableSummary.textContent = `Showing ${rows.length} of ${transactions.length} transactions`;
}

function renderSummary(rows) {
  const visibleTotal = rows.reduce((sum, item) => sum + item.amount, 0);
  const isDefaultView =
    els.date.value === "july" &&
    els.account.value === "all" &&
    els.category.value === "all" &&
    !els.search.value;

  const spending = isDefaultView ? 4280 : visibleTotal;
  const income = els.date.value === "june" ? 7480 : els.date.value === "all" ? 15330 : 7850;
  const saved = Math.max(0, income - spending);
  const recurring = rows
    .filter((item) => item.recurring)
    .reduce((sum, item) => sum + item.amount, 0);

  els.totalSpending.textContent = money.format(spending);
  els.totalIncome.textContent = money.format(income);
  els.totalSaved.textContent = money.format(saved);
  els.totalRecurring.textContent = money.format(isDefaultView ? 286 : recurring);
  els.savingsRate.textContent = `${income ? Math.round((saved / income) * 100) : 0}% savings rate`;
  els.donutTotal.textContent = money.format(spending);
}

function renderCategories(rows) {
  const totals = rows.reduce((accumulator, transaction) => {
    accumulator[transaction.category] =
      (accumulator[transaction.category] || 0) + transaction.amount;
    return accumulator;
  }, {});

  const ordered = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const rawTotal = ordered.reduce((sum, [, value]) => sum + value, 0);
  const chartTotal = rawTotal || 1;
  let progress = 0;
  const gradient = ordered.map(([category, value]) => {
    const start = progress;
    progress += (value / chartTotal) * 100;
    return `${categoryColors[category]} ${start}% ${progress}%`;
  });

  els.donut.style.background = gradient.length
    ? `conic-gradient(${gradient.join(",")})`
    : "#e8edf2";

  els.categoryList.innerHTML = ordered.length
    ? ordered
        .map(
          ([category, value]) => `
            <div class="category-row">
              <i style="background:${categoryColors[category]}"></i>
              <span>${category}</span>
              <strong>
                ${money.format(value)}
                <small>${Math.round((value / chartTotal) * 100)}%</small>
              </strong>
            </div>
          `,
        )
        .join("")
    : `<span class="result-count">No category data</span>`;
}

function getContextLabel() {
  const dateText = els.date.options[els.date.selectedIndex].text;
  const accountText =
    els.account.value === "all" ? "All accounts" : els.account.value;
  return `${dateText.replace(" 2026", "")} · ${accountText}`;
}

function renderContext() {
  els.contextButton.textContent = getContextLabel();
}

function drawChart() {
  const canvas = els.canvas;
  const bounds = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = bounds.width * ratio;
  canvas.height = bounds.height * ratio;

  const context = canvas.getContext("2d");
  context.scale(ratio, ratio);
  const width = bounds.width;
  const height = bounds.height;
  const padding = { top: 16, right: 12, bottom: 30, left: 45 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const data = chartData[els.date.value];
  const maximum = Math.ceil(Math.max(...data.current, ...data.previous) / 1000) * 1000;

  context.clearRect(0, 0, width, height);
  context.font = "10px Lato, -apple-system, sans-serif";
  context.lineWidth = 1;

  for (let index = 0; index <= 4; index += 1) {
    const y = padding.top + (plotHeight / 4) * index;
    const value = maximum - (maximum / 4) * index;
    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(width - padding.right, y);
    context.strokeStyle = "#e8edf2";
    context.stroke();
    context.fillStyle = "#7b8798";
    context.textAlign = "right";
    context.fillText(value === 0 ? "$0" : `$${Math.round(value / 1000)}k`, padding.left - 8, y + 3);
  }

  data.labels.forEach((label, index) => {
    const x = padding.left + (plotWidth / (data.labels.length - 1)) * index;
    context.fillStyle = "#7b8798";
    context.textAlign = index === 0 ? "left" : index === data.labels.length - 1 ? "right" : "center";
    context.fillText(label, x, height - 8);
  });

  const makePoints = (series) =>
    series.map((value, index) => ({
      x: padding.left + (plotWidth / (series.length - 1)) * index,
      y: padding.top + plotHeight - (value / maximum) * plotHeight,
    }));

  const drawLine = (points, color, widthValue) => {
    context.beginPath();
    points.forEach((point, index) => {
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    });
    context.strokeStyle = color;
    context.lineWidth = widthValue;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.stroke();
  };

  const currentPoints = makePoints(data.current);
  const previousPoints = makePoints(data.previous);
  drawLine(previousPoints, "#aeb8c6", 1.5);

  const gradient = context.createLinearGradient(0, padding.top, 0, height);
  gradient.addColorStop(0, "rgba(7, 150, 103, 0.18)");
  gradient.addColorStop(1, "rgba(7, 150, 103, 0)");
  context.beginPath();
  currentPoints.forEach((point, index) => {
    if (index === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  });
  context.lineTo(currentPoints.at(-1).x, padding.top + plotHeight);
  context.lineTo(currentPoints[0].x, padding.top + plotHeight);
  context.closePath();
  context.fillStyle = gradient;
  context.fill();

  drawLine(currentPoints, "#079667", 2.4);
  currentPoints.forEach((point, index) => {
    if (index % 3 !== 0 && index !== currentPoints.length - 1) return;
    context.beginPath();
    context.arc(point.x, point.y, 3, 0, Math.PI * 2);
    context.fillStyle = "#ffffff";
    context.fill();
    context.strokeStyle = "#079667";
    context.lineWidth = 2;
    context.stroke();
  });
}

function updateDashboard() {
  const filtered = filterTransactions();
  renderTable(filtered);
  renderSummary(filtered);
  renderCategories(filtered);
  renderContext();
  drawChart();
}

function showToast(text) {
  els.toast.textContent = text;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 2200);
}

function addMessage(content, type) {
  const message = document.createElement("div");
  message.className = `message ${type === "user" ? "user-message" : "assistant-message"}`;
  message.innerHTML =
    type === "user"
      ? `<p></p>`
      : `<div class="message-author">Spending Assistant</div><p></p>`;
  message.querySelector("p").textContent = content;
  document.querySelector("#chatMessages").append(message);
  message.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function assistantReply(question) {
  const normalized = question.toLowerCase();
  const rows = filterTransactions();
  const filteredTotal = rows.reduce((sum, item) => sum + item.amount, 0);

  if (normalized.includes("save") || normalized.includes("$300")) {
    return "A realistic $300 target is: $140 less shopping, $90 less dining, and cancel one overlapping music subscription for about $11. The remaining $59 could come from setting a weekly discretionary limit.";
  }

  if (normalized.includes("subscription") || normalized.includes("cancel")) {
    return "You have 9 recurring charges totaling about $286. Spotify and Apple Music overlap; reviewing those first could save roughly $11 each month.";
  }

  if (normalized.includes("shopping") || normalized.includes("increase")) {
    return "Shopping increased by $184 compared with June. Amazon and Target explain 72% of that change, led by purchases on July 14 and July 22.";
  }

  if (normalized.includes("dining") || normalized.includes("restaurant")) {
    return "Dining is down 18% from June. Fewer delivery orders saved about $246, while coffee and quick-service meals stayed nearly flat.";
  }

  return `The current filters include ${rows.length} transactions totaling ${moneyDetailed.format(filteredTotal)}. Try asking about a category, subscriptions, a monthly change, or a savings target.`;
}

document
  .querySelectorAll("#dateFilter, #accountFilter, #categoryFilter")
  .forEach((element) => element.addEventListener("change", updateDashboard));
els.search.addEventListener("input", updateDashboard);
window.addEventListener("resize", drawChart);
document.fonts?.ready.then(drawChart);

document.querySelector("#resetFilters").addEventListener("click", () => {
  els.date.value = "july";
  els.account.value = "all";
  els.category.value = "all";
  els.search.value = "";
  updateDashboard();
});

document.querySelector("#uploadButton").addEventListener("click", () => {
  els.uploadDialog.showModal();
});

document.querySelector("#exportButton").addEventListener("click", () => {
  showToast("Export is represented in this mockup; no file was created.");
});

document.querySelector("#reviewButton").addEventListener("click", () => {
  els.search.value = "";
  showToast("The production app would open the three uncertain transactions.");
});

document.querySelector("#contextButton").addEventListener("click", () => {
  document.querySelector(".filters").scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelector("#chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#chatInput");
  const question = input.value.trim();
  if (!question) return;
  addMessage(question, "user");
  input.value = "";
  window.setTimeout(() => addMessage(assistantReply(question), "assistant"), 280);
});

document.querySelectorAll(".suggested-prompts button").forEach((button) => {
  button.addEventListener("click", () => {
    addMessage(button.textContent, "user");
    window.setTimeout(
      () => addMessage(assistantReply(button.textContent), "assistant"),
      280,
    );
  });
});

document.querySelector("#clearChat").addEventListener("click", () => {
  document.querySelector("#chatMessages").innerHTML = `
    <div class="message assistant-message">
      <div class="message-author">Spending Assistant</div>
      <p>Conversation cleared. What would you like to understand about your spending?</p>
    </div>
  `;
});

updateDashboard();
