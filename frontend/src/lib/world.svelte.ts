// class imports
import { Banner } from "./banner.svelte";
import { Boat } from "./boat";
import { FileManager } from "./fileManager";
import { Island } from "./island.svelte";
import { Treasure } from "./treasure.svelte";
import { Pos, Viewport, mulberry32 } from "./utils.svelte";

// misc imports
import type { CppManager } from "./cppManager";
import islandData from "./islandData.json";

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

	init(viewportEl: HTMLElement) {
		this.viewport.update(viewportEl);
		this.initIslands();
		this.fileManager.init();
	}

	async dropHook() {
		this.spawnBoat();
		this.banner.hide = true;
	}

	spawnBoat() {
		this.boat.pos.x = this.viewport.center.x;
		this.boat.pos.y = this.viewport.center.y;
		this.boat.name = this.fileManager.getTrimmedFilename();
		this.boat.hide = false;
	}

	initIslands() {
		const islandClickHandler = (me: Island, endPos: Pos) => {
			// the user shouldn't be able to click if the banner is visible
			if (!this.banner.hide) return;

			this.treasure.owner = me;
			this.treasure.previousOwner = me;

			// intentionally NOT awaiting this even though its async
			this.fileManager.convertTo(me.name);

			this.boat.sail(endPos, () => {
				this.banner.text = `You've found buried treasure: a ${this.fileManager.outFormat?.name} file!`;
				this.banner.hide = false;
			});
		};

		this.islands = islandData.islands.map((datum) => {
			const pos = new Pos(datum.pos.x, datum.pos.y);

			return new Island(
				datum.name,
				pos,
				datum.islandSpriteIndex,
				islandClickHandler,
			);
		});
	}
}
