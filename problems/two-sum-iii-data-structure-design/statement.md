Design a data structure that supports adding numbers and finding whether any pair of previously added numbers sums to a target value.

Implement the `TwoSum` class:

- `TwoSum()` Initializes the `TwoSum` object.
- `void add(int number)` Adds `number` to the data structure.
- `boolean find(int value)` Returns `true` if there exist two stored entries (two different additions) whose sum equals `value`, and `false` otherwise. A single stored copy cannot pair with itself: `find` needs two copies of `x` to report `true` for `value = 2 * x`.

The class keeps its LeetCode name `TwoSum` (the harness reserves `Solution` for the driver); the constructor and methods match the original.

**Example 1:**
```
Input: operations = ["TwoSum","add","add","add","find","find"], values = [[],[1],[3],[5],[4],[7]]
Output: [null,null,null,null,true,false]
Explanation: After storing 1, 3, 5: 4 equals 1 + 3 (true), while no pair sums to 7 (false).
```

**Example 2:**
```
Input: operations = ["TwoSum","add","add","find"], values = [[],[0],[0],[0]]
Output: [null,null,null,true]
Explanation: The two stored zeros sum to 0.
```

**Example 3:**
```
Input: operations = ["TwoSum","add","find","find"], values = [[],[5],[5],[10]]
Output: [null,null,false,false]
Explanation: A single stored 5 cannot pair with itself; 10 also has no pair yet.
```

**Constraints:**
- `-10^5 <= number, value <= 10^5`
- At most `10^4` calls will be made to `add` and `find`.
- Every trace begins with `TwoSum`; `add` and `find` each take one argument.
