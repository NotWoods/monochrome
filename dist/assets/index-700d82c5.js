function __vite_legacy_guard() {
  import.meta.url;
  import("_").catch(() => 1);
  async function* g() {
  }
  ;
}
;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function getScale(layer) {
  return 1 - layer.padding / 100;
}
function drawLayer(layer, canvas, colorScheme) {
  const { ctx, size } = canvas;
  ctx.clearRect(0, 0, size, size);
  let width = getScale(layer) * size;
  let height = width;
  ctx.globalCompositeOperation = "source-over";
  if (layer.src) {
    const { height: srcHeight, width: srcWidth } = layer.src;
    const srcRatio = srcWidth / srcHeight;
    if (layer.fit === "fill")
      ;
    else if (layer.fit === "contain" ? srcRatio > 1 : srcRatio < 1) {
      height = width / srcRatio;
    } else {
      width = height * srcRatio;
    }
    const insetX2 = (size - width) / 2 + layer.x;
    const insetY2 = (size - height) / 2 + layer.y;
    ctx.globalAlpha = 1;
    ctx.drawImage(layer.src, insetX2, insetY2, width, height);
    ctx.globalCompositeOperation = "source-atop";
  }
  const insetX = (size - width) / 2 + layer.x;
  const insetY = (size - height) / 2 + layer.y;
  ctx.fillStyle = canvas.fill[colorScheme];
  ctx.globalAlpha = layer.alpha / 100;
  ctx.fillRect(insetX, insetY, width, height);
}
function scaleCanvas(canvas, size, scale = 1) {
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  return {
    canvas,
    ctx,
    size,
    fill: {
      light: canvas.dataset.light || "#000",
      dark: canvas.dataset.dark || "#fff"
    }
  };
}
async function createImage(source) {
  const img = new Image();
  if (typeof source === "string") {
    img.src = source;
  } else {
    img.src = URL.createObjectURL(source);
  }
  await img.decode();
  if (typeof source !== "string") {
    URL.revokeObjectURL(img.src);
  }
  return img;
}
async function layerFromSource(source) {
  const img = await createImage(source);
  const layer = createLayer(img);
  if (typeof source === "string") {
    layer.name = source;
  } else {
    layer.name = source.name;
  }
  return layer;
}
function createLayer(src) {
  return {
    src,
    name: "Layer",
    padding: 0,
    x: 0,
    y: 0,
    alpha: 100,
    locked: false,
    fit: "contain"
  };
}
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  const links = document.getElementsByTagName("link");
  return Promise.all(deps.map((dep) => {
    dep = assetsURL(dep);
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    const isBaseRelative = !!importerUrl;
    if (isBaseRelative) {
      for (let i = links.length - 1; i >= 0; i--) {
        const link2 = links[i];
        if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
          return;
        }
      }
    } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
if (window.customElements) {
  __vitePreload(() => import("./filedrop-44806e4f.js"), true ? [] : void 0);
  __vitePreload(() => import("./dark-mode-toggle.min-cd0f5b34.js"), true ? [] : void 0);
}
const toggle = document.querySelector("dark-mode-toggle");
const ad = document.querySelector("[data-ea-publisher]");
const notificationImage = document.querySelector(
  ".preview--android_notification .preview__background"
);
function updateDarkModeClasses(darkMode) {
  document.body.classList.toggle("dark", darkMode);
  ad.classList.toggle("dark", darkMode);
}
toggle.mode = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
updateDarkModeClasses(toggle.mode === "dark");
toggle.addEventListener("colorschemechange", () => {
  updateDarkModeClasses(toggle.mode === "dark");
  notificationImage.src = `previews/android_notification_${toggle.mode}.svg`;
});
if (document.monetization) {
  let onMonetizationStart = function() {
    if (document.monetization.state === "started") {
      console.log("Payment started, hiding ads");
      ad.hidden = true;
    }
  };
  document.monetization.addEventListener(
    "monetizationstart",
    onMonetizationStart
  );
}
const IS_FIREFOX = typeof InstallTrigger !== "undefined";
const DPR = window.devicePixelRatio || 1;
const ICON_CANVASES = Array.from(document.querySelectorAll("canvas")).map(
  (canvas) => scaleCanvas(canvas, canvas.width, DPR)
);
window.ICON_CANVASES = ICON_CANVASES;
let currentLayer;
function sanitizeDemoSource(source) {
  if (IS_FIREFOX && source.startsWith("demo/")) {
    return source.replace(".svg", ".png");
  } else {
    return source;
  }
}
async function updateDisplayedIcon(source) {
  if (!source)
    return;
  const layerAsync = layerFromSource(source);
  const originalImg = document.querySelector(".icon__original .icon");
  const oldUrl = originalImg.src;
  if (oldUrl.startsWith("blob:")) {
    URL.revokeObjectURL(oldUrl);
  }
  if (typeof source === "string") {
    history.replaceState(void 0, "", `?demo=${source}`);
  } else {
    source = URL.createObjectURL(source);
    history.replaceState(void 0, "", ".");
  }
  updateSource(source);
  currentLayer = await layerAsync;
  ICON_CANVASES.forEach((canvas) => {
    drawLayer(currentLayer, canvas, toggle.mode);
  });
  originalImg.src = source;
}
toggle.addEventListener("colorschemechange", () => {
  if (currentLayer) {
    ICON_CANVASES.forEach((canvas) => {
      drawLayer(currentLayer, canvas, toggle.mode);
    });
  }
});
function updateSource(source) {
  const sourceDisplay = document.querySelector(".source");
  const sourceLink = sourceDisplay.querySelector(".source__link");
  const preview = source && document.querySelector(
    `.demo__preview[src$="${source}"],.demo__preview[data-png="${source}"]`
  );
  if (preview) {
    sourceDisplay.hidden = false;
    sourceLink.href = preview.dataset.source;
    sourceLink.textContent = preview.alt;
  } else {
    sourceDisplay.hidden = true;
  }
}
const fileInput = document.querySelector("#icon_file");
const fileDrop = document.querySelector("#icon_drop");
fileInput.addEventListener(
  "change",
  () => updateDisplayedIcon(fileInput.files[0])
);
fileDrop.addEventListener(
  "filedrop",
  (evt) => updateDisplayedIcon(evt.files[0])
);
fileInput.addEventListener("focus", () => fileInput.classList.add("focus"), {
  passive: true
});
fileInput.addEventListener("blur", () => fileInput.classList.remove("focus"), {
  passive: true
});
const demoUrl = new URL(location.href).searchParams.get("demo");
updateDisplayedIcon(sanitizeDemoSource(demoUrl || "demo/spec.svg"));
const demoLinks = document.querySelector(".demo__list");
demoLinks.addEventListener("click", (evt) => {
  const target = (
    /** @type {HTMLElement} */
    evt.target
  );
  const link = target.closest(".demo__link");
  if (link != null) {
    evt.preventDefault();
    const demoUrl2 = new URL(link.href).searchParams.get("demo");
    updateDisplayedIcon(sanitizeDemoSource(demoUrl2));
  }
});
const container = document.querySelector(".icon__grid");
document.querySelector(".controls").addEventListener("change", (evt) => {
  const checkbox = (
    /** @type {HTMLInputElement} */
    evt.target
  );
  switch (checkbox.name) {
    case "shrink": {
      const size = checkbox.checked ? "0.25" : "1";
      container.style.transform = `scale(${size})`;
      break;
    }
    case "original":
      container.classList.toggle("icon--original", checkbox.checked);
      break;
  }
});
const accessKeys = /* @__PURE__ */ new Map();
const focusable = document.querySelectorAll("input[accesskey]");
focusable.forEach((input) => {
  accessKeys.set(input.accessKey, input);
});
document.addEventListener("keydown", (evt) => {
  if (evt.repeat)
    return;
  const input = accessKeys.get(evt.key);
  if (input) {
    evt.preventDefault();
    input.click();
  }
});
export {
  __vite_legacy_guard
};
