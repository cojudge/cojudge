Design a HashMap without using any built-in hash table libraries.

Implement the operations with a wrapper trace. `operations[i]` is one of `MyHashMap`, `put`, `get`, or `remove`. The aligned entry `args[i]` holds the arguments for that call: `[]` for construction, `[key, value]` for `put`, and `[key]` for `get` and `remove`.

Return an array containing the result of each `get` call (`-1` if the key is absent), in the order those queries occur. `MyHashMap`, `put`, and `remove` add nothing to the returned array.

Every trace starts with `MyHashMap` and satisfies `0 <= key, value <= 10^6`. At most `10^4` calls are made.

**Constraints:**

- 0 ≤ key, value ≤ 10^6
- At most 10^4 calls to put, get, and remove.
- Every trace begins with `MyHashMap`.
