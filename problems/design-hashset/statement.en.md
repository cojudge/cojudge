Design a HashSet without using any built-in hash table libraries.

Implement the `MyHashSet` class:

- `MyHashSet()` Initializes the `MyHashSet` object.
- `void add(int key)` Inserts the value `key` into the HashSet.
- `bool contains(int key)` Returns whether the value `key` exists in the HashSet or not.
- `void remove(int key)` Removes the value `key` from the HashSet. If `key` does not exist, do nothing.

The class keeps its LeetCode name `MyHashSet` (the harness reserves `Solution` for the driver); the constructor and methods match the original. Construction, `add` and `remove` report `"null"`; each `contains` reports `"true"` or `"false"`.

**Example 1:**
```
Input: operations = ["MyHashSet","add","add","contains","contains","remove","contains"], values = [[],[1],[2],[1],[3],[2],[2]]
Output: [null,null,null,true,false,null,false]
Explanation: add(1), add(2); contains(1) is true, contains(3) is false; after remove(2), contains(2) is false.
```

**Example 2:**
```
Input: operations = ["MyHashSet","contains","add","contains","remove","contains"], values = [[],[5],[5],[5],[5],[5]]
Output: [null,false,null,true,null,false]
Explanation: Initially contains(5) is false. After add(5) it is true; after remove(5) it is false again.
```

**Example 3:**
```
Input: operations = ["MyHashSet","add","remove"], values = [[],[7],[7]]
Output: [null,null,null]
Explanation: No contains calls, so every entry is null.
```

**Constraints:**
- `0 <= key <= 10^6`
- At most `10^4` calls will be made to `add`, `remove` and `contains` in total.
- Every trace begins with `MyHashSet`.
