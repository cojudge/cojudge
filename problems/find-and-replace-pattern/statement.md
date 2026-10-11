You are given a list of lowercase `words` and a lowercase `pattern`. A word fits the pattern when its letters follow the same repetition shape: the first distinct letter of the word lines up with the first distinct letter of the pattern, the second distinct with the second distinct, and so on, consistently in both directions.

Return every word that fits, keeping their original order.

**Example 1:**
```
Input: words = ["abc","deq","mee","aqq","dkd","ccc"], pattern = "abb"
Output: ["mee","aqq"]
Explanation: "mee" and "aqq" repeat their last two letters exactly like "abb" does. "abc" and "deq" use three distinct letters, "dkd" repeats the first and last, and "ccc" repeats everything.
```

**Example 2:**
```
Input: words = ["a","b","c"], pattern = "a"
Output: ["a","b","c"]
Explanation: Every single-letter word trivially shares the shape of a one-letter pattern.
```

**Constraints:**
- `1 <= words.length <= 50`
- `1 <= words[i].length, pattern.length <= 20`
- All strings hold lowercase English letters.
