const $ = (id) => document.getElementById(id);

const input = $("diskon");
const hasil = $("hasil");
const error = $("error");
const chips = $("chips");
const copyActions = $("copy-actions");
const copyFullBtn = $("copy-full");
const copyPctBtn = $("copy-pct");
const clearBtn = $("clear");

const ALLOWED = /[^0-9+]/g;
const ANIM_MS = 380;
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lastResultFull = "";
let lastResultPct = "";
let displayedValue = null;
let animFrame = null;

function sanitizeInput(teks) {
  return teks
    .replace(ALLOWED, "")
    .replace(/\+{2,}/g, "+")
    .replace(/^\+/, "");
}

function parseDiskon(teks) {
  teks = teks.trim();
  if (!teks) return null;

  const bagian = teks.split("+").filter(Boolean);
  if (!bagian.length) return null;

  const diskon = [];

  for (const b of bagian) {
    const nilai = parseFloat(b);
    if (isNaN(nilai) || nilai < 0 || nilai >= 100) {
      return null;
    }
    diskon.push(nilai);
  }

  return diskon;
}

function hitung(diskon) {
  let harga = 100;
  for (const d of diskon) {
    harga *= 1 - d / 100;
  }
  return (1 - harga / 100) * 100;
}

function renderChips(diskon) {
  chips.innerHTML = diskon
    .map((d) => `<span class="chip">${d}%</span>`)
    .join("");
}

function cancelAnim() {
  if (animFrame) {
    cancelAnimationFrame(animFrame);
    animFrame = null;
  }
}

function showEmptyResult() {
  cancelAnim();
  displayedValue = null;
  hasil.textContent = "—";
  hasil.classList.add("empty");
}

function animateResult(target) {
  cancelAnim();
  hasil.classList.remove("empty");

  if (REDUCED_MOTION) {
    hasil.textContent = target.toFixed(2) + "%";
    displayedValue = target;
    return;
  }

  const start = displayedValue ?? 0;
  if (Math.abs(target - start) < 0.005) {
    hasil.textContent = target.toFixed(2) + "%";
    displayedValue = target;
    return;
  }

  const diff = target - start;
  const t0 = performance.now();

  function tick(now) {
    const p = Math.min((now - t0) / ANIM_MS, 1);
    const ease = 1 - (1 - p) ** 3;
    const current = start + diff * ease;

    hasil.textContent = current.toFixed(2) + "%";
    displayedValue = current;

    if (p < 1) {
      animFrame = requestAnimationFrame(tick);
    } else {
      hasil.textContent = target.toFixed(2) + "%";
      displayedValue = target;
      animFrame = null;
    }
  }

  animFrame = requestAnimationFrame(tick);
}

function toggleClear() {
  const hasValue = input.value.length > 0;
  clearBtn.classList.toggle("visible", hasValue);
  input.classList.toggle("has-clear", hasValue);
}

function setCopyVisible(visible) {
  copyActions.classList.toggle("visible", visible);
  copyFullBtn.classList.toggle("visible", visible);
  copyPctBtn.classList.toggle("visible", visible);
}

function resetCopyBtns() {
  copyActions.classList.remove("visible");
  copyFullBtn.classList.remove("visible", "copied");
  copyPctBtn.classList.remove("visible", "copied");
  copyFullBtn.textContent = "Full";
  copyPctBtn.textContent = "%";
}

function reset() {
  showEmptyResult();
  chips.innerHTML = "";
  resetCopyBtns();
  error.style.display = "none";
  lastResultFull = "";
  lastResultPct = "";
  toggleClear();
}

function update() {
  const teks = input.value;
  toggleClear();

  if (!teks.trim()) {
    reset();
    return;
  }

  const diskon = parseDiskon(teks);

  if (!diskon) {
    showEmptyResult();
    chips.innerHTML = "";
    resetCopyBtns();
    error.style.display = "none";
    lastResultFull = "";
    lastResultPct = "";
    return;
  }

  const efektif = hitung(diskon);
  renderChips(diskon);
  animateResult(efektif);

  const pct = efektif.toFixed(2) + "%";
  lastResultFull = `${teks} = ${pct}`;
  lastResultPct = pct;
  setCopyVisible(true);
  error.style.display = "none";
}

async function handleCopy(btn, text, label) {
  if (!text) return;
  await navigator.clipboard.writeText(text);
  btn.textContent = "Copied!";
  btn.classList.add("copied");
  setTimeout(() => {
    btn.textContent = label;
    btn.classList.remove("copied");
  }, 1500);
}

function handleInput() {
  const cleaned = sanitizeInput(input.value);
  if (cleaned !== input.value) {
    const pos = input.selectionStart - (input.value.length - cleaned.length);
    input.value = cleaned;
    input.setSelectionRange(Math.max(0, pos), Math.max(0, pos));
  }
  update();
}

clearBtn.addEventListener("click", () => {
  input.value = "";
  reset();
  input.focus();
});

copyFullBtn.addEventListener("click", () => handleCopy(copyFullBtn, lastResultFull, "Full"));
copyPctBtn.addEventListener("click", () => handleCopy(copyPctBtn, lastResultPct, "%"));

input.addEventListener("input", handleInput);
input.addEventListener("paste", (e) => {
  e.preventDefault();
  const pasted = sanitizeInput(e.clipboardData.getData("text"));
  const start = input.selectionStart;
  const end = input.selectionEnd;
  input.value = input.value.slice(0, start) + pasted + input.value.slice(end);
  const pos = start + pasted.length;
  input.setSelectionRange(pos, pos);
  update();
});

input.focus();