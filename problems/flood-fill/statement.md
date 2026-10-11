You are given a picture as a grid of color numbers, a starting cell `(sr, sc)`, and a new color value. Recolor the starting cell plus every cell connected to it through shared sides (up, down, left, right) that currently holds the same original color, painting all of them with the new color.

Cells joined only diagonally do not count as connected. When the new color already equals the starting cell's color, the picture stays unchanged.

Return the picture after the recoloring.

**Example 1:**
```
Input: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2
Output: [[2,2,2],[2,2,0],[2,0,1]]
Explanation: The connected block of 1s around (1,1) becomes 2; the lone 0s and the isolated 1 stay.
```

**Example 2:**
```
Input: image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0
Output: [[0,0,0],[0,0,0]]
Explanation: New color matches the old one, so nothing changes.
```

**Example 3:**
```
Input: image = [[1,2,1],[2,1,2],[1,2,1]], sr = 1, sc = 1, color = 9
Output: [[1,2,1],[2,9,2],[1,2,1]]
Explanation: Only the center cell holds the starting color; diagonal 1s are untouched.
```

**Constraints:**
- `1 <= image.length, image[i].length <= 50`
- `0 <= image[i][j], color < 65536`
- `0 <= sr < image.length`, `0 <= sc < image[i].length`
