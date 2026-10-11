You are handed a string `s` indexed from `0` alongside a word list `dictionary`. Split `s` into one or more chunks that do not overlap, where every kept chunk must show up verbatim in `dictionary`. Characters of `s` that fall outside all kept chunks count as leftover.

Arrange the split so that the total count of leftover characters is as small as possible, and report that minimum.

**Example 1:**

```
Input: s = "leetscode", dictionary = ["leet","code","leetcode"]
Output: 1
Explanation: Keep "leet" covering indices 0 through 3 and "code" covering indices 5 through 8. Only the character at index 4 stays unused, giving 1.
```

**Example 2:**

```
Input: s = "sayhelloworld", dictionary = ["hello","world"]
Output: 3
Explanation: Keep "hello" covering indices 3 through 7 and "world" covering indices 8 through 12. The characters at indices 0, 1 and 2 stay unused, giving 3.
```

**Constraints:**

- `1 <= s.length <= 50`
- `1 <= dictionary.length <= 50`
- `1 <= dictionary[i].length <= 50`
- `dictionary[i]` and `s` consist of only lowercase English letters.
- `dictionary` holds distinct words.
