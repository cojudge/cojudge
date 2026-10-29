Starting from a lattice point, you may repeatedly replace `(x, y)` with
either `(x + y, y)` or `(x, x + y)`. Both coordinates only grow, since all
values stay positive. Given a launch point `(sx, sy)` and a destination
`(tx, ty)`, determine whether the destination can ever be reached by a
sequence of such jumps.

Think backwards: from the target, the previous step must have subtracted
the smaller coordinate from the larger one. Repeating that reduction with
division (rather than one subtraction at a time) keeps the process fast
even for coordinates up to a billion.

**Constraints:**
- `1 <= sx, sy, tx, ty <= 10^9`
