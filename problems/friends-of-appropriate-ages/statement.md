You are given an array `ages` where each entry is one person's age. Person `x` sends a request to a different person `y` exactly when all of the following hold:

- `y`'s age is more than half of `x`'s age plus seven (that is, the request is blocked when `ages[y] <= ages[x] / 2 + 7` using real division).
- `y`'s age is not greater than `x`'s age.
- It is not the case that `y` is over 100 while `x` is under 100.

Every ordered pair of distinct people is considered. Return the total number of requests sent.

**Example 1:**
```
Input: ages = [16,16]
Output: 2
Explanation: Each of the two people aged 16 sends to the other one, since 16 > 16/2 + 7 and neither rule blocks it.
```

**Example 2:**
```
Input: ages = [16,17,18]
Output: 2
Explanation: The person aged 17 sends to the one aged 16, and the person aged 18 sends to the one aged 17. All other pairs are blocked by one of the rules.
```

**Example 3:**
```
Input: ages = [20,30,100,110,120]
Output: 3
Explanation: Only three ordered pairs survive all three rules.
```

**Constraints:**
- `1 <= ages.length <= 20000`
- `1 <= ages[i] <= 120`
