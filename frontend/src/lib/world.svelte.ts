// class imports
import { Banner } from "./banner.svelte";
import { Boat, SAIL_DURATION } from "./boat.svelte";
import { FileManager } from "./fileManager";
import { Island, ISLAND_DATA, type IslandDatum } from "./island.svelte";
import { Treasure } from "./treasure.svelte";
import { Pos, Viewport, mulberry32 } from "./utils.svelte";

// misc imports
import type { CppManager } from "./cppManager";
import { aStarRouteFactory } from "./route";
import type { CubicBezier } from "./bezier";
import type { WorkerResponse } from "./cppRunner.worker";
import { decodeSounds, playSound, preloadSounds } from "./sound";

export class World {
	viewport = new Viewport();
	boat = new Boat(this.viewport);
	islands: Island[] = $state([]);
	fileManager: FileManager;
	treasure = new Treasure();
	banner = new Banner(this.viewport);
	curves: CubicBezier[] = $state([]);

	constructor(public cppManager: CppManager) {
		this.fileManager = new FileManager(cppManager, async () => this.dropHook());
	}

	init() {
		this.viewport.init();
		this.initIslands();
		this.fileManager.init();
		this.banner.text = "Drag & drop a file to start";

		this.cppManager.hook = (response: WorkerResponse) =>
			this.conversionHandler(response);

		preloadSounds();
	}

	reset() {
		this.boat.hide = true;
		this.boat.route = undefined;
		this.boat.name = "Boat";
		this.boat.sunk = false;

		this.fileManager.file = undefined;
		this.fileManager.outFormatName = undefined;
		this.fileManager.conversionStartTime = null;

		this.treasure.hide = true;
		this.treasure.owner = null;

		this.banner.text = "Drag & drop another file";

		this.curves = [];
	}

	async dropHook() {
		this.spawnBoat();
		this.banner.text = "";
	}

	spawnBoat() {
		this.boat.pos.x = this.viewport.center.x;
		this.boat.pos.y = this.viewport.center.y;

		this.boat.name = this.fileManager.displayifiedFilename;
		this.boat.hide = false;
	}

	conversionHandler(response: WorkerResponse) {
		if (response.ok) {
			console.log("converted succesfully!");
		} else {
			console.warn(`error: ${response.error}`);

			// its kinda jarring if the boat *instantly* sinks as soon as you click
			// an island, so it waits at least 750ms before sinking
			const MIN_SINK_DELAY = 750;

			const sinkDelay = Math.max(
				MIN_SINK_DELAY - (Date.now() - this.fileManager.conversionStartTime!),
				0,
			);

			setTimeout(() => {
				this.boat.sink();
				this.curves = [];
			}, sinkDelay);

			const message = `The boat sunk! Reason: ${response.error}`;
			const showMessageDelay = sinkDelay + 1000;

			setTimeout(() => {
				this.banner.text = message;
			}, showMessageDelay);

			const hideMessageDelay = sinkDelay + message.length * 30;

			setTimeout(() => this.reset(), hideMessageDelay + 2000);
		}
	}

	boatArriveHandler() {
		this.banner.text = "";

		const res = this.fileManager.downloadFile();

		switch (res) {
			case undefined:
				this.banner.text =
					"error: the boat arrived before the conversion finished :(";
				break;
			case true:
				playSound("shovel1.wav");

				this.banner.text = `You've found buried treasure: a ${this.fileManager.outFormatName} file!`;
				setTimeout(() => this.reset(), 2000);
				break;
			default:
				this.banner.text = `error: ${res}`;
				break;
		}
	}

	islandClickHandler(me: Island, endPos: Pos) {
		// hijacking this interaction to decode the sounds
		decodeSounds();

		// the user shouldn't be able to click if the banner is visible
		if (this.banner.text !== "") return;

		// if a file conversion has already started, the user shouldn't be able to
		// change it partway through
		if (this.boat.route !== undefined) return;

		this.treasure.owner = me;
		this.treasure.previousOwner = me;

		// intentionally NOT awaiting this even though its async
		this.fileManager.convertTo(me.name);

		const otherIslands = this.islands.filter((i) => i !== me);

		const [route, curves] = aStarRouteFactory(
			new Pos(this.boat.pos.x, this.boat.pos.y),
			endPos,
			otherIslands,
		);

		this.curves = curves;

		this.boat.sail(route, SAIL_DURATION, () => this.boatArriveHandler());
	}

	initIslands() {
		this.islands = ISLAND_DATA.map((datum) => {
			return new Island(datum, (me: Island, endPos: Pos) =>
				this.islandClickHandler(me, endPos),
			);
		});
	}
}
