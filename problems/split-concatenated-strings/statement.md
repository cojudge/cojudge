You are given an array of strings `strs`. You will build a circular loop by concatenating the strings in their given order, but before joining you may flip any individual string (write it backwards) or keep it as is.

Once the loop is fixed, choose any cut position inside it and straighten the circle into a linear string beginning at the cut. Among every choice of flips and every cut, return the lexicographically largest stringobtainable. (Compare strings character by character with usual alphabet order.)

**Example 1:**
```
Input: strs = ["abc","xyz"]
Output: "zyxcba"
Explanation: Flip both to "cba" and "zyx", join as "cbazyx", then start at the z to get "zyxcba".
```

**Example 2:**
```
Input: strs = ["abc"]
Output: "cba"
Explanation: The reversed loop "cba" offers cuts "cba", "bac", "acb", best is "cba".
```

**Example 3:**
```
Input: strs = ["ab","cd"]
Output: "dcba"
Explanation: Flip to "ba","dc", join "badc", best cut yields "dcba".
```

**Constraints:**
- `1 <= strs.length <= 1000`
- `1 <= strs[i].length <= 1000`
- `strs[i]` holds lowercase English letters
- Total characters across `strs` fit comfortably for quadratic scanning
