const BUTTERBASE_APP_ID = "app_4miwoz3b7e23";
const BUTTERBASE_API_KEY = "bb_sk_465de144dc744e0b1bf6a1dc972fb92ab21b9797";
const TABLE_NAME = "trip_wishlists";
const BUTTERBASE_URL = `https://api.butterbase.ai/v1/${BUTTERBASE_APP_ID}`;

const STEPS = [
  "Finding places of interest",
  "Finding flights",
  "Finding hotels",
  "Finding restaurants",
  "Finding photography spots",
  "Generating your personalized plan",
];

const STEP_DELAY = 1500; // ms per step
const FINAL_STEP_DELAY = 2000; // ms for the last "generating" step

document.getElementById("wishlistForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const destination = document.getElementById("destination").value.trim();
  const email = document.getElementById("email").value.trim();

  // Fire-and-forget POST to Butterbase (real data capture, no await)
  fetch(`${BUTTERBASE_URL}/${TABLE_NAME}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${BUTTERBASE_API_KEY}`,
    },
    body: JSON.stringify({
      destination,
      email,
      created_at: new Date().toISOString(),
      source: "builders-of-tomorrow-2026",
    }),
  }).catch(() => {}); // silently ignore errors

  // Replace form section with loading animation
  const wishlistSection = document.getElementById("wishlist");
  wishlistSection.innerHTML = buildLoader(destination);

  // Tick through steps, then navigate to plan
  await runSteps();
  window.location.href = "plan.html";
});

function buildLoader(destination) {
  const stepsHtml = STEPS.map((label, i) => {
    const isLast = i === STEPS.length - 1;
    return `
      <div class="step-row" id="step-${i}">
        <span class="step-icon" id="icon-${i}">○</span>
        <span class="step-label ${isLast ? "step-label--final" : ""}">${label}</span>
      </div>`;
  }).join("");

  return `
    <div class="loader-wrap">
      <div class="loader-heading">
        <span class="loader-spinner"></span>
        Planning your trip to <strong>${destination}</strong>…
      </div>
      <div class="loader-steps">${stepsHtml}</div>
    </div>`;
}

async function runSteps() {
  for (let i = 0; i < STEPS.length; i++) {
    const isLast = i === STEPS.length - 1;
    const delay = isLast ? FINAL_STEP_DELAY : STEP_DELAY;

    // Animate current step icon
    const icon = document.getElementById(`icon-${i}`);
    if (icon) icon.textContent = "◌";

    await sleep(delay);

    if (icon) {
      icon.textContent = "✓";
      icon.classList.add("step-icon--done");
    }
  }
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
