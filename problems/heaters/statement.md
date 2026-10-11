Houses and heaters sit at integer spots on a single line. Every heater warms the interval centered on it with some shared radius `r`: a house at `h` is warm when some heater at `t` satisfies `|h - t| <= r`. All heaters must use the same radius.

Find the smallest radius that leaves every house warm.

**Example 1:**

```
Input: houses = [1,2,3], heaters = [2]
Output: 1
Explanation: One heater at 2 reaches 1 and 3 exactly with radius 1.
```

**Example 2:**

```
Input: houses = [1,2,3,4], heaters = [1,4]
Output: 1
Explanation: The left heater covers 1 and 2, the right heater covers 3 and 4.
```

**Example 3:**

```
Input: houses = [1,5], heaters = [2]
Output: 3
Explanation: The lone heater must stretch 3 steps to reach house 5.
```

**Constraints:**

- `1 <= houses.length, heaters.length <= 3 * 10^4`
- `1 <= houses[i], heaters[i] <= 10^9`
