Count how many structurally unique binary search trees can be formed using the values `1` through `n` in order. Only the shape and the placement of values matter; two trees that differ in structure count separately even if they hold the same keys.

The total follows the Catalan recurrence: with `r` as root, the left side contributes `count(r-1)` shapes and the right side contributes `count(n-r)` shapes. Summing the product over every choice of `r` gives the answer, with `count(0) = count(1) = 1`.

**Constraints:**
- `1 <= n <= 19`
