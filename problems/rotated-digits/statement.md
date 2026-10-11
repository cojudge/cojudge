Spin each decimal digit half a turn and see what it becomes. The digits
`0`, `1`, and `8` look the same afterwards; `2` and `5` turn into each
other; `6` and `9` turn into each other. The remaining digits (`3`, `4`,
`7`) break, so any number containing one of them is unusable.

Call a positive integer turning when every digit survives the spin and at
least one digit actually changes (that is, the number uses `2`, `5`, `6`,
or `9` somewhere). Given `n`, count how many turning integers lie in the
closed interval from `1` to `n`.

**Example 1:**
```
Input: n = 10
Output: 4
Explanation: The qualifying values are 2, 5, 6, and 9. The number 10
contains a 1 (unchanged) and a 0 (unchanged) with no changing digit, so it
does not count.
```

**Example 2:**
```
Input: n = 1
Output: 0
Explanation: The only candidate is 1, which spins to itself.
```

**Example 3:**
```
Input: n = 20
Output: 9
Explanation: The list is 2, 5, 6, 9, 12, 15, 16, 19, and 20.
```

**Constraints:**
- `1 <= n <= 10^4`
