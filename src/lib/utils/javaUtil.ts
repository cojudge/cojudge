import type { Param } from "./util";

export const javaImage = 'openjdk:17-slim';

export const javaListNodeClass = `
    public class ListNode {
        int val;
        ListNode next;
        ListNode() {}
        ListNode(int val) { this.val = val; }
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }
`;

export const javaTreeNodeClass = `
    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        TreeNode() {}
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
    }
`;

export const javaHelperMethods = `
    private static ListNode[] to_list_node_array(String s) throws Exception {
        String[] sarr = to_string_array(s);
        ListNode[] res = new ListNode[sarr.length];
        for (int i = 0; i < sarr.length; i++) {
            res[i] = to_list_node(sarr[i]);
        }
        return res;
    }
    private static ListNode to_list_node(String s) throws Exception {
        int[] arr = to_int_array(s);
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        for (int x : arr) { cur.next = new ListNode(x); cur = cur.next; }
        return dummy.next;
    }
    private static String displayOutput(ListNode head) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        boolean first = true;
        for (ListNode p = head; p != null; p = p.next) {
            if (!first) sb.append(", ");
            first = false;
            sb.append(p.val);
        }
        sb.append("]");
        return sb.toString();
    }
    private static String displayOutput(TreeNode root) {
        if (root == null) return "[]";
        List<String> out = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            var node = q.poll();
            if (node == null) {
                out.add("null");
            } else {
                out.add(""+node.val);
                q.add(node.left);
                q.add(node.right);
            }
        }
        int i = out.size() - 1;
        while (i >= 0 && out.get(i).equals("null")) i--;
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int j = 0; j <= i; j++) {
            if (j > 0) sb.append(",");
            sb.append(out.get(j));
        }
        sb.append("]");
        return sb.toString();
    }
    private static String displayOutput(String s) { return s; }
    private static String displayOutput(int val) { return val+""; }
    private static String displayOutput(int[] val) { return Arrays.toString(val); }
    private static String displayOutput(int[][] val) { return Arrays.deepToString(val).replace(" ", ""); }
    private static String displayOutput(boolean val) { return val+""; }
    private static String displayOutputStringList(List<String> lst) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        int sz = lst.size(), idx = 0;
        for (String s : lst) {
            sb.append(s);
            boolean isLast = idx == sz - 1;
            if (!isLast) {
                sb.append(",");
            }
            idx++;
        }
        sb.append("]");
        return sb.toString();
    }
    private static String displayOutputStringList2d(List<List<String>> lst) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        int sz = lst.size(), idx = 0;
        for (var l : lst) {
            sb.append(displayOutputStringList(l));
            boolean isLast = idx == sz - 1;
            if (!isLast) {
                sb.append(",");
            }
            idx++;
        }
        sb.append("]");
        return sb.toString();
    }
    private static String displayOutputIntList(List<Integer> lst) {
        return displayOutput(lst.stream()
                .mapToInt(Integer::intValue)
                .toArray());
    }
    private static String displayOutputIntList2d(List<List<Integer>> lst) {
        return displayOutput(lst.stream()
                .map(list -> list.stream().mapToInt(Integer::intValue).toArray())
                .toArray(int[][]::new));
    }
    private static String joinString(String[] s) { return String.join("", s); }
    private static int to_int(String s) { return Integer.parseInt(s); }
    private static String to_string(String s) { return s; }
    private static boolean to_boolean(String s) { return s.equals("true"); }
    // Parse a JSON-like array string to a List<String>, tolerant to single/double quotes and spaces
    private static List<String> to_string_list(String s) {
        List<String> res = new ArrayList<>();
        if (s == null) return res;
        String t = s.trim();
        if (t.length() == 0 || t.equals("[]")) return res;
        if (t.startsWith("[")) t = t.substring(1);
        if (t.endsWith("]")) t = t.substring(0, t.length()-1);
        StringBuilder cur = new StringBuilder();
        boolean inDQ = false, inSQ = false;
        for (int i = 0; i < t.length(); i++) {
            char c = t.charAt(i);
            if (c == '"' && !inSQ) { inDQ = !inDQ; continue; }
            if (c == '\\'' && !inDQ) { inSQ = !inSQ; continue; }
            if (c == ',' && !inDQ && !inSQ) {
                String token = cur.toString().trim();
                if (token.length() > 0) res.add(token);
                cur.setLength(0);
            } else {
                cur.append(c);
            }
        }
        String last = cur.toString().trim();
        if (last.length() > 0) res.add(last);
        // unescape wrapping quotes if any remained
        for (int i = 0; i < res.size(); i++) {
            String x = res.get(i).trim();
            if ((x.startsWith("\\"") && x.endsWith("\\"")) || (x.startsWith("'") && x.endsWith("'"))) {
                res.set(i, x.substring(1, x.length()-1));
            } else {
                res.set(i, x);
            }
        }
        return res;
    }
    private static String[] to_string_array(String s) {
        return to_string_list(s).toArray(new String[0]);
    }
    private static int[] to_int_array(String s) throws Exception {
        if (s == null || s.length() == 0 || s.equals("[]")) return new int[] {};
        s = s.substring(1, s.length() - 1);
        String[] sarr = s.split(", *");
        int[] res = new int[sarr.length];
        for (int i = 0; i < res.length; i++) {
            String token = sarr[i].trim();
            if (token.length() == 0) continue;
            res[i] = Integer.parseInt(token);
        }
        return res;
    }
    private static List<Integer> to_int_list(String s) throws Exception {
        if (s == null || s.length() == 0 || s.equals("[]")) return new ArrayList<Integer>();
        s = s.substring(1, s.length() - 1);
        String[] sarr = s.split(", *");
        List<Integer> res = new ArrayList<>();
        for (int i = 0; i < sarr.length; i++) {
            String token = sarr[i].trim();
            res.add(Integer.parseInt(token));
        }
        return res;
    }
    private static List<List<Integer>> to_int_list_2d(String s) throws Exception {
        List<List<String>> stringList = to_string_list_2d(s);
        List<List<Integer>> res = new ArrayList<>();
        for (var lst : stringList) {
            List<Integer> cur = new ArrayList<>();
            for (var x : lst) {
                cur.add(Integer.parseInt(x));
            }
            res.add(cur);
        }
        return res;
    }
    private static List<List<String>> to_string_list_2d(String s) throws Exception {
        List<List<String>> res = new ArrayList<>();
        if (s == null || s.length() == 0 || s.equals("[]")) return res;
        // Expect format like [["a","b"],["c"]] possibly with spaces and single/double quotes
        s = s.trim();
        if (s.startsWith("[")) s = s.substring(1);
        if (s.endsWith("]")) s = s.substring(0, s.length()-1);
        int depth = 0; int start = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '[') depth++;
            if (c == ']') depth--;
            if (depth == 0 && c == ',') {
                String part = s.substring(start, i).trim();
                if (part.length() > 0) res.add(to_string_list(part));
                start = i + 1;
            }
        }
        String last = s.substring(start).trim();
        if (last.length() > 0) res.add(to_string_list(last));
        return res;
    }
    private static int[][] to_int_array_2d(String s) throws Exception {
        if (s == null || s.length() == 0 || s.equals("[]")) return new int[][] {};
        // Expect format like [[a,b,c],[d,e,f]] possibly with spaces
        s = s.trim();
        if (s.startsWith("[")) s = s.substring(1);
        if (s.endsWith("]")) s = s.substring(0, s.length()-1);
        List<int[]> rows = new ArrayList<>();
        int depth = 0; int start = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '[') depth++;
            if (c == ']') depth--;
            if (depth == 0 && c == ',') {
                String part = s.substring(start, i).trim();
                if (part.length() > 0) rows.add(to_int_array(part));
                start = i + 1;
            }
        }
        String last = s.substring(start).trim();
        if (last.length() > 0) rows.add(to_int_array(last));
        int[][] res = new int[rows.size()][];
        for (int i = 0; i < rows.size(); i++) res[i] = rows.get(i);
        return res;
    }

    private static char[] to_char_array(String s) throws Exception {
        List<String> tokens = to_string_list(s);
        char[] res = new char[tokens.size()];
        for (int i = 0; i < tokens.size(); i++) {
            String t = tokens.get(i);
            res[i] = t.length() > 0 ? t.charAt(0) : '\0';
        }
        return res;
    }

    private static char[][] to_char_array_2d(String s) throws Exception {
        if (s == null || s.length() == 0 || s.equals("[]")) return new char[][] {};
        s = s.trim();
        if (s.startsWith("[")) s = s.substring(1);
        if (s.endsWith("]")) s = s.substring(0, s.length()-1);
        List<char[]> rows = new ArrayList<>();
        int depth = 0; int start = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '[') depth++;
            if (c == ']') depth--;
            if (depth == 0 && c == ',') {
                String part = s.substring(start, i).trim();
                if (part.length() > 0) rows.add(to_char_array(part));
                start = i + 1;
            }
        }
        String last = s.substring(start).trim();
        if (last.length() > 0) rows.add(to_char_array(last));
        char[][] res = new char[rows.size()][];
        for (int i = 0; i < rows.size(); i++) res[i] = rows.get(i);
        return res;
    }
    private static TreeNode to_tree_node(String s) throws Exception {
        if (s == null) return null;
        String t = s.trim();
        if (t.length() == 0 || t.equals("[]")) return null;
        if (t.startsWith("[")) t = t.substring(1);
        if (t.endsWith("]")) t = t.substring(0, t.length()-1);
        // split by comma, trim, keep tokens like numbers or null
        List<String> tokens = new ArrayList<>();
        StringBuilder cur = new StringBuilder();
        for (int i = 0; i < t.length(); i++) {
            char c = t.charAt(i);
            if (c == ',') {
                String part = cur.toString().trim();
                if (part.length() > 0) tokens.add(part);
                cur.setLength(0);
            } else {
                cur.append(c);
            }
        }
        String last = cur.toString().trim();
        if (last.length() > 0) tokens.add(last);
        if (tokens.isEmpty()) return null;
        int idx = 0;
        String first = tokens.get(idx++);
        if (first.equals("null") || first.equals("None")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(first));
        Deque<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        while (!q.isEmpty() && idx < tokens.size()) {
            TreeNode node = q.poll();
            String lv = tokens.get(idx++);
            if (!lv.equals("null") && !lv.equals("None")) {
                node.left = new TreeNode(Integer.parseInt(lv));
                q.add(node.left);
            }
            if (idx >= tokens.size()) break;
            String rv = tokens.get(idx++);
            if (!rv.equals("null") && !rv.equals("None")) {
                node.right = new TreeNode(Integer.parseInt(rv));
                q.add(node.right);
            }
        }
        return root;
    }
`;

