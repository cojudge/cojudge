Design an algorithm to encode **a list of strings** to **a string**. The encoded string is then sent over the network and is decoded back to the original list of strings.

Implement the `Codec` class:

- `String encode(String[] strs)` — Encodes a list of strings to a single string.
- `List<String> decode(String s)` — Decodes a single string back to a list of strings.

**Example 1:**
```
Input: strs = ["hello","world"]
Output: ["hello","world"]
Explanation: The encoded string is decoded back to the original list.
```

**Example 2:**
```
Input: strs = [""]
Output: [""]
```

**Constraints:**
- `0 <= strs.length <= 100`
- `0 <= strs[i].length <= 200`
- `strs[i]` contains any possible characters (including non-ASCII characters and delimiters).
