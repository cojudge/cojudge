Each entry of `rectangles` describes one axis-aligned block by its lower-left corner `(xi, yi)` and its upper-right corner `(ai, bi)`, with `xi < ai` and `yi < bi`. Decide whether the blocks fit together perfectly: jointly they must fill some larger rectangle exactly, with no overlaps and no gaps.

That means two things must hold at once: the total covered area must equal the area of the bounding box, and the block corners must cancel out everywhere except at the four extreme corners.

**Constraints:**
- `1 <= rectangles.length <= 2 * 10^4`
- `rectangles[i].length == 4`
- `-10^5 <= xi < ai <= 10^5`
- `-10^5 <= yi < bi <= 10^5`
