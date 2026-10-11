Starting from a lattice point, you may repeatedly replace `(x, y)` with
either `(x + y, y)` or `(x, x + y)`. Both coordinates only grow, since all
values stay positive. Given a launch point `(sx, sy)` and a destination
`(tx, ty)`, determine whether the destination can ever be reached by a
sequence of such jumps.

Think backwards: from the target, the previous step must have subtracted
the smaller coordinate from the larger one. Repeating that reduction with
division (rather than one subtraction at a time) keeps the process fast
even for coordinates up to a billion.

**Example 1:**
```
Input: sx = 1, sy = 1, tx = 3, ty = 5
Output: true
Explanation: One possible forward chain is (1,1) -> (1,2) -> (3,2) -> (3,5),
which lands on the target.
```

**Example 2:**
```
Input: sx = 1, sy = 1, tx = 2, ty = 2
Output: false
Explanation: Every reachable pair except the start has coordinates with no
common divisor larger than 1 shared in that way; (2,2) never appears.
```

**Example 3:**
```
Input: sx = 1, sy = 1, tx = 1, ty = 1
Output: true
Explanation: The launch already equals the destination, so zero steps suffice.
```

**Constraints:**
- `1 <= sx, sy, tx, ty <= 10^9`
