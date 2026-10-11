Replay a constant-time set with random sampling through one batch function.

This is a deterministic, function-style adaptation of the classic randomized-set design: implement `runRandomizedSet(operations, values)`. Both arrays share one length. Entry `0` is always the constructor `"RandomizedSet"` with dummy value `0`. Each later entry is:

- `"insert"` with `values[i] = val`: store `val` when absent. Record `1` when the value was newly added, else `0`.
- `"remove"` with `values[i] = val`: delete `val` when present. Record `1` when something was removed, else `0`.
- `"getRandom"` with dummy `values[i] = 0`: record one element currently in the set.

Return one recorded entry per non-constructor step, in order. The classic version also demands uniform sampling and average O(1) time; this portable judge checks only validity — every `getRandom` entry must belong to the set at that moment — not the distribution. Keep average O(1) behavior with a hash map plus a compact list.

**Example 1:**
```
Input: operations = ["RandomizedSet","insert","remove","insert","getRandom","remove","insert","getRandom"], values = [0,1,2,2,0,1,2,0]
Output: [1,0,1,X,1,0,2] (X is 1 or 2)
Explanation: insert 1 is new (1); remove 2 misses (0); insert 2 is new (1); getRandom returns a member of {1,2}; remove 1 hits (1); insert 2 already exists (0); getRandom must return 2.
```

**Example 2:**
```
Input: operations = ["RandomizedSet","insert","insert","getRandom"], values = [0,5,5,0]
Output: [1,0,5]
Explanation: The second insert of 5 is a duplicate (0); the only member is 5.
```

**Example 3:**
```
Input: operations = ["RandomizedSet","insert","remove","remove"], values = [0,3,3,3]
Output: [1,1,0]
Explanation: After inserting and removing 3, a second removal misses.
```

**Constraints:**
- `1 <= operations.length == values.length <= 2 * 10^5`
- `operations[0] == "RandomizedSet"`
- Later operations are `insert`, `remove`, or `getRandom`.
- `-2^31 <= val <= 2^31 - 1`
- `getRandom` is called only when the set holds at least one element.
