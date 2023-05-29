function t(t2, e2, i2) {
  const s2 = Array.from(t2);
  let r;
  if ("" === e2)
    return r = s2.filter((t3) => "file" === t3.kind), i2 ? r : [r[0]];
  const n = e2.toLowerCase().split(",").map((t3) => t3.split("/").map((t4) => t4.trim())).filter((t3) => 2 === t3.length);
  return r = r = s2.filter((t3) => {
    if ("file" !== t3.kind)
      return false;
    const [e3, i3] = t3.type.toLowerCase().split("/").map((t4) => t4.trim());
    for (const [t4, s3] of n)
      if (e3 === t4 && ("*" === s3 || i3 === s3))
        return true;
    return false;
  }), false === i2 && (r = [r[0]]), r;
}
function e(e2, i2, s2) {
  const r = [];
  return t(e2.items, i2, s2).forEach((t2) => {
    const e3 = t2.getAsFile();
    null !== e3 && r.push(e3);
  }), r;
}
class i extends Event {
  constructor(t2, e2) {
    var s2, r;
    super(t2, e2), (s2 = this) instanceof (r = i) || Object.setPrototypeOf(s2, r.prototype), this._files = e2.files, this._action = e2.action;
  }
  get action() {
    return this._action;
  }
  get files() {
    return this._files;
  }
}
class s extends HTMLElement {
  constructor() {
    super(), this._dragEnterCount = 0, this._onDragEnter = this._onDragEnter.bind(this), this._onDragLeave = this._onDragLeave.bind(this), this._onDrop = this._onDrop.bind(this), this._onPaste = this._onPaste.bind(this), this.addEventListener("dragover", (t2) => t2.preventDefault()), this.addEventListener("drop", this._onDrop), this.addEventListener("dragenter", this._onDragEnter), this.addEventListener("dragend", () => this._reset()), this.addEventListener("dragleave", this._onDragLeave), this.addEventListener("paste", this._onPaste);
  }
  get accept() {
    return this.getAttribute("accept") || "";
  }
  set accept(t2) {
    this.setAttribute("accept", t2);
  }
  get multiple() {
    return this.getAttribute("multiple");
  }
  set multiple(t2) {
    this.setAttribute("multiple", t2 || "");
  }
  _onDragEnter(e2) {
    if (this._dragEnterCount += 1, this._dragEnterCount > 1)
      return;
    if (null === e2.dataTransfer)
      return void this.classList.add("drop-invalid");
    const i2 = t(e2.dataTransfer.items, this.accept, null !== this.multiple);
    this.classList.add(!e2.dataTransfer || !e2.dataTransfer.items.length || void 0 !== i2[0] ? "drop-valid" : "drop-invalid");
  }
  _onDragLeave() {
    this._dragEnterCount -= 1, 0 === this._dragEnterCount && this._reset();
  }
  _onDrop(t2) {
    if (t2.preventDefault(), null === t2.dataTransfer)
      return;
    this._reset();
    const s2 = e(t2.dataTransfer, this.accept, null !== this.multiple);
    void 0 !== s2 && this.dispatchEvent(new i("filedrop", { action: "drop", files: s2 }));
  }
  _onPaste(t2) {
    if (!t2.clipboardData)
      return;
    const s2 = e(t2.clipboardData, this.accept, void 0 !== this.multiple);
    void 0 !== s2 && this.dispatchEvent(new i("filedrop", { action: "paste", files: s2 }));
  }
  _reset() {
    this._dragEnterCount = 0, this.classList.remove("drop-valid"), this.classList.remove("drop-invalid");
  }
}
customElements.define("file-drop", s);
export {
  s as FileDropElement,
  i as FileDropEvent
};
