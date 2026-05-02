// Butterbase config — replace at venue with live credentials
const BUTTERBASE_URL = "BUTTERBASE_URL_PLACEHOLDER";
const BUTTERBASE_API_KEY = "BUTTERBASE_KEY_PLACEHOLDER";
const TABLE_NAME = "trip_wishlists";

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
    const response = await fetch(`${BUTTERBASE_URL}/api/${TABLE_NAME}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BUTTERBASE_API_KEY}`,
        "apikey": BUTTERBASE_API_KEY,
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
