Measure the ground covered by a set of rectangles.

Each entry of `rectangles` is `[x1, y1, x2, y2]` with `x1 < x2` and `y1 < y2`, describing an axis-aligned rectangle including its interior. Rectangles may overlap. Return the total area covered by at least one rectangle, modulo 1,000,000,007.

**Constraints:**
- `1 <= rectangles.length <= 200`
- Each rectangle holds four integers with `0 <= x1 < x2 <= 10^9` and `0 <= y1 < y2 <= 10^9`.
