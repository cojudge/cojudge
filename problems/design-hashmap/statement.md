Design a HashMap without using any built-in hash table libraries.

Implement the `MyHashMap` class:

- `MyHashMap()` Initializes the `MyHashMap` object.
- `void put(int key, int value)` Inserts or updates the mapping from `key` to `value`.
- `int get(int key)` Returns the value mapped to `key`, or `-1` if there is no mapping.
- `void remove(int key)` Removes `key` and its mapped value. If there is no mapping, do nothing.

The class keeps its LeetCode name `MyHashMap` (the harness reserves `Solution` for the driver); the constructor and methods match the original. Construction, `put` and `remove` report `"null"`; each `get` reports the plain integer result.

**Constraints:**
- `0 <= key, value <= 10^6`
- At most `10^4` calls will be made to `put`, `get` and `remove` in total.
- Every trace begins with `MyHashMap`.
