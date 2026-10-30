Design a HashSet without using any built-in hash table libraries.

Implement the `MyHashSet` class:

- `MyHashSet()` Initializes the `MyHashSet` object.
- `void add(int key)` Inserts the value `key` into the HashSet.
- `bool contains(int key)` Returns whether the value `key` exists in the HashSet or not.
- `void remove(int key)` Removes the value `key` from the HashSet. If `key` does not exist, do nothing.

The class keeps its LeetCode name `MyHashSet` (the harness reserves `Solution` for the driver); the constructor and methods match the original. Construction, `add` and `remove` report `"null"`; each `contains` reports `"true"` or `"false"`.

**Constraints:**
- `0 <= key <= 10^6`
- At most `10^4` calls will be made to `add`, `remove` and `contains` in total.
- Every trace begins with `MyHashSet`.
