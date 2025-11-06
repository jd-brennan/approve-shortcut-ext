// Helper to simulate clicks with delay
const clickElement = async (el, delay = 500) => {
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.click();
    await new Promise(r => setTimeout(r, delay));
    return true;
  }
  console.warn("Element doesn't exist");
  return false;
};
const clickSelector = async (selector, delay = 500) => {
  const el = document.querySelector(selector);
  if (el) {
    clickElement(el)
    return false;
  }
  console.warn("Element not found:", selector);
  return false;
};

async function approvePR() {
  console.log("Attempting PR approval automation...");

  // Step 1: Go to Files changed tab
  await clickSelector('a[href$="/files"]')

  // Step 2: Click Review Changes button
  const reviewBtn = Array.from(document.querySelectorAll('span'))
	.find(el => el.textContent.trim() === "Submit review");
  await clickElement(reviewBtn)

  // Step 3: Select "Approve"
  await clickSelector('input[value="approve"]');

  // Step 4: Click Submit review
  const submitBtn = Array.from(document.querySelectorAll('div'))
	.find(el => el.textContent.trim() === "Submit review");
  await clickElement(submitBtn)

  console.log("✅ PR approved (if permissions allowed).");
}

// Listen for Chrome command (Alt+A)
chrome.runtime.onMessage.addListener((msg) => {
  if (msg === "approve_pr") approvePR();
});

// Also add a floating button for convenience
function addApproveButton() {
  if (document.getElementById("auto-approve-btn")) return;

  const btn = document.createElement("button");
  btn.id = "auto-approve-btn";
  btn.textContent = "Approve PR (Alt+A)";
  Object.assign(btn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "8px 12px",
    background: "#2da44e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    zIndex: 9999
  });
  btn.onclick = approvePR;
  document.body.appendChild(btn);
}

// Add button once DOM ready
document.addEventListener("DOMContentLoaded", addApproveButton);

