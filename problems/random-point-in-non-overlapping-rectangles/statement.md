You are given several axis-aligned rectangles that never overlap. Each rectangle is written as `[a, b, x, y]`, where `(a, b)` is its bottom-left corner and `(x, y)` is its top-right corner. Every integer coordinate point on the border or inside counts as covered.

The original challenge asks for a class that returns a uniformly random covered integer point on each `pick` call. This offline adaptation simplifies the task: implement a function that returns any single integer point `[u, v]` lying inside at least one of the rectangles.

The checker does not test randomness or distribution — it only verifies containment. Hence returning a corner of the first rectangle is accepted, as is any other covered point.

**Constraints:**
- `1 <= rects.length <= 100`
- Each rectangle has 4 entries with `a < x` or `a == x` allowed only for degenerate single points; generally `a <= x` and `b <= y`
- Coordinates fit in 32-bit signed range
- Rectangles do not overlap
