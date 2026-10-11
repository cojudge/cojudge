You are given a binary grid where `1` marks land and `0` marks water. An island is a group of `1` cells joined up, down, left or right.

Two islands share a shape when one can be shifted, rotated (0, 90, 180 or 270 degrees) and optionally mirrored to match the other exactly. Translation alone is always free; rotation and reflection are also free here (unlike the simpler distinct-islands variant).

Return how many different shapes appear. For example, a 2x2 block and another 2x2 block elsewhere count once, and an L shape matches its mirror image.

**Example 1:**
```
Input: grid = [[1,1,0,0,0],[1,0,0,0,0],[0,0,0,0,1],[0,0,0,1,1]]
Output: 1
Explanation: The two small corner shapes are rotations of one another.
```

**Example 2:**
```
Input: grid = [[1,1,0,0,0],[1,1,0,0,0],[0,0,0,1,1],[0,0,0,1,1]]
Output: 1
Explanation: Both islands are 2x2 squares, so only one shape exists.
```

**Example 3:**
```
Input: grid = [[1,0,0],[0,1,1],[0,0,0]]
Output: 2
Explanation: A lone cell differs from a two-cell domino under every rotation or flip.
```

**Constraints:**
- `1 <= grid.length, grid[i].length <= 50`
- Each cell is `0` or `1`.
