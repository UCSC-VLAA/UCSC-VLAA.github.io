/* Dr. SAM3 project page */
(function () {
  "use strict";

  const VIEWER_CASES = [{"case": "CT_AMOS_amos_0214", "modality": "CT", "dataset": "CT_AMOS", "frames": 40, "size": 256, "classes": [{"id": 1, "name": "Spleen", "color": "#e6194b"}, {"id": 2, "name": "Right kidney", "color": "#3cb44b"}, {"id": 3, "name": "Left kidney", "color": "#ffe119"}, {"id": 4, "name": "Gallbladder", "color": "#0082c8"}, {"id": 5, "name": "Esophagus", "color": "#f58230"}, {"id": 6, "name": "Liver", "color": "#911eb4"}, {"id": 7, "name": "Stomach", "color": "#46f0f0"}, {"id": 8, "name": "Aorta", "color": "#f032e6"}, {"id": 9, "name": "Inferior vena cava", "color": "#d2f53c"}, {"id": 10, "name": "Pancreas", "color": "#fabed4"}, {"id": 11, "name": "Right adrenal gland", "color": "#008080"}, {"id": 12, "name": "Left adrenal gland", "color": "#dcbeff"}, {"id": 13, "name": "Duodenum", "color": "#aa6e28"}, {"id": 14, "name": "Bladder", "color": "#fffac8"}, {"id": 15, "name": "Prostate/uterus", "color": "#800000"}], "dsc": {"s": 63.4, "d": 87.8, "t": 87.3}}, {"case": "CT_TotalSeg_muscles_s1258", "modality": "CT", "dataset": "CT_TotalSeg", "frames": 40, "size": 256, "classes": [{"id": 3, "name": "Left scapula", "color": "#ffe119"}, {"id": 4, "name": "Right scapula", "color": "#0082c8"}, {"id": 11, "name": "Spinal cord", "color": "#008080"}, {"id": 18, "name": "Left autochthon", "color": "#ffd7b4"}, {"id": 19, "name": "Right autochthon", "color": "#000080"}], "dsc": {"s": 19.2, "d": 94.7, "t": 88.9}}, {"case": "CT_AbdomenAtlas_BDMAP_00006985", "modality": "CT", "dataset": "CT_AbdomenAtlas", "frames": 40, "size": 256, "classes": [{"id": 1, "name": "Aorta", "color": "#e6194b"}, {"id": 4, "name": "Right kidney", "color": "#0082c8"}, {"id": 7, "name": "Postcava", "color": "#46f0f0"}, {"id": 12, "name": "Bladder", "color": "#dcbeff"}], "dsc": {"s": 47.8, "d": 96.1, "t": 95.7}}, {"case": "MR_BraTS-T2f_bratsgli_0466", "modality": "MR", "dataset": "MR_BraTS-T2f", "frames": 40, "size": 256, "classes": [{"id": 2, "name": "Surrounding non-enhancing FLAIR hyperintensity", "color": "#3cb44b"}], "dsc": {"s": 0.0, "d": 96.1, "t": 95.7}}, {"case": "MR_AMOSMR_amos_0592", "modality": "MR", "dataset": "MR_AMOSMR", "frames": 40, "size": 256, "classes": [{"id": 1, "name": "Spleen", "color": "#e6194b"}, {"id": 2, "name": "Right kidney", "color": "#3cb44b"}, {"id": 3, "name": "Left kidney", "color": "#ffe119"}, {"id": 4, "name": "Gallbladder", "color": "#0082c8"}, {"id": 5, "name": "Esophagus", "color": "#f58230"}, {"id": 6, "name": "Liver", "color": "#911eb4"}, {"id": 7, "name": "Stomach", "color": "#46f0f0"}, {"id": 8, "name": "Aorta", "color": "#f032e6"}, {"id": 9, "name": "Inferior vena cava", "color": "#d2f53c"}, {"id": 10, "name": "Pancreas", "color": "#fabed4"}, {"id": 11, "name": "Right adrenal gland", "color": "#008080"}, {"id": 12, "name": "Left adrenal gland", "color": "#dcbeff"}, {"id": 13, "name": "Duodenum", "color": "#aa6e28"}], "dsc": {"s": 31.5, "d": 78.2, "t": 71.8}}, {"case": "MR_heart-ACDC_ACDC_patient061_frame01_lvrv", "modality": "MR", "dataset": "MR_heart-ACDC", "frames": 7, "size": 256, "classes": [{"id": 1, "name": "Right ventricle cavity", "color": "#e6194b"}, {"id": 3, "name": "Left ventricle cavity", "color": "#ffe119"}], "dsc": {"s": 0.0, "d": 97.6, "t": 97.5}}, {"case": "US_Cardiac_patient0052_4CH_half_sequence", "modality": "Ultrasound", "dataset": "US_Cardiac", "frames": 9, "size": 256, "classes": [{"id": 1, "name": "Left Ventricle", "color": "#e6194b"}, {"id": 2, "name": "Myocardium", "color": "#3cb44b"}, {"id": 3, "name": "Left Atrium", "color": "#ffe119"}], "dsc": {"s": 0.0, "d": 94.3, "t": 93.7}}, {"case": "US_Low-limb-Leg35", "modality": "Ultrasound", "dataset": "US_Low-limb-Leg35", "frames": 40, "size": 256, "classes": [{"id": 1, "name": "Soleus", "color": "#e6194b"}, {"id": 2, "name": "Gastrocnemius Medialis", "color": "#3cb44b"}, {"id": 3, "name": "Gastrocnemius Lateralis", "color": "#ffe119"}], "dsc": {"s": 0.0, "d": 91.5, "t": 87.6}}];
  const CASE_LABELS = {
    "CT_AMOS_amos_0214": ["CT", "Abdominal organs (AMOS)"],
    "CT_TotalSeg_muscles_s1258": ["CT", "Muscles (TotalSegmentator)"],
    "CT_AbdomenAtlas_BDMAP_00006985": ["CT", "Abdomen (AbdomenAtlas)"],
    "MR_BraTS-T2f_bratsgli_0466": ["MR", "Brain tumor (BraTS)"],
    "MR_AMOSMR_amos_0592": ["MR", "Abdominal organs (AMOS-MR)"],
    "MR_heart-ACDC_ACDC_patient061_frame01_lvrv": ["MR", "Heart (ACDC)"],
    "US_Cardiac_patient0052_4CH_half_sequence": ["US", "Cardiac (4-chamber)"],
    "US_Low-limb-Leg35": ["US", "Lower-leg muscles"],
  };

  const QUAL = [
    "med_CT_instance_r01_CT_Pancreas_tumors", "med_CT_instance_r02_CT_Liver_tumors", "med_CT_instance_r03_CT_Adrenocortical_carcinoma",
    "med_CT_semantic_r03_CT_Left_gluteus_Maximus", "med_CT_semantic_r08_CT_Right_brachiocephalic_vein",
    "med_MR_instance_r01_MR_Prostate", "med_MR_instance_r02_MR_Prostate_lesion", "med_MR_instance_r03_MR_Stroke_lesion",
    "med_MR_semantic_r01_MR_Left_gluteus_medius", "med_MR_semantic_r04_MR_Non-enhancing_tumor_core", "med_MR_semantic_r06_MR_Left_adrenal_gland",
    "med_Ultrasound_semantic_r01_ultrasound_Left_Atrium", "med_Ultrasound_semantic_r04_ultrasound_Gastrocnemius_Lateralis",
    "med_PET_instance_r01_PET_Lesion", "med_Microscopy_instance_r02_microscopy_Vessel",
    "vox_CT_instance_r03_CT_Lung_lesions", "vox_CT_instance_r08_CT_Colon_cancer_primaries", "vox_CT_semantic_r02_CT_Left_adrenal_gland",
    "vox_CT_semantic_r04_CT_Stomach", "vox_CT_semantic_r08_CT_Left_gluteus_Maximus", "vox_MR_semantic_r02_MR_Left_humerus",
    "vox_MR_semantic_r03_MR_Left_hip", "vox_Ultrasound_semantic_r05_ultrasound_Gastrocnemius_Medialis",
    "vox_Microscopy_instance_r01_microscopy_Neural_activity",
  ];
  const QUAL_COLUMNS = {
    med: ["Input", "GT", "SAM3", "Medical SAM3-2D", "Med<wbr>SAM3", "CAT", "SAT", "Medal-S", "Biomed<wbr>Parse-V", "Dr. SAM3-T"],
    vox: ["Input", "GT", "SAM3", "Vox<wbr>Tell", "Text3D<wbr>SAM", "CAT", "SAT", "Medal-S", "Biomed<wbr>Parse-V", "Dr. SAM3-T"],
  };

  const EXTERNAL = {
    models: ["SAM3", "Medical SAM3-2D", "MedSAM3", "Medical SAM3-3D", "Text3DSAM", "Medal-S", "BiomedParse-V", "Dr. SAM3-D", "Dr. SAM3-T"],
    closed: ["BiomedParse-V"],
    datasets: [
      { name: "RAOS-Real", sub: "CT · 12 organs", dsc: [29.54, 3.65, 23.81, 16.64, 54.24, 70.57, 74.52, 78.92, 77.01], nsd: [26.38, 3.92, 18.30, 14.03, 39.09, 62.36, 69.47, 72.12, 71.50] },
      { name: "LiQA", sub: "MR · liver", dsc: [0.00, 2.43, 59.87, 74.59, 80.21, 88.36, 92.19, 93.07, 91.04], nsd: [0.00, 2.21, 41.51, 55.37, 56.60, 63.86, 79.86, 76.50, 76.69] },
      { name: "QUADRA-HC", sub: "PET · 4 organs", dsc: [0.43, 0.47, 3.59, 9.80, 1.14, 4.27, 4.29, 45.33, 44.95], nsd: [0.45, 0.26, 1.34, 3.45, 0.59, 2.39, 2.68, 28.21, 26.34] },
    ],
  };

  // RAOS-Real, 93 cases: DSC/NSD under W400/L40, nnU-Net, percentile; delta = max - min DSC
  const CONV = [
    ["SAM3", 29.54, 26.38, 36.52, 33.10, 37.67, 33.73, 8.13],
    ["Medical SAM3-2D", 3.65, 3.92, 4.19, 3.32, 4.62, 3.47, 0.97],
    ["MedSAM3", 23.81, 18.30, 14.15, 10.23, 13.61, 9.81, 10.20],
    ["Medical SAM3-3D", 16.64, 14.03, 15.44, 12.92, 15.33, 12.43, 1.31],
    ["Text3DSAM", 54.24, 39.09, 26.88, 15.02, 17.28, 9.48, 36.96],
    ["Medal-S", 70.57, 62.36, 39.69, 26.28, 38.96, 25.69, 31.61],
    ["BiomedParse-V", 74.52, 69.47, 66.21, 58.72, 56.61, 48.36, 17.91, "closed"],
    ["Dr. SAM3-D", 78.92, 72.12, 78.07, 70.34, 76.82, 68.22, 2.10, "ours"],
    ["Dr. SAM3-T", 77.01, 71.50, 74.18, 67.24, 72.27, 63.93, 4.74, "ours"],
  ];

  // name, training data, semantic DSC CT/MR/US/mean, instance F1 CT/MR/PET/Micro/mean, flags
  const MAIN = [
    ["SAM3", "&ndash;", 22.62, 10.76, 0.00, 11.13, 2.81, 0.00, 0.00, 0.00, 0.70],
    ["MedSAM3", "4 datasets", 17.87, 18.24, 20.57, 18.89, 22.10, 13.06, 9.39, 14.76, 14.83],
    ["Medical SAM3-2D", "33 datasets", 7.39, 15.77, 5.95, 9.70, 4.10, 0.70, 0.00, 5.11, 2.48],
    ["Medical SAM3-3D", "33 datasets", 9.93, 23.08, 31.94, 21.65, 31.57, 25.26, 9.94, 6.26, 18.26],
    ["VoxTell", "158 datasets", 46.55, 38.62, 0.23, 28.47, 3.24, 3.80, 16.93, 0.00, 5.99],
    ["Text3DSAM", "MedSegFM", 67.07, 52.26, 83.37, 67.57, 11.46, 11.63, 8.98, 13.44, 11.38, "sep"],
    ["CAT", "MedSegFM", 72.11, 54.15, 85.94, 70.73, 30.03, 13.75, 10.98, 3.13, 14.47],
    ["ESICA", "MedSegFM", 67.96, 60.82, 87.20, 71.99, 22.56, 24.44, 15.93, 14.52, 19.36],
    ["SAT", "SAT-DS&dagger; + MedSegFM", 67.80, 56.10, 85.58, 69.83, 25.25, 12.28, 42.00, 21.62, 25.29],
    ["Medal-S", "SAT-DS&dagger; + MedSegFM", 81.87, 61.91, 82.46, 75.41, 40.36, 48.43, 33.68, 33.54, 39.00],
    ["BiomedParse-V", "Closed med.&dagger; + MedSegFM", 85.12, 73.96, 90.50, 83.19, 51.19, 53.17, 31.32, 20.84, 39.13, "closed"],
    ["Dr. SAM3-D", "MedSegFM", 77.69, 65.46, 90.12, 77.76, 45.48, 56.62, 30.99, 28.84, 40.48, "ours"],
    ["Dr. SAM3-T", "MedSegFM", 70.02, 60.88, 89.23, 73.38, 51.59, 57.38, 25.26, 26.07, 40.08, "ours"],
  ];

  // fine-tuning GPU-hours on MedSegFM and median seconds per semantic volume (A100)
  const COST = [["Dr. SAM3-D", 160, "ours"], ["Dr. SAM3-T", 384, "ours"], ["Text3DSAM", 240], ["Medal-S", 5171], ["BiomedParse-V", 9600, "closed"]];
  const SPEED = [["Dr. SAM3-D", 1.4, "ours"], ["Dr. SAM3-T", 30.3, "ours"], ["Text3DSAM", 1.1], ["Medal-S", 233.7], ["BiomedParse-V", 10.2, "closed"]];

  const TUMOR = [["Text3DSAM", 12.8], ["SAT", 7.7], ["CAT", 28.1], ["Medal-S", 39.4], ["BiomedParse-V", 49.9, "closed"], ["Dr. SAM3-D", 42.1, "ours"], ["Dr. SAM3-T", 52.8, "ours"]];


  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, attrs = {}, html = "") => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    if (html) node.innerHTML = html;
    return node;
  };
  const fmt = (v) => (typeof v === "number" ? v.toFixed(2) : v);

  /* nav + reveal */
  const nav = $("#topnav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); revealer.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((n) => revealer.observe(n));

  /* 2D slice viewer */
  const chips = $("#caseChips");
  const frames = [...document.querySelectorAll("#viewerPanels .frame")];
  const slider = $("#sliceSlider");
  const playBtn = $("#playBtn");
  let current = null, timer = null;

  function showFrame(i) {
    const n = current.frames;
    const pct = n > 1 ? (i / (n - 1)) * 100 : 0;
    frames.forEach((f) => { f.style.backgroundPosition = `0 ${pct}%`; });
    $("#sliceLabel").textContent = `${i + 1} / ${n}`;
  }
  function selectCase(c) {
    current = c;
    stop();
    [...chips.children].forEach((b) => b.classList.toggle("active", b.dataset.case === c.case));
    frames.forEach((f) => {
      f.style.backgroundImage = `url("static/viewer/${c.case}/${f.dataset.key}.jpg")`;
      f.style.backgroundSize = `100% ${c.frames * 100}%`;
    });
    slider.max = c.frames - 1;
    slider.value = Math.floor((c.frames - 1) / 2);
    showFrame(+slider.value);
    $("#scoreS").textContent = `DSC ${c.dsc.s.toFixed(1)}`;
    $("#scoreD").textContent = `DSC ${c.dsc.d.toFixed(1)}`;
    $("#scoreT").textContent = `DSC ${c.dsc.t.toFixed(1)}`;
    $("#legend").innerHTML = c.classes.map((k) => `<span><i style="background:${k.color}"></i>${k.name}</span>`).join("");
    $("#viewerNote").textContent = `${c.case} · ${c.frames} slices shown · volume DSC averaged over the ground-truth classes`;
  }
  function stop() { clearInterval(timer); timer = null; playBtn.classList.remove("playing"); }
  playBtn.addEventListener("click", () => {
    if (timer) return stop();
    playBtn.classList.add("playing");
    timer = setInterval(() => {
      const v = (+slider.value + 1) % current.frames;
      slider.value = v; showFrame(v);
    }, 140);
  });
  slider.addEventListener("input", () => { stop(); showFrame(+slider.value); });
  document.addEventListener("keydown", (e) => {
    if (!current || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const r = $("#viewer").getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    stop();
    const v = Math.min(current.frames - 1, Math.max(0, +slider.value + (e.key === "ArrowRight" ? 1 : -1)));
    slider.value = v; showFrame(v);
  });
  VIEWER_CASES.forEach((c) => {
    const [mod, label] = CASE_LABELS[c.case] || [c.modality, c.case];
    const b = el("button", { "data-case": c.case }, `<span class="mod">${mod}</span>${label}`);
    b.addEventListener("click", () => selectCase(c));
    chips.appendChild(b);
  });
  selectCase(VIEWER_CASES[0]);

  /* qualitative gallery */
  const qualGrid = $("#qualGrid");
  let qualSet = "med", qualMod = "all";
  function parseQual(stem) {
    const parts = stem.split("_");
    const set = parts[0], modGroup = parts[1];
    const rest = parts.slice(4);
    const modality = { ultrasound: "Ultrasound", microscopy: "Microscopy" }[rest[0]] || rest[0];
    const name = rest.slice(1).join(" ").replace(/\b\w/g, (m, i) => (i === 0 ? m.toUpperCase() : m));
    return { stem, set, modGroup, modality, name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() };
  }
  const QUAL_ITEMS = QUAL.map(parseQual);
  function renderQual() {
    qualGrid.innerHTML = "";
    qualGrid.appendChild(el("div"));
    const head = el("div", { class: "qual-head" });
    QUAL_COLUMNS[qualSet].forEach((c) => head.appendChild(el("span", {}, c)));
    qualGrid.appendChild(head);
    QUAL_ITEMS.filter((q) => q.set === qualSet && (qualMod === "all" || q.modGroup === qualMod)).forEach((q) => {
      qualGrid.appendChild(el("div", { class: "qual-prompt" }, `<b>${q.modality}</b>${q.name}`));
      const row = el("div", { class: "qual-row" });
      row.appendChild(el("img", { src: `static/qual/${q.stem}.jpg`, alt: `${q.modality} ${q.name}: input, ground truth and model predictions`, loading: "lazy", width: "2400", height: "238" }));
      qualGrid.appendChild(row);
    });
    if (qualGrid.children.length === 2) qualGrid.appendChild(el("div", { class: "qual-prompt" }, "No examples for this filter."));
  }
  $("#setSwitch").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    qualSet = b.dataset.set;
    [...e.currentTarget.children].forEach((x) => x.classList.toggle("active", x === b));
    renderQual();
  });
  $("#modFilter").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    qualMod = b.dataset.mod;
    [...e.currentTarget.children].forEach((x) => x.classList.toggle("active", x === b));
    renderQual();
  });
  renderQual();

  /* bar charts */
  function bars(container, rows, max, digits = 2, logMin = 0) {
    container.innerHTML = "";
    const width = (v) => (logMin ? (Math.log10(v / logMin) / Math.log10(max / logMin)) * 100 : (v / max) * 100);
    const label = (v) => (digits < 0 ? v.toLocaleString("en-US") : v.toFixed(digits));
    rows.forEach(([name, value, flag]) => {
      const row = el("div", { class: `bar-row ${flag || ""}` });
      row.innerHTML = `<span class="name">${name}</span><div class="bar-track"><div class="bar-fill" data-w="${Math.max(0, width(value))}"></div></div><span class="val">${label(value)}</span>`;
      container.appendChild(row);
    });
    animateIn(container);
  }
  function animateIn(container) {
    const fill = () => container.querySelectorAll("[data-w]").forEach((b) => { b.style.width = b.dataset.w + "%"; });
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { requestAnimationFrame(fill); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(container);
  }

  let extIndex = 0, extMetric = "dsc";
  const extTabs = $("#extTabs");
  EXTERNAL.datasets.forEach((d, i) => {
    const b = el("button", {}, `${d.name} <span style="opacity:.6;font-weight:500">· ${d.sub}</span>`);
    b.addEventListener("click", () => { extIndex = i; renderExt(); });
    extTabs.appendChild(b);
  });
  function renderExt() {
    [...extTabs.children].forEach((b, i) => b.classList.toggle("active", i === extIndex));
    const d = EXTERNAL.datasets[extIndex];
    const values = d[extMetric];
    const rows = EXTERNAL.models.map((m, i) => [m, values[i], m.startsWith("Dr.") ? "ours" : EXTERNAL.closed.includes(m) ? "closed" : ""]);
    bars($("#extBars"), rows, 100);
  }
  $("#extMetric").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    extMetric = b.dataset.metric;
    [...e.currentTarget.children].forEach((x) => x.classList.toggle("active", x === b));
    renderExt();
  });
  renderExt();

  bars($("#tumorBars"), TUMOR, 100, 1);

  bars($("#costBars"), COST, 30000, -1, 60);
  bars($("#speedBars"), SPEED, 1000, 1, 0.6);

  /* tables: best value among open-data models per column */
  function table(body, rows, firstNum, cols, meanCols, noBest = []) {
    const open = rows.filter((r) => r[r.length - 1] !== "closed");
    const best = cols.map((c) => (noBest.includes(c) ? NaN : Math.max(...open.map((r) => r[c]))));
    rows.forEach((r) => {
      const flag = typeof r[r.length - 1] === "string" ? r[r.length - 1] : "";
      const tr = el("tr", { class: flag });
      let cells = "";
      for (let c = 0; c < firstNum; c++) cells += `<td class="left">${r[c]}${c === 0 && flag === "closed" ? " <small>(closed data)</small>" : ""}</td>`;
      cols.forEach((c, i) => {
        const cls = [meanCols.includes(c) ? "mean" : "", flag !== "closed" && r[c] === best[i] ? "best" : ""].join(" ").trim();
        cells += `<td class="${cls}">${fmt(r[c])}</td>`;
      });
      tr.innerHTML = cells;
      body.appendChild(tr);
    });
  }
  table($("#mainTable"), MAIN, 2, [2, 3, 4, 5, 6, 7, 8, 9, 10], [5, 10]);
  table($("#convTable"), CONV, 1, [1, 2, 3, 4, 5, 6, 7], [7], [7]);

  /* BibTeX copy */
  $("#copyBib").addEventListener("click", async (e) => {
    try {
      await navigator.clipboard.writeText($("#bibText").textContent);
      e.target.textContent = "Copied";
    } catch (err) {
      e.target.textContent = "Select & copy";
    }
    setTimeout(() => { e.target.textContent = "Copy"; }, 1600);
  });
})();
