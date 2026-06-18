import type { Param } from "./util";

export const csharpImage = 'mcr.microsoft.com/dotnet/sdk:8.0-alpine';

export const csharpListNodeClass = `
public class ListNode {
    public int val;
    public ListNode next;
    public ListNode() {}
    public ListNode(int val) { this.val = val; }
    public ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}
`;

export const csharpTreeNodeClass = `
public class TreeNode {
    public int val;
    public TreeNode left;
    public TreeNode right;
    public TreeNode() {}
    public TreeNode(int val) { this.val = val; }
    public TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
}
`;

export const csharpHelperMethods = `
public static class CSharpHelper {
    public static ListNode[] ToListNodeArray(string s) {
        string[] sarr = ToStringArray(s);
        ListNode[] res = new ListNode[sarr.Length];
        for (int i = 0; i < sarr.Length; i++) {
            res[i] = ToListNode(sarr[i]);
        }
        return res;
    }
    
    public static ListNode ToListNode(string s) {
        int[] arr = ToIntArray(s);
        if (arr.Length == 0) return null;
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        foreach (int x in arr) { cur.next = new ListNode(x); cur = cur.next; }
        return dummy.next;
    }
    
    public static string DisplayOutput(ListNode head) {
        StringBuilder sb = new StringBuilder();
        sb.Append("[");
        bool first = true;
        for (ListNode p = head; p != null; p = p.next) {
            if (!first) sb.Append(", ");
            first = false;
            sb.Append(p.val);
        }
        sb.Append("]");
        return sb.ToString();
    }
    
    public static string DisplayOutput(TreeNode root) {
        if (root == null) return "[]";
        List<string> outList = new List<string>();
        Queue<TreeNode> q = new Queue<TreeNode>();
        q.Enqueue(root);
        while (q.Count > 0) {
            var node = q.Dequeue();
            if (node == null) {
                outList.Add("null");
            } else {
                outList.Add(node.val.ToString());
                q.Enqueue(node.left);
                q.Enqueue(node.right);
            }
        }
        int i = outList.Count - 1;
        while (i >= 0 && outList[i] == "null") i--;
        StringBuilder sb = new StringBuilder();
        sb.Append("[");
        for (int j = 0; j <= i; j++) {
            if (j > 0) sb.Append(",");
            sb.Append(outList[j]);
        }
        sb.Append("]");
        return sb.ToString();
    }
    
    public static string DisplayOutput(string s) { return s; }
    public static string DisplayOutput(int val) { return val.ToString(); }
    public static string DisplayOutput(int[] val) { return "[" + string.Join(",", val) + "]"; }
    public static string DisplayOutput(int[][] val) {
        if (val == null || val.Length == 0) return "[]";
        StringBuilder sb = new StringBuilder();
        sb.Append("[");
        for (int i = 0; i < val.Length; i++) {
            if (i > 0) sb.Append(",");
            sb.Append("[" + string.Join(",", val[i]) + "]");
        }
        sb.Append("]");
        return sb.ToString();
    }
    public static string DisplayOutput(bool val) { return val.ToString(); }
    public static string DisplayOutputStringList(List<string> lst) {
        StringBuilder sb = new StringBuilder();
        sb.Append("[");
        int sz = lst.Count, idx = 0;
        foreach (string s in lst) {
            sb.Append(s);
            bool isLast = idx == sz - 1;
            if (!isLast) {
                sb.Append(",");
            }
            idx++;
        }
        sb.Append("]");
        return sb.ToString();
    }
    public static string DisplayOutputStringList2d(List<List<string>> lst) {
        StringBuilder sb = new StringBuilder();
        sb.Append("[");
        int sz = lst.Count, idx = 0;
        foreach (var l in lst) {
            sb.Append(DisplayOutputStringList(l));
            bool isLast = idx == sz - 1;
            if (!isLast) {
                sb.Append(",");
            }
            idx++;
        }
        sb.Append("]");
        return sb.ToString();
    }
    public static string DisplayOutputIntList(List<int> lst) {
        return "[" + string.Join(",", lst) + "]";
    }
    public static string DisplayOutputIntList2d(List<List<int>> lst) {
        StringBuilder sb = new StringBuilder();
        sb.Append("[");
        int sz = lst.Count, idx = 0;
        foreach (var l in lst) {
            sb.Append(DisplayOutputIntList(l));
            bool isLast = idx == sz - 1;
            if (!isLast) {
                sb.Append(",");
            }
            idx++;
        }
        sb.Append("]");
        return sb.ToString();
    }
    public static string JoinString(string[] s) { return string.Join("", s); }
    public static int ToInt(string s) { return int.Parse(s); }
    public static string ToString(string s) { return s; }
    public static bool ToBoolean(string s) { return s == "true"; }
    
    public static List<string> ToStringList(string s) {
        List<string> res = new List<string>();
        if (string.IsNullOrEmpty(s)) return res;
        string t = s.Trim();
        if (t.Length == 0 || t == "[]") return res;
        if (t.StartsWith("[")) t = t.Substring(1);
        if (t.EndsWith("]")) t = t.Substring(0, t.Length - 1);
        StringBuilder cur = new StringBuilder();
        bool inDQ = false, inSQ = false;
        for (int i = 0; i < t.Length; i++) {
            char c = t[i];
            if (c == '"' && !inSQ) { inDQ = !inDQ; continue; }
            if (c == '\\'' && !inDQ) { inSQ = !inSQ; continue; }
            if (c == ',' && !inDQ && !inSQ) {
                string token = cur.ToString().Trim();
                if (token.Length > 0) res.Add(token);
                cur.Clear();
            } else {
                cur.Append(c);
            }
        }
        string last = cur.ToString().Trim();
        if (last.Length > 0) res.Add(last);
        // unescape wrapping quotes if any remained
        for (int i = 0; i < res.Count; i++) {
            string x = res[i].Trim();
            if ((x.StartsWith("\\"") && x.EndsWith("\\"")) || (x.StartsWith("'") && x.EndsWith("'"))) {
                res[i] = x.Substring(1, x.Length - 1);
            } else {
                res[i] = x;
            }
        }
        return res;
    }
    
    public static string[] ToStringArray(string s) {
        return ToStringList(s).ToArray();
    }
    
    public static int[] ToIntArray(string s) {
        if (string.IsNullOrEmpty(s) || s == "[]") return new int[] { };
        s = s.Trim();
        if (s.StartsWith("[")) s = s.Substring(1);
        if (s.EndsWith("]")) s = s.Substring(0, s.Length - 1);
        string[] sarr = s.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
        List<int> result = new List<int>();
        foreach (string token in sarr) {
            string trimmed = token.Trim();
            if (!string.IsNullOrEmpty(trimmed)) {
                int parsed;
                if (int.TryParse(trimmed, out parsed)) {
                    result.Add(parsed);
                }
            }
        }
        return result.ToArray();
    }
    
    public static List<int> ToIntList(string s) {
        if (string.IsNullOrEmpty(s) || s == "[]") return new List<int>();
        s = s.Substring(1, s.Length - 1);
        string[] sarr = s.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
        List<int> res = new List<int>();
        foreach (string token in sarr) {
            res.Add(int.Parse(token.Trim()));
        }
        return res;
    }
    
    public static List<List<int>> ToIntList2d(string s) {
        List<List<string>> stringList = ToStringList2d(s);
        List<List<int>> res = new List<List<int>>();
        foreach (var lst in stringList) {
            List<int> cur = new List<int>();
            foreach (var x in lst) {
                cur.Add(int.Parse(x));
            }
            res.Add(cur);
        }
        return res;
    }
    
    public static List<List<string>> ToStringList2d(string s) {
        List<List<string>> res = new List<List<string>>();
        if (string.IsNullOrEmpty(s) || s == "[]") return res;
        s = s.Trim();
        if (s.StartsWith("[")) s = s.Substring(1);
        if (s.EndsWith("]")) s = s.Substring(0, s.Length - 1);
        int depth = 0; int start = 0;
        for (int i = 0; i < s.Length; i++) {
            char c = s[i];
            if (c == '[') depth++;
            if (c == ']') depth--;
            if (depth == 0 && c == ',') {
                string part = s.Substring(start, i - start).Trim();
                if (part.Length > 0) res.Add(ToStringList(part));
                start = i + 1;
            }
        }
        string last = s.Substring(start).Trim();
        if (last.Length > 0) res.Add(ToStringList(last));
        return res;
    }
    
    public static int[][] ToIntArray2d(string s) {
        if (string.IsNullOrEmpty(s) || s == "[]") return new int[][] { };
        s = s.Trim();
        if (s.StartsWith("[")) s = s.Substring(1);
        if (s.EndsWith("]")) s = s.Substring(0, s.Length - 1);
        List<int[]> rows = new List<int[]>();
        int depth = 0; int start = 0;
        for (int i = 0; i < s.Length; i++) {
            char c = s[i];
            if (c == '[') depth++;
            if (c == ']') depth--;
            if (depth == 0 && c == ',') {
                string part = s.Substring(start, i - start).Trim();
                if (part.Length > 0) rows.Add(ToIntArray(part));
                start = i + 1;
            }
        }
        string last = s.Substring(start).Trim();
        if (last.Length > 0) rows.Add(ToIntArray(last));
        return rows.ToArray();
    }
    
    public static char[] ToCharArray(string s) {
        List<string> tokens = ToStringList(s);
        char[] res = new char[tokens.Count];
        for (int i = 0; i < tokens.Count; i++) {
            string t = tokens[i];
            res[i] = t.Length > 0 ? t[0] : '\0';
        }
        return res;
    }
    
    public static char[][] ToCharArray2d(string s) {
        if (string.IsNullOrEmpty(s) || s == "[]") return new char[][] { };
        s = s.Trim();
        if (s.StartsWith("[")) s = s.Substring(1);
        if (s.EndsWith("]")) s = s.Substring(0, s.Length - 1);
        List<char[]> rows = new List<char[]>();
        int depth = 0; int start = 0;
        for (int i = 0; i < s.Length; i++) {
            char c = s[i];
            if (c == '[') depth++;
            if (c == ']') depth--;
            if (depth == 0 && c == ',') {
                string part = s.Substring(start, i - start).Trim();
                if (part.Length > 0) rows.Add(ToCharArray(part));
                start = i + 1;
            }
        }
        string last = s.Substring(start).Trim();
        if (last.Length > 0) rows.Add(ToCharArray(last));
        return rows.ToArray();
    }
    
    public static TreeNode ToTreeNode(string s) {
        if (string.IsNullOrEmpty(s)) return null;
        string t = s.Trim();
        if (t.Length == 0 || t == "[]") return null;
        if (t.StartsWith("[")) t = t.Substring(1);
        if (t.EndsWith("]")) t = t.Substring(0, t.Length - 1);
        List<string> tokens = new List<string>();
        StringBuilder cur = new StringBuilder();
        for (int i = 0; i < t.Length; i++) {
            char c = t[i];
            if (c == ',') {
                string part = cur.ToString().Trim();
                if (part.Length > 0) tokens.Add(part);
                cur.Clear();
            } else {
                cur.Append(c);
            }
        }
        string lastToken = cur.ToString().Trim();
        if (lastToken.Length > 0) tokens.Add(lastToken);
        if (tokens.Count == 0) return null;
        int idx = 0;
        string first = tokens[idx++];
        if (first == "null" || first == "None") return null;
        TreeNode root = new TreeNode(int.Parse(first));
        Queue<TreeNode> q = new Queue<TreeNode>();
        q.Enqueue(root);
        while (q.Count > 0 && idx < tokens.Count) {
            TreeNode node = q.Dequeue();
            string lv = tokens[idx++];
            if (lv != "null" && lv != "None") {
                node.left = new TreeNode(int.Parse(lv));
                q.Enqueue(node.left);
            }
            if (idx >= tokens.Count) break;
            string rv = tokens[idx++];
            if (rv != "null" && rv != "None") {
                node.right = new TreeNode(int.Parse(rv));
                q.Enqueue(node.right);
            }
        }
        return root;
    }
}
`;

