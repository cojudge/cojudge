Spreadsheet columns are labelled A through Z, then AA, AB, and so on, like base-26 numbers but with digits 1-26 instead of 0-25. Given a column label, return its number: A is 1, Z is 26, AA is 27, AB is 28.

**Example 1:**
```
Input: columnTitle = "A"
Output: 1
Explanation: The first column is numbered 1.
```

**Example 2:**
```
Input: columnTitle = "AB"
Output: 28
Explanation: A contributes 1 * 26 plus B contributes 2, giving 28.
```

**Example 3:**
```
Input: columnTitle = "ZY"
Output: 701
Explanation: Z contributes 26 * 26 plus Y contributes 25, giving 701.
```

**Constraints:**
- `1 <= columnTitle.length <= 7`
- `columnTitle` holds only uppercase English letters.
