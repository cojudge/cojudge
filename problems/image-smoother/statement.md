You are given an `m x n` grid `img` of gray values.

Build a smoothed grid of the same size where each cell becomes the floor of the average of itself plus all valid neighbours (up to 8 surrounding cells plus itself). Cells on borders simply average fewer entries.

**Constraints:**
- `1 <= m, n <= 200`
- `0 <= img[i][j] <= 255`
