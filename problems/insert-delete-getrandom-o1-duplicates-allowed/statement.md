Replay a multiset with random sampling through one batch function.

This is a deterministic, function-style adaptation of the classic duplicates-allowed design: implement `runRandomizedCollection(operations, values)`. Both arrays share one length. Entry `0` is always `"RandomizedCollection"` with dummy value `0`. Each later entry is:

- `"insert"` with `values[i] = val`: add one copy of `val` (duplicates allowed). Record `1` when no copy existed before, else `0`.
- `"remove"` with `values[i] = val`: delete one copy when present. Record `1` when a copy was removed, else `0`.
- `"getRandom"` with dummy `values[i] = 0`: record one value currently held (any copy).

Return one recorded entry per non-constructor step, in order. The classic version also demands sampling proportional to multiplicity and average O(1) time; this portable judge checks only validity — each `getRandom` entry must have a remaining copy — not the distribution. Aim for average O(1) with a list plus index sets.

**Constraints:**
- `1 <= operations.length == values.length <= 2 * 10^5`
- `operations[0] == "RandomizedCollection"`
- Later operations are `insert`, `remove`, or `getRandom`.
- `-2^31 <= val <= 2^31 - 1`
- `getRandom` is called only when at least one copy is held.
