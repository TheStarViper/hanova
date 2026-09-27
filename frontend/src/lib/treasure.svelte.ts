import { Pos } from "./utils.svelte";
import { Island } from "./island.svelte";

export class Treasure {
	owner: Island | null = $state(null);

	/**
	 * This is just to make the pos not instantly jump away when owner is set to
	 * null, *sigh*
	 */
	previousOwner: Island | null = $state(null);
	pos: Pos = $derived(
		this.previousOwner === null ? new Pos() : this.previousOwner.treasurePos,
	);
	hide: boolean = $derived(this.owner === null);
}
