import { Pos } from "./utils.svelte";
import { Island } from "./island.svelte";

export class Treasure {
	owner: Island | null = $state(null);
	pos: Pos = $derived(
		this.owner === null
			? new Pos()
			: new Pos(
					this.owner.pos.x + this.owner.treasureOffset.x,
					this.owner.pos.y + this.owner.treasureOffset.y,
				),
	);
	hide: boolean = $derived(this.owner === null);
}
