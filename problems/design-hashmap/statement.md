Design a HashMap without using any built-in hash table libraries.

Implement the `MyHashMap` class:

- `MyHashMap()` Initializes the `MyHashMap` object.
- `void put(int key, int value)` Inserts or updates the mapping from `key` to `value`.
- `int get(int key)` Returns the value mapped to `key`, or `-1` if there is no mapping.
- `void remove(int key)` Removes `key` and its mapped value. If there is no mapping, do nothing.

The class keeps its LeetCode name `MyHashMap` (the harness reserves `Solution` for the driver); the constructor and methods match the original. Construction, `put` and `remove` report `"null"`; each `get` reports the plain integer result.

**Example 1:**
```
Input: operations = ["MyHashMap","put","put","get","get","put","get","remove","get"], values = [[],[1,1],[2,2],[1],[3],[2,1],[2],[2],[2]]
Output: [null,null,null,1,-1,null,1,null,-1]
Explanation: put(1,1), put(2,2); get(1) is 1, get(3) is -1. After put(2,1) updates key 2, get(2) is 1; after remove(2), get(2) is -1.
```

**Example 2:**
```
Input: operations = ["MyHashMap","get","put","get","remove","get"], values = [[],[5],[5,7],[5],[5],[5]]
Output: [null,-1,null,7,null,-1]
Explanation: Initially get(5) is -1. After put(5,7), get(5) is 7; after remove(5), get(5) is -1.
```

**Example 3:**
```
Input: operations = ["MyHashMap","put","remove"], values = [[],[3,9],[3]]
Output: [null,null,null]
Explanation: No get calls, so every entry is null.
```

**Constraints:**
- `0 <= key, value <= 10^6`
- At most `10^4` calls will be made to `put`, `get` and `remove` in total.
- Every trace begins with `MyHashMap`.
