You are given rods of various integer lengths and want to mount a billboard on two supports of exactly equal height. Each rod can be assigned to the left support, to the right support, or left unused, and the height of a support is the total length of the rods assigned to it.

Choose the assignments so that both supports end up with the same height, and make that shared height as large as possible. Return the tallest balanced height you can build, or 0 when no balanced pair of supports exists.

**Constraints:**
- `1 <= rods.length <= 20`
- `1 <= rods[i] <= 20`
