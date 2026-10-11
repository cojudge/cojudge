Given a string `s` of lowercase letters, a large group is a maximal run of the same character with length at least 3. Maximal means the run cannot be extended on either side with the same letter. Return the start and end indices of every large group as `[start, end]` pairs in left-to-right order.

**Example 1:**
```
Input: s = "abbxxxxzzy"
Output: [[3,6]]
Explanation: The run of "xxxx" from index 3 to index 6 is the only run of length 3 or more.
```

**Example 2:**
```
Input: s = "abc"
Output: []
Explanation: No character repeats, so there are no large groups.
```

**Example 3:**
```
Input: s = "abcdddeeeeaabbbcd"
Output: [[3,5],[6,9],[12,14]]
Explanation: "ddd" spans 3 to 5, "eeee" spans 6 to 9, and "bbb" spans 12 to 14.
```

**Constraints:**
- `1 <= s.length <= 1000`
- `s` consists of lowercase English letters only
