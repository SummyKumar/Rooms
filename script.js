
/* ---------------------------------------------------------------
   GALLERY DATA
   Each category has a color (used as a placeholder background)
   and a list of items. To add a REAL photo, just add "img": "your-file.jpg"
   to that item — the placeholder color/icon is used only when
   "img" is missing.
----------------------------------------------------------------*/
const CATEGORIES = [
  { key:"building", label:"🏢 Building", color:"#2F4A3C",
    items:[
      {icon:"🏢", t:"Building exterior", img:"images/building_1.jpeg"}
    ]},
  { key:"room", label:"🛏️ Room", color:"#8C6A3F",
    items:[
      {icon:"🛏️", t:"Room 1", img:"images/room_1.jpeg"},
      {icon:"🛏️", t:"Room 2", img:"images/room_2.jpeg"},
      {icon:"🛏️", t:"Room 3", img:"images/room_3.jpeg"},
      {icon:"🛏️", t:"Room 4", img:"images/room_4.jpeg"},
      {icon:"🛏️", t:"Room 5", img:"images/room_5.jpeg"}
    ]},
  { key:"common", label:"🛋️ Common Area", color:"#5A4B6E",
    items:[
      {icon:"🛋️", t:"Common area 1", img:"images/common_area_1.jpeg"},
      {icon:"🛋️", t:"Common area 2", img:"images/common_area_2.jpeg"}
    ]},
  { key:"amenities", label:"✨ Common Amenities", color:"#B9852D",
    items:[
      {icon:"✨", t:"Amenity 1", img:"images/amenity_1.jpeg"},
      {icon:"✨", t:"Basic amenities", img:"images/Basic_Amenities_2.jpeg"},
      {icon:"✨", t:"Amenity 3", img:"images/amenity_3.jpeg"}
    ]},
  { key:"kitchen", label:"🍳 Kitchen", color:"#7A4B3A",
    items:[
      {icon:"🍳", t:"Common kitchen", img:"images/kitchen_1.jpeg"}
    ]},
  { key:"neighbourhood", label:"📍 Neighbourhood", color:"#3F5C6C",
    items:[
      {icon:"📍", t:"Locality", img:"images/locality_1.jpeg"}
    ]},
];

const tabsEl = document.getElementById("tabs");
const panelsEl = document.getElementById("panels");

CATEGORIES.forEach((cat, i) => {
  const tab = document.createElement("button");
  tab.className = "tab" + (i===0 ? " active" : "");
  tab.textContent = cat.label;
  tab.dataset.key = cat.key;
  tab.addEventListener("click", () => selectTab(cat.key));
  tabsEl.appendChild(tab);

  const panel = document.createElement("div");
  panel.className = "gallery-panel" + (i===0 ? " active" : "");
  panel.id = "panel-" + cat.key;

  const grid = document.createElement("div");
  grid.className = "gal-grid";
  cat.items.forEach((item, idx) => {
    const tile = document.createElement("div");
    tile.className = "gal-item";
    if (item.img) {
      tile.innerHTML = `<img src="${item.img}" alt="${item.t}">`;
    } else {
      tile.style.background = `linear-gradient(160deg, ${cat.color}, #1C2321)`;
      tile.innerHTML = `<div class="lbl"><span class="ic">${item.icon}</span><span class="t">${item.t}</span></div>`;
    }
    tile.addEventListener("click", () => openLightbox(cat.key, idx));
    grid.appendChild(tile);
  });
  panel.appendChild(grid);
  panelsEl.appendChild(panel);
});

// Location Map tab (separate — links to the Location section instead of a photo grid)
const mapTab = document.createElement("button");
mapTab.className = "tab";
mapTab.textContent = "🗺️ Location Map";
mapTab.addEventListener("click", () => { document.getElementById("location").scrollIntoView({behavior:"smooth"}); });
tabsEl.appendChild(mapTab);

function selectTab(key){
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.key === key));
  document.querySelectorAll(".gallery-panel").forEach(p => p.classList.toggle("active", p.id === "panel-" + key));
}

/* ---------------- Lightbox ---------------- */
let lbCatIndex = 0, lbItemIndex = 0;
const lightbox = document.getElementById("lightbox");
const lbBig = document.getElementById("lbBig");
const lbCap = document.getElementById("lbCap");
const lbCount = document.getElementById("lbCount");

function openLightbox(catKey, itemIdx){
  lbCatIndex = CATEGORIES.findIndex(c => c.key === catKey);
  lbItemIndex = itemIdx;
  renderLightbox();
  lightbox.classList.add("open");
}
function renderLightbox(){
  const cat = CATEGORIES[lbCatIndex];
  const item = cat.items[lbItemIndex];
  if (item.img) {
    lbBig.innerHTML = `<img src="${item.img}" alt="${item.t}">`;
    lbBig.style.background = "none";
  } else {
    lbBig.style.background = `linear-gradient(160deg, ${cat.color}, #1C2321)`;
    lbBig.innerHTML = `<div class="lbl"><span class="ic" style="font-size:2.4rem;">${item.icon}</span><div style="margin-top:10px;font-family:'IBM Plex Mono',monospace;font-size:0.8rem;letter-spacing:0.06em;">${item.t}</div></div>`;
  }
  lbCap.textContent = cat.label.replace(/^\S+\s/, "") + " — " + item.t;
  lbCount.textContent = (lbItemIndex+1) + " / " + cat.items.length;
}
document.getElementById("lbClose").addEventListener("click", () => lightbox.classList.remove("open"));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("open"); });
document.getElementById("lbPrev").addEventListener("click", () => {
  const cat = CATEGORIES[lbCatIndex];
  lbItemIndex = (lbItemIndex - 1 + cat.items.length) % cat.items.length;
  renderLightbox();
});
document.getElementById("lbNext").addEventListener("click", () => {
  const cat = CATEGORIES[lbCatIndex];
  lbItemIndex = (lbItemIndex + 1) % cat.items.length;
  renderLightbox();
});
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") lightbox.classList.remove("open");
  if (e.key === "ArrowLeft") document.getElementById("lbPrev").click();
  if (e.key === "ArrowRight") document.getElementById("lbNext").click();
});

