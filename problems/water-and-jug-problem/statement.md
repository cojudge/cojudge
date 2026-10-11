You hold two jugs holding exactly `x` and `y` litres, plus an unlimited water
supply. In any step you may fill a jug completely, empty a jug completely, or
pour from one jug into the other until either the source is empty or the
destination is full.

Decide whether these moves can leave exactly `target` litres combined across
both jugs.

A useful insight: every reachable total is a multiple of the greatest common
divisor of the two capacities, and any such multiple up to `x + y` is
reachable. A target of zero is always reachable (both jugs empty).

**Example 1:**
```
Input: x = 3, y = 5, target = 4
Output: true
Explanation: Fill the 5-jug, pour into the 3-jug leaving 2 behind, empty the
3-jug, pour the 2 over, refill the 5-jug and top up the 3-jug with 1 litre,
leaving exactly 4 in the 5-jug.
```

**Example 2:**
```
Input: x = 2, y = 6, target = 5
Output: false
Explanation: Every reachable total is even, so 5 can never appear.
```

**Example 3:**
```
Input: x = 1, y = 2, target = 3
Output: true
Explanation: Fill both jugs.
```

**Constraints:**
- `0 <= x, y, target <= 10^3`
