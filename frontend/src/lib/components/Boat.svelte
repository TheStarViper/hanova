<script lang="ts" module>
import type { Route } from "#lib/route.js";
import { playSound } from "#lib/sound.js";
import { ease, Pos } from "#lib/utils.svelte.js";
import { world } from "#lib/world.svelte.js";

// [TODO] replace this with an actual conversion time estimate
/** in milliseconds */
export const SAIL_DURATION = 4000;

export class BoatManager {
  pos = new Pos();
  route: Route | undefined;
  hide = $state(true);
  sunk = $state(false);
  name = "Boat";

  constructor() {}

  #moveAnimID: number | null = null;
  /**
   * Smoothly moves from one position to another
   *
   * @param route
   * @param duration in milliseconds
   * @param arriveHook runs after the animation
   */
  sail(route: Route, duration: number, arriveHook?: () => void) {
    // sailing should only happen if visible
    if (this.hide) return;

    // we don't wanna restart the animation if there's already one running
    if (this.route !== undefined) return;
    this.route = route;

    if (this.#moveAnimID !== null) cancelAnimationFrame(this.#moveAnimID);

    const shouldMoveViewport = this.pos.x > -world.viewport.offset.x
      && this.pos.x < -world.viewport.offset.x + world.viewport.width
      && this.pos.y > -world.viewport.offset.y
      && this.pos.y < -world.viewport.offset.y + world.viewport.height;

    // hopefully enough time for the sounds to decode
    setTimeout(() => playSound("sail1.ogg"), 50);

    let startTime: number | null = null;

    const animate = (nowTime: number) => {
      if (startTime === null) {
        startTime = nowTime;
      }

      const elapsed = nowTime - startTime;

      /** normalized between 0 and 1 */
      const rawProgress = Math.min(elapsed / duration, 1);
      const progress = ease(rawProgress);

      const newPos = route(progress);

      if (shouldMoveViewport) {
        world.viewport.offset.x -= newPos.x - this.pos.x;
        world.viewport.offset.y -= newPos.y - this.pos.y;
      }

      this.pos.x = newPos.x;
      this.pos.y = newPos.y;

      if (progress < 1) {
        this.#moveAnimID = requestAnimationFrame(animate);
      } else {
        this.#moveAnimID = null;
        arriveHook?.();
      }
    };

    this.#moveAnimID = requestAnimationFrame(animate);
  }

  sink() {
    if (this.#moveAnimID !== null) {
      cancelAnimationFrame(this.#moveAnimID);
      this.#moveAnimID = null;
    }

    playSound("bubble2.wav");

    this.sunk = true;

    setTimeout(() => (this.hide = true), 1000);
  }
}
</script>

<script lang="ts">
import BoatSvg from "#lib/assets/boat.svg";
import Sprite from "./Sprite.svelte";

let me = world.boat;
</script>

<Sprite
  left={me.pos.x}
  top={me.pos.y}
  width={96}
  label={me.name}
  hide={me.hide}
  layer={10}
  sunk={me.sunk}
>
  {@html BoatSvg}
</Sprite>
