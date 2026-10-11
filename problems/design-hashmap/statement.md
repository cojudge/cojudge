Create a key-value store from scratch without relying on any ready-made hash table facility.

Work is driven by a recorded script: `operations[i]` names one of `MyHashMap`, `put`, `get`, or `remove`, while the parallel entry `args[i]` supplies its parameters — `[]` for building the store, `[key, value]` for `put`, and `[key]` for `get` plus `remove`.

Collect the outcome of every `get` (`-1` whenever the key is missing) preserving the order in which those lookups appear. Construction, `put`, and `remove` contribute no entries to the collected output.

Each script opens with `MyHashMap`, every key and value obeys `0 <= key, value <= 10^6`, and at most `10^4` invocations occur.

**Example 1:**
```
Input: operations = ["MyHashMap","put","put","get","get","put","get","remove","get"], args = [[],[1,1],[2,2],[1],[3],[2,1],[2],[2],[2]]
Output: [1,-1,1,-1]
```

**Example 2:**
```
Input: operations = ["MyHashMap","get","put","get","remove","get"], args = [[],[5],[5,7],[5],[5],[5]]
Output: [-1,7,-1]
```

**Constraints:**
- `0 <= key, value <= 10^6`
- At most `10^4` calls to `put`, `get`, and `remove`.
- Every trace begins with `MyHashMap`.
