You are given balloons as segments `points`, where each entry `[xstart, xend]` spans that closed interval on a line. One arrow shot straight up at position `x` pops every balloon whose span contains `x`.

Find the smallest number of arrows that pop all balloons.

**Example 1:**
```
Input: points = [[10,16],[2,8],[1,6],[7,12]]
Output: 2
Explanation: One arrow at 6 pops the middle two, another at 12 pops the rest.
```

**Example 2:**
```
Input: points = [[1,2],[3,4],[5,6],[7,8]]
Output: 4
Explanation: No spans overlap, so each needs its own arrow.
```

**Example 3:**
```
Input: points = [[1,2],[2,3],[3,4],[4,5]]
Output: 2
Explanation: Arrow at 2 pops the first two, arrow at 4 pops the last two. Touching at an endpoint still counts as overlap.
```

**Constraints:**
- `1 <= points.length <= 10^5`
- Each entry has two values with `-2^31 <= xstart <= xend <= 2^31 - 1`.
