A pile of rocks is described by the array `stones`, where each entry `stones[i]` records how heavy the `i`-th rock is.

Each round proceeds as follows: select the two remaining rocks with the greatest weights, denote them `x <= y`, and crash them into each other. When the pair matches (`x == y`), both rocks vanish. When the pair differs, the lighter rock vanishes and the heavier rock continues with its weight lowered to `y - x`.

Report the weight of the single rock that survives at the end, or `0` when nothing survives.

**Constraints:**

- `1 <= stones.length <= 30`
- `1 <= stones[i] <= 1000`
