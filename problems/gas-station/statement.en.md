There are `n` gas stations arranged in a circle. `gas[i]` is the fuel available at station `i`, and `cost[i]` is the fuel needed to drive from station `i` to station `(i + 1) mod n`.

You begin with an empty tank. Return the index from which you can complete one clockwise circuit without the tank becoming negative. If no such station exists, return `-1`. If a valid starting station exists, it is guaranteed to be unique.

**Constraints:**

- `gas.length == cost.length`
- `1 <= gas.length <= 100000`
- `0 <= gas[i], cost[i] <= 10000`
- If a valid starting station exists, it is unique.
