Two strings belong to the same shift group when each character of one can be shifted forward by the same amount (wrapping from `z` to `a`) to obtain the other. For example, `"abc"` shifts to `"bcd"`, and `"az"` shifts to `"ba"`.

Given an array of lowercase strings `strings`, partition them so that strings in one group all shift into each other.

Return the groups in any order, with the strings inside each group in any order.

*Type note:* the original signature returns a list of lists of strings; here it maps to `string_list_2d`.

**Example 1:**
```
Input: strings = ["abc","bcd","acef","xyz","az","ba","a","z"]
Output: [["a","z"],["abc","bcd","xyz"],["az","ba"],["acef"]]
Explanation: "abc", "bcd" and "xyz" share one shift pattern; "az" and "ba" share another; "a" and "z" are single letters; "acef" stands alone.
```

**Example 2:**
```
Input: strings = ["a"]
Output: [["a"]]
Explanation: A single string forms its own group.
```

**Constraints:**
- `1 <= strings.length <= 300`
- `1 <= strings[i].length <= 50`
- Each string holds lowercase English letters.
