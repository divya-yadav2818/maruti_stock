// ---------------- Password Protection ----------------
const PASSWORD_KEY = "app_password";
const isPasswordSet = localStorage.getItem(PASSWORD_KEY);

function checkPassword() {
  const input = document.getElementById("appPassword").value;
  const msg = document.getElementById("pass-msg");

  if (!isPasswordSet) {
    if (input.length < 4) { msg.textContent = "Password must be at least 4 characters."; return; }
    localStorage.setItem(PASSWORD_KEY, input);
    window.location.href = "home.html";
  } else {
    if (input === localStorage.getItem(PASSWORD_KEY)) {
      window.location.href = "home.html";
    } else {
      msg.textContent = "Incorrect password!";
    }
  }
}

// ---------------- Logout ----------------
function logout() {
  window.location.href = "index.html";
}

// ---------------- Stock Data ----------------
let data = JSON.parse(localStorage.getItem("stock")) || [];

// Save Product
function saveProduct() {
  let name = document.getElementById("name").value.trim();
  let qty = Number(document.getElementById("qty").value);
  let unit = document.getElementById("unit").value;
  let type = document.getElementById("type").value;
  let minInput = document.getElementById("min").value;
  
  if(!name || qty<=0) return alert("Enter valid details");

  // Check if product exists
  let product = data.find(p => p.name===name && p.unit===unit);

  if(product){
    // Update quantity
    product.qty += type==="inward"?qty:-qty;

    // Update min only if user entered a new value
    if(minInput) product.min = Number(minInput);

  } else {
    // New product
    let minVal = minInput ? Number(minInput) : 0;
    data.push({name, qty, unit, min:minVal});
  }

  localStorage.setItem("stock", JSON.stringify(data));
  clearForm();
  loadInventory();
  loadLowStock();
}

// Clear Form
function clearForm() {
  if(document.getElementById("name")) document.getElementById("name").value="";
  if(document.getElementById("qty")) document.getElementById("qty").value="";
  if(document.getElementById("min")) document.getElementById("min").value="";
}

// Load Inventory
function loadInventory(filter="") {
  let inv = document.getElementById("inventory");
  if(!inv) return;
  inv.innerHTML="";
  data.filter(p=>p.name.toLowerCase().includes(filter))
      .forEach((p,i)=>{
        let div=document.createElement("div");
        div.className="product "+(p.qty<=p.min?"low":"");
        div.innerHTML=`<b>${p.name}</b><br>Stock: ${p.qty} ${p.unit} | Min: ${p.min}<br><button class="delete" onclick="remove(${i})">Delete</button>`;
        inv.appendChild(div);
      });
}

// Load Low Stock
function loadLowStock() {
  let low = document.getElementById("lowstock");
  if(!low) return;
  low.innerHTML="";
  let lowProducts = data.filter(p=>p.qty<=p.min);
  lowProducts.forEach(p=>{
    let div=document.createElement("div");
    div.className="product low";
    div.innerHTML=`<b>${p.name}</b><br>Stock: ${p.qty} ${p.unit} | Min: ${p.min} <span style="color:red;">(Low)</span>`;
    low.appendChild(div);
  });
}

// Delete Product
function remove(i){
  data.splice(i,1);
  localStorage.setItem("stock",JSON.stringify(data));
  loadInventory();
  loadLowStock();
}

// Navigation
function goInventory(){ window.location.href="inventory.html"; }
function goHome(){ window.location.href="home.html"; }
function goLowStock(){ window.location.href="lowstock.html"; }

// Auto-suggest Home
let search=document.getElementById("search");
if(search){
  search.addEventListener("input",()=>{
    let val=search.value.toLowerCase();
    let sug=document.getElementById("suggestions");
    sug.innerHTML="";
    if(val.length>=2){
      data.filter(p=>p.name.toLowerCase().startsWith(val))
          .forEach(p=>{
            let d=document.createElement("div");
            d.textContent=p.name;
            d.onclick=()=>{document.getElementById("name").value=p.name;sug.innerHTML="";}
            sug.appendChild(d);
          });
    }
  });
}

// Inventory Search
let invSearch=document.getElementById("inventorySearch");
if(invSearch){
  invSearch.addEventListener("input",e=>{ loadInventory(e.target.value.toLowerCase()); });
}

// Initial Load
loadInventory();
loadLowStock();
