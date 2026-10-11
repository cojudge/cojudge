Look at every contiguous block inside `arr` (a block must keep neighbours together and cannot be empty). For each block compute the bitwise OR of its entries — the OR of a lone entry is the entry itself.

How many different OR values appear across all blocks?

**Constraints:**
- `1 <= arr.length <= 5 * 10^4`
- `0 <= arr[i] <= 10^9`
