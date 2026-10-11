Create a set of distinct keys from scratch without relying on any ready-made hash table facility.

Work is driven by a recorded script: `operations[i]` names one of `MyHashSet`, `add`, `remove`, or `contains`, while the parallel entry `values[i]` gives the key for `add`, `remove`, and `contains` (it is disregarded for the `MyHashSet` construction step).

Collect one number per `contains` — `1` when the key is present and `0` when it is absent — preserving the order in which those checks appear. Construction, `add`, and `remove` contribute no entries to the collected output.

Each script opens with `MyHashSet`, every key obeys `0 <= key <= 10^6`, and at most `10^4` invocations occur.

**Example 1:**
```
Input: operations = ["MyHashSet","add","add","contains","contains","add","contains","remove","contains"], values = [0,1,2,1,3,2,2,2,2]
Output: [1,0,1,0]
```

**Example 2:**
```
Input: operations = ["MyHashSet","contains","add","contains","remove","contains"], values = [0,5,5,5,5,5]
Output: [0,1,0]
```

**Constraints:**
- `0 <= key <= 10^6`
- At most `10^4` calls to `add`, `remove`, and `contains`.
- Every trace begins with `MyHashSet`.
