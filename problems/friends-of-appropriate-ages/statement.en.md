You are given an array `ages` where each entry is one person's age. Person `x` sends a request to a different person `y` exactly when all of the following hold:

- `y`'s age is more than half of `x`'s age plus seven (that is, the request is blocked when `ages[y] <= ages[x] / 2 + 7` using real division).
- `y`'s age is not greater than `x`'s age.
- It is not the case that `y` is over 100 while `x` is under 100.

Every ordered pair of distinct people is considered. Return the total number of requests sent.

**Constraints:**
- `1 <= ages.length <= 20000`
- `1 <= ages[i] <= 120`
