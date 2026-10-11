You are given two sentences, `s1` and `s2`, where words are separated by single spaces. A word is uncommon when it appears exactly once across both sentences put together.

Return the list of all uncommon words. The order of the returned words does not matter.

**Example 1:**
```
Input: s1 = "this apple is sweet", s2 = "this apple is sour"
Output: ["sweet","sour"]
Explanation: "this", "apple" and "is" each appear twice, while "sweet" and "sour" appear once.
```

**Example 2:**
```
Input: s1 = "apple apple", s2 = "banana"
Output: ["banana"]
Explanation: "apple" appears twice in total and "banana" appears once.
```

**Example 3:**
```
Input: s1 = "apple banana", s2 = "apple banana cherry"
Output: ["cherry"]
Explanation: "apple" and "banana" each appear twice, and "cherry" appears once.
```

**Constraints:**
- `1 <= s1.length, s2.length <= 200`
- Sentences hold lowercase English words joined by single spaces, with no leading or trailing spaces.
