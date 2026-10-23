// class imports
import { Banner } from "./banner.svelte";
import { Boat, SAIL_DURATION } from "./boat.svelte";
import { FileManager } from "./fileManager";
import { Island, ISLAND_DATA } from "./island.svelte";
import { Treasure } from "./treasure.svelte";
import { Pos } from "./utils.svelte";
import { Viewport } from "./viewport.svelte";

// misc imports
import type { CubicBezier } from "./bezier";
import type { WorkerResponse } from "./converter.worker";
import type { CppManager } from "./cppManager";
import { aStarRouteFactory } from "./route";
import { decodeSounds, playSound, preloadSounds } from "./sound";
import { Tooltip } from "./tooltip.svelte";

const USE_TIME_ESTIMATE = false;

export class World {
  viewport = new Viewport();
  boat = new Boat(this.viewport);
  islands: Island[] = $state([]);
  fileManager: FileManager;
  treasure = new Treasure();
  banner = new Banner(this.viewport);
  tooltip = new Tooltip();

  curves: CubicBezier[] = $state([]);
  titleCornered: boolean = $state(false);

  // for various dev-only debugging visuals
  debugging = false;
  skipMenu = false;

  constructor(public cppManager: CppManager) {
    this.fileManager = new FileManager(cppManager, async () => this.dropHook());
  }

  init() {
    this.viewport.init();
    this.initIslands();
    this.fileManager.init();

    // ik I could massively simplify this, but I want to keep the logic explicit
    if (this.skipMenu) {
      // debugging values
      this.banner.text = "";
      this.viewport.canDrag = true;
      this.titleCornered = true;
    } else {
      // normal values
      this.banner.text = "Drag & drop a file to start";
      this.viewport.canDrag = false;
      this.titleCornered = false;
    }

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
    this.fileManager.outFormat = undefined;
    this.fileManager.conversionStartTime = null;

    this.treasure.hide = true;
    this.treasure.owner = null;

    this.banner.text = "Drag & drop another file";
    this.viewport.canDrag = false;

    this.curves = [];
  }

  async dropHook() {
    this.spawnBoat();
    this.banner.text = "";
    this.viewport.canDrag = true;

    this.titleCornered = true;
  }

  #getSpawnOffset(): Pos | undefined {
    const inFormatName = this.fileManager.getInputFormatName();
    if (inFormatName === undefined) return undefined;

    const offset = Island.findSpawnOffsetForFormat(inFormatName);
    return offset;
  }

  spawnBoat() {
    const spawnOffset = this.#getSpawnOffset() ?? this.viewport.center;

    this.boat.pos.x = spawnOffset.x;
    this.boat.pos.y = spawnOffset.y;

    this.viewport.recenterTo(
      new Pos(
        this.viewport.center.x - this.boat.pos.x,
        this.viewport.center.y - this.boat.pos.y,
      ),
    );

    this.boat.name = this.fileManager.displayifiedFilename;
    this.boat.hide = false;

    playSound("splash1.ogg");
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
        this.viewport.canDrag = false;
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
    const res = this.fileManager.downloadFile();

    switch (res) {
      case undefined:
        this.banner.text =
          "error: the boat arrived before the conversion finished :(";
        break;
      case true:
        playSound("shovel1.wav");

        this.banner.text =
          `You've found buried treasure: a ${this.fileManager.outFormat} file!`;
        break;
      default:
        this.banner.text = `error: ${res}`;
        break;
    }

    setTimeout(() => this.reset(), 2000);

    this.viewport.canDrag = false;
    this.viewport.userIsDragging = false;
  }

  islandClickHandler(targetIsland: Island) {
    // hijacking this interaction to decode the sounds
    decodeSounds();

    // the user shouldn't be able to click if the banner is visible
    if (this.banner.text !== "") return;

    // if a file conversion has already started, the user shouldn't be able to
    // change it partway through
    if (this.boat.route !== undefined) return;

    this.treasure.owner = targetIsland;
    this.treasure.previousOwner = targetIsland;

    // intentionally NOT awaiting this even though its async
    this.fileManager.convertTo(targetIsland.name);

    const fileSize = this.fileManager.file?.size ?? 1000000;

    // 1 millisecond per 3 kilobytes is a good-enough heuristic based on
    // testing on my Framework 13
    const timeEstimate = fileSize * 0.003;

    const duration = USE_TIME_ESTIMATE
      ? Math.max(2000, Math.min(8000, timeEstimate))
      : SAIL_DURATION;

    const [route, curves] = aStarRouteFactory(
      new Pos(this.boat.pos.x, this.boat.pos.y),
      targetIsland,
      this.islands,
    );

    this.curves = curves;

    this.boat.sail(
      route,
      duration,
      () => this.boatArriveHandler(),
    );
  }

  initIslands() {
    this.islands = ISLAND_DATA.map((datum) => {
      return new Island(
        datum,
        (targetIsland: Island) => this.islandClickHandler(targetIsland),
      );
    });
  }
}
