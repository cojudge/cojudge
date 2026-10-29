Create a set of distinct keys from scratch without relying on any ready-made hash table facility.

Work is driven by a recorded script: `operations[i]` names one of `MyHashSet`, `add`, `remove`, or `contains`, while the parallel entry `values[i]` gives the key for `add`, `remove`, and `contains` (it is disregarded for the `MyHashSet` construction step).

Collect one number per `contains` — `1` when the key is present and `0` when it is absent — preserving the order in which those checks appear. Construction, `add`, and `remove` contribute no entries to the collected output.

Each script opens with `MyHashSet`, every key obeys `0 <= key <= 10^6`, and at most `10^4` invocations occur.

**Constraints:**
- `0 <= key <= 10^6`
- At most `10^4` calls to `add`, `remove`, and `contains`.
- Every trace begins with `MyHashSet`.
