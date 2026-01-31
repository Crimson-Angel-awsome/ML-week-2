/* =========================
   CONFIG
   ========================= */
const API_BASE = "http://localhost:5000";

let grooveScore = 42;
let trendData = [50, 48, 46, 45, 44, 43, 42];
let selectedBusinessId = null;

const scoreEl = document.getElementById("score");
const moodEl = document.getElementById("mood");
const businessSelect = document.getElementById("businessSelect");

/* =========================
   GET BUSINESSES
   ========================= */
async function loadBusinesses() {
  try {
    const res = await fetch(`${API_BASE}/businesses/`);

    if (!res.ok) throw new Error("Failed to fetch businesses");

    const data = await res.json();
    const businesses = Array.isArray(data) ? data : data.businesses;

    businessSelect.innerHTML = "";

    if (!businesses || businesses.length === 0) {
      businessSelect.innerHTML = "<option>No businesses available</option>";
      return;
    }

    businesses.forEach(business => {
      const option = document.createElement("option");
      option.value = business.id;
      option.textContent = business.name;
      businessSelect.appendChild(option);
    });

    selectedBusinessId = businessSelect.value;
  } catch (error) {
    console.error(error);
    businessSelect.innerHTML =
      "<option>Error loading businesses</option>";
  }
}

businessSelect.addEventListener("change", e => {
  selectedBusinessId = e.target.value;
});

/* =========================
   REQUEST BUSINESS REVIEW
   ========================= */
async function requestReview() {
  if (!selectedBusinessId) return;

  try {
    await fetch(`${API_BASE}/businesses/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_id: selectedBusinessId })
    });
  } catch (error) {
    console.error("Failed to request review:", error);
  }
}

/* =========================
   CHART
   ========================= */
const ctx = document.getElementById("trendChart").getContext("2d");
const trendChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Day 1","Day 5","Day 10","Day 15","Day 20","Day 25","Today"],
    datasets: [{
      data: trendData,
      borderColor: "#7c5cff",
      tension: 0.4
    }]
  },
  options: {
    plugins: { legend: { display: false } },
    scales: { y: { min: 0, max: 100 } }
  }
});

/* =========================
   SUBMIT REVIEW
   ========================= */
async function submitComment() {
  const commentInput = document.getElementById("commentInput");
  const comment = commentInput.value.trim();

  if (!comment || !selectedBusinessId) return;

  const sentiment = analyzeSentiment(comment);

  if (sentiment === "positive") grooveScore += 2;
  if (sentiment === "negative") grooveScore -= 2;

  grooveScore = Math.max(0, Math.min(100, grooveScore));

  trendData.push(grooveScore);
  trendData.shift();

  scoreEl.textContent = grooveScore;
  moodEl.textContent =
    grooveScore > 70 ? "Great" :
    grooveScore > 40 ? "Mixed" : "Poor";

  trendChart.update();
  addComment(comment, sentiment);

  try {
    await fetch(`${API_BASE}/reviews/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_id: selectedBusinessId,
        review: comment,
        sentiment: sentiment,
        groove_score: grooveScore
      })
    });
  } catch (error) {
    console.error("Failed to submit review:", error);
  }

  commentInput.value = "";
}

/* =========================
   SENTIMENT (TEMP LOGIC)
   ========================= */
function analyzeSentiment(text) {
  const positive = ["good", "great", "amazing", "excellent", "nice"];
  const negative = ["bad", "terrible", "poor", "worst", "slow"];

  const t = text.toLowerCase();
  if (positive.some(w => t.includes(w))) return "positive";
  if (negative.some(w => t.includes(w))) return "negative";
  return "neutral";
}

/* =========================
   UI HELPERS
   ========================= */
function addComment(text, sentiment) {
  const li = document.createElement("li");
  li.textContent = `${sentiment.toUpperCase()}: ${text}`;
  document.getElementById("commentList").appendChild(li);
}

/* =========================
   INIT
   ========================= */
loadBusinesses();