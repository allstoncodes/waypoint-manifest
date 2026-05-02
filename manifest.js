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

const STEP_DELAY = 1500;
const FINAL_STEP_DELAY = 2000;

document.getElementById("wishlistForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const tripDescription = document.getElementById("destination").value.trim();

  // Fire-and-forget to Butterbase (real data capture)
  fetch(`${BUTTERBASE_URL}/${TABLE_NAME}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${BUTTERBASE_API_KEY}`,
    },
    body: JSON.stringify({
      destination: tripDescription,
      email: "",
      created_at: new Date().toISOString(),
      source: "builders-of-tomorrow-2026",
    }),
  }).catch(() => {});

  // Replace form with loading animation
  document.getElementById("wishlist").innerHTML = buildLoader(tripDescription);

  await runSteps();
  window.location.href = "plan.html";
});

function buildLoader(tripDescription) {
  // Show just the first destination phrase for the heading
  const preview = tripDescription.length > 60
    ? tripDescription.slice(0, 57) + "…"
    : tripDescription;

  const stepsHtml = STEPS.map((label, i) => {
    const isLast = i === STEPS.length - 1;
    return `
      <div class="step-row" id="step-${i}">
        <span class="step-icon" id="icon-${i}">○</span>
        <span class="step-label${isLast ? " step-label--final" : ""}">${label}</span>
      </div>`;
  }).join("");

  return `
    <div class="loader-wrap">
      <div class="loader-heading">
        <span class="loader-spinner"></span>
        Planning: <em>${preview}</em>
      </div>
      <div class="loader-steps">${stepsHtml}</div>
    </div>`;
}

async function runSteps() {
  for (let i = 0; i < STEPS.length; i++) {
    const isLast = i === STEPS.length - 1;
    const icon = document.getElementById(`icon-${i}`);
    if (icon) icon.textContent = "◌";
    await sleep(isLast ? FINAL_STEP_DELAY : STEP_DELAY);
    if (icon) {
      icon.textContent = "✓";
      icon.classList.add("step-icon--done");
    }
  }
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
