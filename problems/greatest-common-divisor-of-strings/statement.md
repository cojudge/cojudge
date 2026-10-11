Call a string `t` a divisor of a string `s` precisely when building `s` is possible by writing `t` consecutively one or more times, i.e. `s = t + t + ... + t`.

Given two strings `str1` and `str2`, find the longest string `x` that divides each of them.

**Examples:**

```
Input: str1 = "ABCABC", str2 = "ABC"
Output: "ABC"
```

```
Input: str1 = "ABABAB", str2 = "ABAB"
Output: "AB"
```

```
Input: str1 = "LEET", str2 = "CODE"
Output: ""
```

**Constraints:**

- `1 <= str1.length, str2.length <= 1000`
- `str1` and `str2` use only uppercase English letters.
