A row of `n` washing machines holds `machines[i]` garments each. In one move, any number of machines may each hand a single garment to a neighboring machine (left or right). The goal is an even split where every machine ends with the same count.

Return the smallest number of moves that achieves the split, or `-1` when the total garment count is not divisible by `n` and sharing is therefore impossible.

**Constraints:**
- `1 <= machines.length <= 10^4`
- `0 <= machines[i] <= 10^5`
