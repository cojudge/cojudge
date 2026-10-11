An integer array `stones` lists the weight of every rock, with `stones[i]` belonging to the `i`-th rock.

The rocks take part in the following game. On every move, pick any two rocks and crash them together: call their weights `x` and `y` with `x <= y`. The crash has this outcome:

- When `x == y`, both rocks vanish, and
- When `x != y`, the rock of weight `x` vanishes, while the rock of weight `y` survives with the reduced weight `y - x`.

Play continues until no more than one rock is left.

Report the lightest weight that this final rock can possibly have. When every rock can be eliminated, report `0`.

**Example 1:**
```
Input: stones = [2,7,4,1,8,1]
Output: 1
Explanation:
One optimal line merges 2 and 4 into 2, leaving [2,7,1,8,1]; then,
it merges 7 and 8 into 1, leaving [2,1,1,1]; then,
it merges 2 and 1 into 1, leaving [1,1,1]; then,
it merges 1 and 1 into 0, leaving [1], and that outcome cannot be beaten.
```

**Example 2:**
```
Input: stones = [31,26,33,21,40]
Output: 5
Explanation: No ordering of crashes can leave less than this; 5 is the best achievable remainder.
```

**Constraints:**
- 1 ≤ stones.length ≤ 30
- 1 ≤ stones[i] ≤ 100
