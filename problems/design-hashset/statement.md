Design a HashSet without using any built-in hash table libraries.

Implement the operations with a wrapper trace. `operations[i]` is one of `MyHashSet`, `add`, `remove`, or `contains`. The aligned value `values[i]` is the key for `add`, `remove`, and `contains`, and is ignored for `MyHashSet` (construction).

Return an array containing `1` for each `contains` that finds the key and `0` otherwise, in the order those queries occur. `MyHashSet`, `add`, and `remove` add nothing to the returned array.

Every trace starts with `MyHashSet` and keys satisfy `0 <= key <= 10^6`. At most `10^4` calls are made.

**Constraints:**

- 0 ≤ key ≤ 10^6
- At most 10^4 calls to add, remove, and contains.
- Every trace begins with `MyHashSet`.
