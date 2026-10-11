You are given a wall `grid` of `1`s (bricks) and `0`s (empty). A brick is stable when it sits in the top row or connects to a stable brick through shared sides (up, down, left, right). Each entry of `hits` names a cell whose brick, if present, is removed. After each removal, every brick that is no longer stable drops away.

For every hit in order, report how many bricks fell as a consequence, not counting the directly removed brick itself. A hit on an empty cell causes zero falls.

**Constraints:**
- `1 <= grid.length, grid[0].length <= 50` for these tests (original allows up to 200)
- `1 <= hits.length <= 100`
- `hits[i]` is a valid cell coordinate
