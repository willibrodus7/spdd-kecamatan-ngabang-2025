// Ganti URL di bawah dengan URL Web App milikmu
const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxbZyBiE6N4ikLtJ3-XMJ1rWFv85w3VxkC1xtzzQtlQfLnvJyQkSrLHVLJvilVu5vIq/exec";

// kirim data ke Apps Script
document.getElementById("sppdForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());

  const res = await fetch(APP_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  const msg = document.getElementById("responseMsg");
  if(res.ok){
    msg.textContent = "✅ Data berhasil disimpan!";
    form.reset();
    loadData(); // refresh tabel
  } else {
    msg.textContent = "❌ Gagal menyimpan data!";
  }
});

// ambil data rekap
async function loadData(){
  const res = await fetch(APP_SCRIPT_URL);
  const json = await res.json();
  const tbody = document.querySelector("#rekapTable tbody");
  tbody.innerHTML = "";
  json.forEach((row, i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${row.nomor_sppd||"-"}</td>
      <td>${row.nama_pegawai||"-"}</td>
      <td>${row.tujuan||"-"}</td>
      <td>${row.tanggal_berangkat||"-"}</td>
      <td>${row.tanggal_kembali||"-"}</td>
      <td>${row.kendaraan||"-"}</td>
      <td>${row.total_biaya||"-"}</td>
      <td>${row.status||"-"}</td>
    `;
    tbody.appendChild(tr);
  });
}

window.onload = loadData;
