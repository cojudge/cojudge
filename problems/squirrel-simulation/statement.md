A squirrel must carry each nut back to its tree on a grid where movement costs the Manhattan distance. The tree stands at `tree`, the squirrel starts at `squirrel`, and the nuts lie at the positions in `nuts`. The grid size (`height` rows, `width` columns) only bounds the coordinates.

Carrying one nut home is a round trip from the tree, except the very first nut, which the squirrel fetches starting from its own position instead of the tree. So the total equals twice every tree-to-nut distance, adjusted once by picking the first nut that saves the most: the one minimizing `dist(squirrel, nut) - dist(tree, nut)`.

**Constraints:**
- `1 <= height, width <= 100`
- `1 <= nuts.length <= 3000`
- All positions lie inside the grid.