// Splits a long string into multiple, concatenated C# string literals
export function formatAndSplitCSharpString(str: string, chunkSize = 3000): string {
    if (str === null || str === undefined) {
        return 'null';
    }
    if (typeof str !== 'string') {
        str = JSON.stringify(str);
    }
    const escapedStr = str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    if (escapedStr.length <= chunkSize) {
        return `"${escapedStr}"`;
    }
    const chunks: string[] = [];
    for (let i = 0; i < escapedStr.length; i += chunkSize) {
        const chunk = escapedStr.substring(i, i + chunkSize);
        chunks.push(`"${chunk}"`);
    }
    const res = chunks.join(' +\n');
    return `string.Join("", ${res})`;
}

export function csharpGetFullParam(params: Param[], tc: any): string {
    let fullParam = '';
    let index = 0;
    for (const param of params) {
        const val = tc[param.name];
        if (param.type === 'string') {
            fullParam += formatAndSplitCSharpString(val);
        } else if ((param.type as any) === 'list_node') {
            fullParam += `CSharpHelper.ToListNode(${formatAndSplitCSharpString(val)})`;
        } else if ((param.type as any) === 'tree_node') {
            fullParam += `CSharpHelper.ToTreeNode(${formatAndSplitCSharpString(val)})`;
        } else if (param.type === 'string_array') {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            fullParam += `CSharpHelper.ToStringArray(${formatAndSplitCSharpString(strVal)})`;
        } else if (param.type === 'int_array') {
            fullParam += `CSharpHelper.ToIntArray(${formatAndSplitCSharpString(val)})`;
        } else if (param.type === 'int') {
            fullParam += `${val}`;
        } else if (param.type === 'int_array_2d') {
            fullParam += `CSharpHelper.ToIntArray2d(${formatAndSplitCSharpString(val)})`;
        } else if (param.type === 'char_array_2d') {
            fullParam += `CSharpHelper.ToCharArray2d(${formatAndSplitCSharpString(val)})`;
        } else if (param.type === 'list_node_array') {
            fullParam += `CSharpHelper.ToListNodeArray(${formatAndSplitCSharpString(val)})`;
        } else if (param.type === 'string_list_2d') {
            fullParam += `CSharpHelper.ToStringList2d(${formatAndSplitCSharpString(val)})`;
        }
        index++;
        const isLast = index == params.length;
        if (!isLast) {
            fullParam += ',';
        }
    }
    return fullParam;
}

