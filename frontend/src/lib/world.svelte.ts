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

export class World {
	viewport = new Viewport();
	boat = new Boat(this.viewport);
	islands: Island[] = $state([]);
	fileManager: FileManager;
	treasure = new Treasure();
	banner = new Banner(this.viewport);

	constructor(public cppManager: CppManager) {
		this.fileManager = new FileManager(cppManager, async () => this.dropHook());
	}

	init() {
		this.viewport.init();
		this.initIslands();
		this.fileManager.init();
		this.banner.hide = false;
	}

	reset() {
		this.boat.hide = true;
		this.boat.route = undefined;
		this.boat.name = "Boat";

		this.fileManager.file = undefined;
		this.fileManager.outFormat = undefined;
		this.fileManager.ok = undefined;
		this.fileManager.blob = undefined;
		this.fileManager.err = undefined;

		this.treasure.hide = true;
		this.treasure.owner = null;

		this.banner.hide = false;
		this.banner.text = "Drag & drop another file";
	}

	async dropHook() {
		this.spawnBoat();
		this.banner.hide = true;
	}

	spawnBoat() {
		this.boat.pos.x = this.viewport.center.x;
		this.boat.pos.y = this.viewport.center.y;

		this.boat.name = this.fileManager.displayifiedFilename;
		this.boat.hide = false;
	}

	boatArriveHandler() {
		this.banner.hide = false;

		switch (this.fileManager.ok) {
			case undefined:
				this.banner.text =
					"error: the boat arrived before the conversion finished :(";
				break;
			case false:
				this.banner.text = `error: ${this.fileManager.err}`;
				break;
			case true:
				this.banner.text = `You've found buried treasure: a ${this.fileManager.outFormat?.name} file!`;

				this.fileManager.downloadFile();

				setTimeout(() => this.reset(), 2000);
		}
	}

	islandClickHandler(me: Island, endPos: Pos) {
		// the user shouldn't be able to click if the banner is visible
		if (!this.banner.hide) return;

		// if a file conversion has already started, the user shouldn't be able to
		// change it partway through
		if (this.boat.route !== undefined) return;

		this.treasure.owner = me;
		this.treasure.previousOwner = me;

		// intentionally NOT awaiting this even though its async
		this.fileManager.convertTo(me.name);

		const otherIslands = this.islands.filter((i) => i !== me);

		const route = aStarRouteFactory(
			new Pos(this.boat.pos.x, this.boat.pos.y),
			endPos,
			otherIslands,
		);

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
