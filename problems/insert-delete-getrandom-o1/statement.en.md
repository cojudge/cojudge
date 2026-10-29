Replay a constant-time set with random sampling through one batch function.

This is a deterministic, function-style adaptation of the classic randomized-set design: implement `runRandomizedSet(operations, values)`. Both arrays share one length. Entry `0` is always the constructor `"RandomizedSet"` with dummy value `0`. Each later entry is:

- `"insert"` with `values[i] = val`: store `val` when absent. Record `1` when the value was newly added, else `0`.
- `"remove"` with `values[i] = val`: delete `val` when present. Record `1` when something was removed, else `0`.
- `"getRandom"` with dummy `values[i] = 0`: record one element currently in the set.

Return one recorded entry per non-constructor step, in order. The classic version also demands uniform sampling and average O(1) time; this portable judge checks only validity — every `getRandom` entry must belong to the set at that moment — not the distribution. Keep average O(1) behavior with a hash map plus a compact list.

**Constraints:**
- `1 <= operations.length == values.length <= 2 * 10^5`
- `operations[0] == "RandomizedSet"`
- Later operations are `insert`, `remove`, or `getRandom`.
- `-2^31 <= val <= 2^31 - 1`
- `getRandom` is called only when the set holds at least one element.
