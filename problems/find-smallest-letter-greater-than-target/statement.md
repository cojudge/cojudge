You are handed a list of lowercase letters sorted from smallest to largest, holding at least two different letters, plus a single target letter.

Scan the list and pick the smallest entry that comes strictly after the target in alphabetical order. If every entry is at or before the target, wrap around and return the first entry of the list.

Adaptation for this judge: the original statement uses a character array and single characters; here each letter is a one-character string, so `letters` is a string array and both `target` and the answer are strings.

**Example 1:**
```
Input: letters = ["c","f","j"], target = "a"
Output: "c"
Explanation: All three entries sit after "a", and "c" is the earliest of them.
```

**Example 2:**
```
Input: letters = ["c","f","j"], target = "c"
Output: "f"
Explanation: The entries after "c" are "f" and "j"; the smaller is "f".
```

**Example 3:**
```
Input: letters = ["x","x","y","y"], target = "z"
Output: "x"
Explanation: Nothing sits after "z", so wrap to the front entry "x".
```

**Constraints:**
- `2 <= letters.length <= 10^4`
- Each entry of `letters` is a lowercase English letter.
- `letters` is sorted in non-decreasing order.
- `letters` holds at least two distinct letters.
- `target` is a lowercase English letter.