export function getDisplayFuncName(outputType: string): string {
    return outputType === 'string_list' ? 'CSharpHelper.DisplayOutputStringList' :
            outputType === 'string_list_2d' ? 'CSharpHelper.DisplayOutputStringList2d' :
            outputType === 'int_list' ? 'CSharpHelper.DisplayOutputIntList' : 
            outputType === 'int_list_2d' ? 'CSharpHelper.DisplayOutputIntList2d' : 
            'CSharpHelper.DisplayOutput';
}

export function generateCSharpClassSolution(className: string): string {
    return `
using System;
using System.Collections.Generic;

public class Solution {
    public List<string> Solve(string[] operations, int[][] values) {
        var result = new List<string>();
        ${className} obj = null;
        for (int i = 0; i < operations.Length; i++) {
            string op = operations[i];
            if (op == "${className}") {
                obj = new ${className}();
                result.Add("null");
            } else if (op == "addNum") {
                obj.AddNum(values[i][0]);
                result.Add("null");
            } else if (op == "findMedian") {
                double med = obj.FindMedian();
                if (med == (long)med) {
                    result.Add(((long)med).ToString() + ".0");
                } else {
                    result.Add(med.ToString());
                }
            }
        }
        return result;
    }
}`;
}

export function generateCSharpRunner(functionName: string, params: Param[], testCases: any[], outputType: string): string {
    // Convert camelCase to PascalCase for C#
    const csharpFunctionName = functionName.charAt(0).toUpperCase() + functionName.slice(1);
    
    const testCalls = testCases
        .map((tc, idx) => {
            let fullParam = csharpGetFullParam(params, tc);
            return `var __res${idx} = sol.${csharpFunctionName}(${fullParam});\nConsole.WriteLine(":::RESULT:::" + ${getDisplayFuncName(outputType)}(__res${idx}));\nConsole.WriteLine("---");`;
        })
        .join('\n        ');

    return `
using System;
using System.Collections.Generic;
using System.Text;

#nullable disable

${csharpHelperMethods}

public class Program {
    public static void Main(string[] args) {
        Solution sol = new Solution();
        ${testCalls}
    }
}`;
}
