Create a key-value store from scratch without relying on any ready-made hash table facility.

Work is driven by a recorded script: `operations[i]` names one of `MyHashMap`, `put`, `get`, or `remove`, while the parallel entry `args[i]` supplies its parameters — `[]` for building the store, `[key, value]` for `put`, and `[key]` for `get` plus `remove`.

Collect the outcome of every `get` (`-1` whenever the key is missing) preserving the order in which those lookups appear. Construction, `put`, and `remove` contribute no entries to the collected output.

Each script opens with `MyHashMap`, every key and value obeys `0 <= key, value <= 10^6`, and at most `10^4` invocations occur.

**Constraints:**
- `0 <= key, value <= 10^6`
- At most `10^4` calls to `put`, `get`, and `remove`.
- Every trace begins with `MyHashMap`.
