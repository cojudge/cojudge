Starting from a positive integer `n`, you may apply these moves: when the current value is even, halve it; when it is odd, either increment or decrement it by one. Count the fewest moves that reduce `n` to `1`.

The choice on odd values matters: sometimes going up first beats going down first, and the best local move depends on the lower bits.

**Constraints:**
- `1 <= n <= 2^31 - 1`

Care is needed near the upper bound, where incrementing temporarily exceeds 32-bit range.
