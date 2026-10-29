Implement the `RandomizedSet` class:

- `RandomizedSet()` Initializes the `RandomizedSet` object.
- `bool insert(int val)` Inserts an item `val` into the set if not present. Returns `true` if the item was not present, `false` otherwise.
- `bool remove(int val)` Removes an item `val` from the set if present. Returns `true` if the item was present, `false` otherwise.
- `int getRandom()` Returns a random element from the current set of elements (it is guaranteed that at least one element exists when this method is called). Each element must have the same probability of being returned.

You must implement the functions of the class such that each function works in average O(1) time complexity.

The class keeps its LeetCode name `RandomizedSet` here (instead of `Solution`) because the judge harness reserves `Solution` for its driver; the constructor and methods match the original.

Grading: `insert`/`remove` booleans are compared exactly against a reference model, and each `getRandom` output must be a member of the live set at that point. Only validity is checked — uniformity over the set is not statistically tested.

**Example 1:**
```
Input: operations = ["RandomizedSet","insert","insert","remove"], values = [[],[1],[2],[1]]
Output: [null,true,true,true]
Explanation: Insert 1 and 2 (both new), then remove 1.
```

**Example 2:**
```
Input: operations = ["RandomizedSet","insert","insert","remove"], values = [[],[0],[0],[1]]
Output: [null,true,false,false]
Explanation: Inserting 0 twice records true then false; removing the absent 1 records false.
```

**Example 3:**
```
Input: operations = ["RandomizedSet","insert","getRandom","remove"], values = [[],[5],[],[5]]
Output: [null,true,5,true]
Explanation: With only 5 in the set, getRandom must return 5; removing 5 then succeeds.
```

**Constraints:**
- `-2^31 <= val <= 2^31 - 1`
- At most `2 * 10^5` calls will be made to `insert`, `remove`, and `getRandom`.
- `getRandom` will only be called when the set holds at least one element.
