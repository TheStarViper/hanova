import { ease, Pos } from "./utils.svelte";

export class Viewport {
	el: HTMLElement | null = null;
	min = new Pos();
	max = new Pos();

	offset = new Pos(0, 0);
	zoom: number = $state(1);

	canDrag = $state(false);
	userIsDragging = $state(false);
	private dragStartX = 0;
	private dragStartY = 0;

	private DRAG_SENSITIVITY = 1;
	private SCROLL_SENSITIVITY = 1.0015;
	private MIN_ZOOM = 0.3;
	private MAX_ZOOM = 2;

	constructor() {}

	init(): void {
		this.el = document.getElementById("main");

		this.update();

		window.addEventListener("resize", () => this.update());

		this.initListeners();
	}

	update(): void {
		if (this.el === null) return;

		const rect = this.el.getBoundingClientRect();

		this.min.x = rect.left;
		this.min.y = rect.top;
		this.max.x = rect.right;
		this.max.y = rect.bottom;
	}

	get width(): number {
		return this.max.x - this.min.x;
	}

	get height(): number {
		return this.max.y - this.min.y;
	}

	get center(): Pos {
		return new Pos(this.width / 2, this.height / 2);
	}

	private initListeners() {
		window.addEventListener("pointerdown", (event) => {
			if (!this.canDrag) return;

			this.userIsDragging = true;
			this.dragStartX = event.clientX;
			this.dragStartY = event.clientY;
		});
		window.addEventListener("pointerup", () => (this.userIsDragging = false));
		window.addEventListener(
			"pointercancel",
			() => (this.userIsDragging = false),
		);
		window.addEventListener("pointermove", (event) => {
			if (!this.userIsDragging) return;

			const dragDeltaX = event.clientX - this.dragStartX;
			const dragDeltaY = event.clientY - this.dragStartY;

			this.offset.x += (dragDeltaX * this.DRAG_SENSITIVITY) / this.zoom;
			this.offset.y += (dragDeltaY * this.DRAG_SENSITIVITY) / this.zoom;

			this.dragStartX = event.clientX;
			this.dragStartY = event.clientY;
		});
		window.addEventListener("wheel", (event) => {
			if (!this.canDrag) return;

			const newZoom =
				this.zoom * Math.pow(this.SCROLL_SENSITIVITY, -event.deltaY);

			if (newZoom > this.MIN_ZOOM && newZoom < this.MAX_ZOOM) {
				this.zoom = newZoom;
			}
		});
	}

	private recenterAnimID: number | null = null;
	recenterTo(endPos: Pos) {
		if (this.recenterAnimID !== null) cancelAnimationFrame(this.recenterAnimID);

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

			this.recenterAnimID =
				progress < 1 ? requestAnimationFrame(animate) : null;
		};

		this.recenterAnimID = requestAnimationFrame(animate);
	}
}