// Splits a long string into multiple, concatenated Java string literals
// to avoid the 65535-byte limit for a single literal.
export function formatAndSplitJavaString(str: string, chunkSize = 3000, funcName = 'joinString'): string {
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
    const res = chunks.join(' ,\n');
    if (!funcName || funcName.length === 0) return res;
    return `${funcName}(new String[]{${res}})`;
}

export function javaGetFullParam(params: Param[], tc: any): string {
    let fullParam = '';
    let index = 0;
    for (const param of params) {
        const val = tc[param.name];
        if (param.type === 'string') {
            fullParam += formatAndSplitJavaString(val);
        } else if ((param.type as any) === 'list_node') {
            // Parse string like "[1,2,3]" into a linked list using user's ListNode
            fullParam += `to_list_node(${formatAndSplitJavaString(val)})`;
        } else if ((param.type as any) === 'tree_node') {
            fullParam += `to_tree_node(${formatAndSplitJavaString(val)})`;
        } else if (param.type === 'string_array') {
            // Accept either a raw string like "[\"a\",\"b\"]" or an actual array ["a","b"]
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            fullParam += `to_string_array(${formatAndSplitJavaString(strVal)})`;
        } else if (param.type === 'int_array') {
            fullParam += `to_int_array(${formatAndSplitJavaString(val)})`;
        } else if (param.type === 'int') {
            fullParam += `${val}`;
        } else if (param.type === 'int_array_2d') {
            fullParam += `to_int_array_2d(${formatAndSplitJavaString(val)})`;
        } else if (param.type === 'char_array_2d') {
            fullParam += `to_char_array_2d(${formatAndSplitJavaString(val)})`;
        } else if (param.type === 'list_node_array') {
            fullParam += `to_list_node_array(${formatAndSplitJavaString(val)})`;
        } else if (param.type === 'string_list_2d') {
            fullParam += `to_string_list_2d(${formatAndSplitJavaString(val)})`;
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
    return outputType === 'string_list' ? 'displayOutputStringList' :
            outputType === 'string_list_2d' ? 'displayOutputStringList2d' :
            outputType === 'int_list' ? 'displayOutputIntList' : 
            outputType === 'int_list_2d' ? 'displayOutputIntList2d' : 
            'displayOutput';
}

export function generateJavaRunner(functionName: string, params: Param[], testCases: any[], outputType: string): string {
    const testCalls = testCases
        .map((tc, idx) => {
            let fullParam = javaGetFullParam(params, tc);
            // Store final result to avoid including user prints into the answer
            return `var __res${idx} = sol.${functionName}(${fullParam});\nSystem.out.println(":::RESULT:::" + ${getDisplayFuncName(outputType)}(__res${idx}));\nSystem.out.println("---");`;
        })
        .join('\n        ');

    return `
import java.util.*;
public class Main {
    ${javaHelperMethods}
    public static void main(String[] args) throws Exception {
        Solution sol = new Solution();
        ${testCalls}
    }
}`;
}