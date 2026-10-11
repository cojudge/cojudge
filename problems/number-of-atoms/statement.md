A chemical formula is written with element names, multipliers, and parentheses:

- An element name starts with one uppercase letter and may be followed by lowercase letters (for example `H`, `Mg`, `He`).
- A number written right after an element or a closing parenthesis tells how many copies to take. When no number is present, the count is one.
- Parentheses group a section; a number after `)` multiplies every count inside that group. Groups may nest.

Given such a formula, compute how many atoms of each element it holds. Return a compact string that lists every distinct element in alphabetical order, writing the element name followed by its count, but leaving out the count when it equals one.

**Example 1:**
```
Input: formula = "H2O"
Output: "H2O"
Explanation: Two hydrogen atoms and one oxygen atom; oxygen's count of one is omitted.
```

**Example 2:**
```
Input: formula = "Mg(OH)2"
Output: "H2MgO2"
Explanation: The group (OH) appears twice, giving H2, Mg1 and O2; names are sorted alphabetically.
```

**Example 3:**
```
Input: formula = "K4(ON(SO3)2)2"
Output: "K4N2O14S4"
Explanation: Nested groups multiply out: K4, N2, O14 and S4, ordered by name.
```

**Constraints:**
- `1 <= formula.length <= 1000`
- Element names, digits and parentheses only; parentheses are balanced and the formula is valid.
