You hold two jugs holding exactly `x` and `y` litres, plus an unlimited water
supply. In any step you may fill a jug completely, empty a jug completely, or
pour from one jug into the other until either the source is empty or the
destination is full.

Decide whether these moves can leave exactly `target` litres combined across
both jugs.

A useful insight: every reachable total is a multiple of the greatest common
divisor of the two capacities, and any such multiple up to `x + y` is
reachable. A target of zero is always reachable (both jugs empty).

**Constraints:**
- `0 <= x, y, target <= 10^3`
