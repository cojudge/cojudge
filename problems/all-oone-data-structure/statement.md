Maintain counts for a dynamic set of lowercase keys. You receive two parallel arrays describing a script: `operations` names the action at each step and `values` carries its argument (an empty string when the action takes none).

The script always starts with `"AllOne"` (create the structure, answer `"null"`). Later steps use:
- `"inc"` with a key: raise that key's count by one, inserting at 1 when new; answer `"null"`.
- `"dec"` with a key: lower that key's count by one, removing keys that reach zero; the key is guaranteed present; answer `"null"`.
- `"getMaxKey"`: return any key currently holding the largest count, or `""` when empty.
- `"getMinKey"`: return any key currently holding the smallest count, or `""` when empty.

Write `runAllOne`, which replays the whole script and returns the per-step answers (`"null"` for mutating or constructing steps, the requested key otherwise). When several keys tie for max or min, any tied key is accepted by the checker.

**Example 1:**
```
Input: operations = ["AllOne","inc","inc","getMaxKey","getMinKey","inc","getMaxKey","getMinKey"]
       values     = ["","hello","hello","","","leet","",""]
Output: ["null","null","null","hello","hello","null","hello","hello"]
Explanation: "hello" reaches 2, then "leet" joins at 1; both extremes stay "hello" until "leet" appears, after which min could be "leet" in other valid outputs — here max stays "hello" and min is tie-checked.
```

**Example 2:**
```
Input: operations = ["AllOne","inc","inc","inc","getMaxKey","getMinKey","dec","getMaxKey","getMinKey"]
       values     = ["","a","b","b","","","b","",""]
Output: ["null","null","null","null","b","a","null","b","a"]
Explanation: Counts become a:1, b:2, so max is "b" and min is "a"; after decrementing "b" both sit at 1 and either key may serve as max or min (checker accepts ties).
```

**Constraints:**
- Key length lies in `[1, 10]`, lowercase letters only.
- At most `5 * 10^4` calls in one script.
- Every `dec` targets an existing key.

Adaptation: the source is a stateful `AllOne` class; here it is modeled as the `runAllOne(operations, values)` replay function with `string_array` inputs and `string_list` output so all runners can drive it. Average O(1) per action is intended but only answer correctness is checked.
