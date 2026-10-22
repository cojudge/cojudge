A sorted list of distinct integers is hidden behind a reader. Interact with the judge object `reader` — your code never receives the array or its length:

- `get(index)` returns the element at `index`, or `2147483647` if `index` is out of bounds.

Implement `search(reader, target)` returning the index of `target`, or `-1` when absent. Because the length is unknown, grow a window exponentially (`1, 2, 4, 8, ...`) until it covers `target`, then binary search inside it. The judge counts your `get` calls and reports Wrong Answer if you exceed **10000** calls on a test case.

Method names per language: Java `reader.get(index)`, Python `reader.get(index)`, C++ `reader.get(index)`, C# `reader.Get(index)`, Rust `reader.get(index)`, Go `reader.Get(index)`, TypeScript `reader.get(index)`, PHP `$reader->get($index)`.

**Constraints:**

- `1 <= secret.length <= 10^4`
- `-10^4 <= secret[i], target <= 10^4`
- Values in `secret` are strictly increasing.
- At most 10000 `get` calls per test case.
