Given a word list `words` and a number `k`, return the `k` words that appear most often. Order the answer from highest frequency to lowest; when two words share the same count, the one that comes earlier in the dictionary goes first.

Assume `k` is positive and never exceeds the number of distinct words.

**Example 1:**
```
Input: words = ["i","love","leetcode","i","love","coding"], k = 2
Output: ["i","love"]
Explanation: "i" and "love" each appear twice; "i" wins the tie by dictionary order.
```

**Example 2:**
```
Input: words = ["the","day","is","sunny","the","the","the","sunny","is","is"], k = 4
Output: ["the","is","sunny","day"]
Explanation: Counts are 4, 3, 2, 1, already matching the required order.
```

**Example 3:**
```
Input: words = ["a","b","c","a","b","a"], k = 1
Output: ["a"]
Explanation: "a" occurs three times, more than any other word.
```

**Constraints:**
- `1 <= words.length <= 500`
- `1 <= words[i].length <= 10`
- Words contain only lowercase letters.
- `1 <= k <= distinct word count`
