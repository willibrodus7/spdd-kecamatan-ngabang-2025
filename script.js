// === URL Apps Script ===
const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxbZyBiE6N4ikLtJ3-XMJ1rWFv85w3VxkC1xtzzQtlQfLnvJyQkSrLHVLJvilVu5vIq/exec";

// === Animasi Salju ===
const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");
let snowflakes = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createSnowflakes() {
  const count = 80;
  for (let i = 0; i < count; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 1,
      d: Math.random() + 1
    });
  }
}

function drawSnowflakes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.beginPath();
  for (let f of snowflakes) {
    ctx.moveTo(f.x, f.y);
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
  }
  ctx.fill();
  moveSnowflakes();
}

let angle = 0;
function moveSnowflakes() {
  angle += 0.01;
  for (let f of snowflakes) {
    f.y += Math.pow(f.d, 2) + 1;
    f.x += Math.sin(angle) * 2;
    if (f.y > canvas.height) {
      f.y = 0;
      f.x = Math.random() * canvas.width;
    }
  }
}

function updateSnowfall() {
  drawSnowflakes();
  requestAnimationFrame(updateSnowfall);
}
createSnowflakes();
updateSnowfall();

// === Kirim & Ambil Data dari Apps Script ===
document.getElementById("sppdForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  const msg = document.getElementById("responseMsg");
  msg.textContent = "⏳ Menyimpan data...";

  try {
    const res = await fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data)
    });
    if (res.ok) {
      msg.textContent = "✅ Data berhasil disimpan!";
      form.reset();
      loadData();
    } else throw new Error("Gagal menyimpan");
  } catch (err) {
    msg.textContent = "❌ Gagal terhubung ke server!";
  }
});

async function loadData() {
  try {
    const res = await fetch(APP_SCRIPT_URL);
    const json = await res.json();
    const tbody = document.querySelector("#rekapTable tbody");
    tbody.innerHTML = "";
    json.reverse().forEach((r, i)=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i+1}</td>
        <td>${r.nomor_sppd||"-"}</td>
        <td>${r.nama_pegawai||"-"}</td>
        <td>${r.tujuan||"-"}</td>
        <td>${r.tanggal_berangkat||"-"}</td>
        <td>${r.tanggal_kembali||"-"}</td>
        <td>${r.kendaraan||"-"}</td>
        <td>Rp ${r.total_biaya||"0"}</td>
        <td>${r.status||"-"}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}
window.onload = loadData;
