Measure the ground covered by a set of rectangles.

Each entry of `rectangles` is `[x1, y1, x2, y2]` with `x1 < x2` and `y1 < y2`, describing an axis-aligned rectangle including its interior. Rectangles may overlap. Return the total area covered by at least one rectangle, modulo 1,000,000,007.

**Example 1:**
```
Input: rectangles = [[0,0,2,2],[1,0,2,3],[1,0,3,1]]
Output: 6
Explanation: The union spans six unit squares.
```

**Example 2:**
```
Input: rectangles = [[0,0,1000000000,1000000000]]
Output: 49
Explanation: Area 10^18 modulo 1e9+7 equals 49.
```

**Example 3:**
```
Input: rectangles = [[0,0,1,1],[0,0,1,1]]
Output: 1
Explanation: Identical rectangles overlap fully.
```

**Constraints:**
- `1 <= rectangles.length <= 200`
- Each rectangle holds four integers with `0 <= x1 < x2 <= 10^9` and `0 <= y1 < y2 <= 10^9`.
