You are given balloons as segments `points`, where each entry `[xstart, xend]` spans that closed interval on a line. One arrow shot straight up at position `x` pops every balloon whose span contains `x`.

Find the smallest number of arrows that pop all balloons.

**Constraints:**
- `1 <= points.length <= 10^5`
- Each entry has two values with `-2^31 <= xstart <= xend <= 2^31 - 1`.
