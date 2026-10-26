import { ease, Pos } from "./utils.svelte";

const DRAG_SENSITIVITY = 1;
const SCROLL_SENSITIVITY = 1.0015;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 2;

export class Viewport {
  el: HTMLElement | null = null;
  min = new Pos();
  max = new Pos();

  offset = new Pos(0, 0);
  zoom: number = $state(1);

  canDrag = $state(false);
  userIsDragging = $state(false);

  mouseX = $state(0);
  mouseY = $state(0);
  #dragStartX = 0;
  #dragStartY = 0;

  width = $derived(this.max.x - this.min.x);
  height = $derived(this.max.y - this.min.y);
  center = $derived(new Pos(this.width / 2, this.height / 2));
  mobile = $derived(this.width <= 600);

  constructor() {}

  init(): void {
    this.el = document.getElementById("main");

    this.update();

    window.addEventListener("resize", () => this.update());

    this.#initListeners();
  }

  update(): void {
    if (this.el === null) return;

    const rect = this.el.getBoundingClientRect();

    this.min.x = rect.left;
    this.min.y = rect.top;
    this.max.x = rect.right;
    this.max.y = rect.bottom;
  }

  #initListeners() {
    window.addEventListener("pointerdown", (event) => {
      if (!this.canDrag) return;

      this.userIsDragging = true;
      this.#dragStartX = event.clientX;
      this.#dragStartY = event.clientY;
    });
    window.addEventListener("pointerup", () => (this.userIsDragging = false));
    window.addEventListener(
      "pointercancel",
      () => (this.userIsDragging = false),
    );
    window.addEventListener("pointermove", (event) => {
      if (!this.userIsDragging) return;

      const dragDeltaX = event.clientX - this.#dragStartX;
      const dragDeltaY = event.clientY - this.#dragStartY;

      this.offset.x += (dragDeltaX * DRAG_SENSITIVITY) / this.zoom;
      this.offset.y += (dragDeltaY * DRAG_SENSITIVITY) / this.zoom;

      this.#dragStartX = event.clientX;
      this.#dragStartY = event.clientY;
    });
    window.addEventListener("wheel", (event) => {
      if (!this.canDrag) return;

      const newZoom = this.zoom
        * Math.pow(SCROLL_SENSITIVITY, -event.deltaY);

      if (newZoom > MIN_ZOOM && newZoom < MAX_ZOOM) {
        this.zoom = newZoom;
      }
    });

    document.addEventListener("mousemove", (event) => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    });
  }

  #recenterAnimID: number | null = null;
  recenterTo(endPos: Pos) {
    if (this.#recenterAnimID !== null) {
      cancelAnimationFrame(this.#recenterAnimID);
    }

    const duration = 1000;
    const startPos = new Pos(this.offset.x, this.offset.y);
    const delta = Pos.sub(endPos, startPos);

    let startTime: number | null = null;

    const animate = (nowTime: number) => {
      if (startTime === null) {
        startTime = nowTime;
      }

      const elapsed = nowTime - startTime;

      /** normalized between 0 and 1 */
      const rawProgress = Math.min(elapsed / duration, 1);
      const progress = ease(rawProgress);

      this.offset.x = startPos.x + delta.x * progress;
      this.offset.y = startPos.y + delta.y * progress;

      this.#recenterAnimID = progress < 1
        ? requestAnimationFrame(animate)
        : null;
    };

    this.#recenterAnimID = requestAnimationFrame(animate);
  }
}
