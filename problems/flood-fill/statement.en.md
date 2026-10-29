You are given a picture as a grid of color numbers, a starting cell `(sr, sc)`, and a new color value. Recolor the starting cell plus every cell connected to it through shared sides (up, down, left, right) that currently holds the same original color, painting all of them with the new color.

Cells joined only diagonally do not count as connected. When the new color already equals the starting cell's color, the picture stays unchanged.

Return the picture after the recoloring.

**Constraints:**
- `1 <= image.length, image[i].length <= 50`
- `0 <= image[i][j], color < 65536`
- `0 <= sr < image.length`, `0 <= sc < image[i].length`
