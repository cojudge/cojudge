This is an offline adaptation of an in-place task. The original asks you to reverse the order of words inside a character array without extra space. Here you receive the text as a string and return a new string with the words in reverse order.

Words are separated by single spaces, with no leading or trailing spaces. Keep every word intact and join them with single spaces in the new order.

**Example 1:**
```
Input: s = "the sky is blue"
Output: "blue is sky the"
Explanation: The four words appear in the opposite order.
```

**Example 2:**
```
Input: s = "hello"
Output: "hello"
Explanation: A single word stays the same.
```

**Example 3:**
```
Input: s = "a b c"
Output: "c b a"
Explanation: Three one-letter words are flipped.
```

**Constraints:**
- `1 <= s.length <= 10^4`
- `s` holds letters and single spaces between words.
- No leading or trailing spaces appear.
