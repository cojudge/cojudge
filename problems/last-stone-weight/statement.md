You are given an array `stones` where `stones[i]` is the weight of the `i`th stone.

On each turn, choose the two heaviest stones with weights `x <= y` and smash them together. If `x == y`, both stones are destroyed. Otherwise, the stone of weight `x` is destroyed and the stone of weight `y` becomes a stone of weight `y - x`.

Return the weight of the last remaining stone, or `0` if no stones remain.

**Constraints:**

- `1 <= stones.length <= 30`
- `1 <= stones[i] <= 1000`
