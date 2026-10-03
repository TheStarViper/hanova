import { aStar } from "./route";

const start = "5,8";
const end = "11,20";
const walkable = (coords: `${number},${number}`) => coords !== "10,8";

console.log("starting search...");
const t1 = Date.now();

const route = aStar(start, end, walkable);

const t2 = Date.now();
console.log("finished search!");

console.log(route);

console.log(`took ${(t2 - t1) / 1000} seconds`);
