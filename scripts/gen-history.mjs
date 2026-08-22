import { writeLessons } from "./history-lib.mjs";
import { lessonsH0H2 } from "./history-h0-h2.mjs";
import { lessonsH3H5 } from "./history-h3-h5.mjs";
import { lessonsH6H8 } from "./history-h6-h8.mjs";
import { lessonsH9H11 } from "./history-h9-h11.mjs";

const all = [...lessonsH0H2, ...lessonsH3H5, ...lessonsH6H8, ...lessonsH9H11];
writeLessons(all);
console.log(`Wrote ${all.length} history lessons`);
