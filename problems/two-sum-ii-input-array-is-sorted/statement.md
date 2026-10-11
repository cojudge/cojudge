You receive `numbers`, a 1-indexed integer list already arranged from smallest
to largest, plus a `target` value. Identify two separate entries that add to
`target`.

Give back the pair as `[index1, index2]` with
`1 <= index1 < index2 <= numbers.length`. Each test case contains exactly one
valid pair, and no entry may be paired with itself.

**Constraints:**

- `2 <= numbers.length <= 30000`
- `-1000 <= numbers[i] <= 1000`
- `-1000 <= target <= 1000`
- `numbers` is sorted in non-decreasing order.
- There is exactly one valid pair.
