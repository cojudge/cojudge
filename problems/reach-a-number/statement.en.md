You start at position `0` on an endless number line and want to reach `target`, which is never zero.

On move number `i` (counting from 1), you must walk exactly `i` steps either to the left or to the right. Moves accumulate: after three moves you have walked 1 + 2 + 3 steps split by direction choices.

Return the smallest number of moves that can land exactly on `target`.

**Constraints:**
- `-10^9 <= target <= 10^9`
- `target != 0`
