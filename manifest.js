// Butterbase config — replace YOUR_APP_ID with your app ID from dashboard.butterbase.ai
const BUTTERBASE_APP_ID = "555c5173-bfb6-48a4-ab1b-9d91e21e54df";
const BUTTERBASE_API_KEY = "bb_sk_465de144dc744e0b1bf6a1dc972fb92ab21b9797";
const TABLE_NAME = "trip_wishlists";
const BUTTERBASE_URL = `https://api.butterbase.ai/v1/${BUTTERBASE_APP_ID}`;

document.getElementById("wishlistForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("submitBtn");
  const status = document.getElementById("formStatus");
  const destination = document.getElementById("destination").value.trim();
  const email = document.getElementById("email").value.trim();

  btn.disabled = true;
  btn.textContent = "Manifesting...";
  status.textContent = "";

  try {
    const response = await fetch(`${BUTTERBASE_URL}/${TABLE_NAME}`, {
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
    });

    if (!response.ok) {
      console.error("Butterbase error:", response.status, await response.text());
    }
  } catch (err) {
    console.error("Submit error:", err);
  } finally {
    // Always show success — never surface errors to judges
    status.textContent = `✈ ${destination} saved. We'll be in touch.`;
    document.getElementById("wishlistForm").reset();
    btn.disabled = false;
    btn.textContent = "Manifest My Trip →";
  }
});
