Each entry of `rectangles` describes one axis-aligned block by its lower-left corner `(xi, yi)` and its upper-right corner `(ai, bi)`, with `xi < ai` and `yi < bi`. Decide whether the blocks fit together perfectly: jointly they must fill some larger rectangle exactly, with no overlaps and no gaps.

That means two things must hold at once: the total covered area must equal the area of the bounding box, and the block corners must cancel out everywhere except at the four extreme corners.

**Example 1:**
```
Input: rectangles = [[1,1,3,3],[3,1,4,2],[3,2,4,4],[1,3,2,4],[2,3,3,4]]
Output: true
Explanation: The five small blocks tile the square from (1,1) to (4,4)
without overlap.
```

**Example 2:**
```
Input: rectangles = [[1,1,2,3],[1,3,2,4],[3,1,4,2],[3,2,4,4]]
Output: false
Explanation: A hole sits where the block [2,1,3,4] would go, so the union
is not a solid rectangle.
```

**Example 3:**
```
Input: rectangles = [[1,1,3,3],[3,1,4,2],[1,3,2,4],[2,2,4,4]]
Output: false
Explanation: The last two blocks overlap on [2,2,3,3], so the cover is not exact.
```

**Constraints:**
- `1 <= rectangles.length <= 2 * 10^4`
- `rectangles[i].length == 4`
- `-10^5 <= xi < ai <= 10^5`
- `-10^5 <= yi < bi <= 10^5`
