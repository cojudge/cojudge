There is a new alien language that uses the English alphabet (lowercase letters a-z). However, the order of the letters is unknown to you.

You are given a list of strings `words` from the alien language's dictionary, where the strings are **sorted lexicographically** by the rules of this new language.

Derive the order of characters in this alien language and return it as a string. If the given arrangement of words cannot correspond to any valid order of letters (e.g., due to a cycle in the character dependencies, or a longer word appearing before its prefix), return `""`. If there are multiple valid orders, return **any** of them.

**Constraints:**

- 1 <= words.length <= 100
- 1 <= words[i].length <= 100
- words[i] consists of only lowercase English letters.
