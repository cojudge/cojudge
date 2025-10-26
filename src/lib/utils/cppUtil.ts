import type { Param } from './util';

// Use official GCC image with g++ available
export const cppImage = 'gcc:13';

export const cppListNodeClass = `
struct ListNode {
    int val;
    ListNode *next;
    ListNode(): val(0), next(nullptr) {}
    ListNode(int x): val(x), next(nullptr) {}
    ListNode(int x, ListNode* next): val(x), next(next) {}
};
`;

export const cppTreeNodeClass = `
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(): val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x): val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right): val(x), left(left), right(right) {}
};
`;

// Helper methods in C++ to normalize IO and parsing
export const cppHelperMethods = `
#include <bits/stdc++.h>
#include "Solution.cpp"
using namespace std;

static string display_output(ListNode* head) {
    string s;
    ListNode* cur = head;
    s += "[";
    while (cur != nullptr) {
        s += to_string(cur->val);
        if (cur->next != nullptr) {
            s += ", ";
        }
        cur = cur->next;
    }
    s += "]";
    return s;
}
static string display_output(TreeNode* root) {
    if (!root) return "[]";
    vector<string> out;
    deque<TreeNode*> q;
    q.push_back(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop_front();
        if (!node) {
            out.push_back("null");
            continue;
        }
        out.push_back(to_string(node->val));
        q.push_back(node->left);
        q.push_back(node->right);
    }
    // trim trailing nulls
    int i = (int)out.size() - 1;
    while (i >= 0 && out[i] == "null") i--;
    string s = "[";
    for (int j = 0; j <= i; ++j) {
        if (j) s += ", ";
        s += out[j];
    }
    s += "]";
    return s;
}
static string display_output(const string &s) { return s; }
static string display_output(const char *s) { return string(s); }
static string display_output(int val) { return to_string(val); }
static string display_output(long long val) { return to_string(val); }
static string display_output(bool val) { return val ? "true" : "false"; }
static string display_output(const vector<int> &v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); ++i) {
        if (i) s += ", ";
        s += to_string(v[i]);
    }
    s += "]";
    return s;
}

static string display_output(const vector<vector<int>> &vv) {
    string s = "[";
    for (size_t i = 0; i < vv.size(); ++i) {
        if (i) s += ", ";
        s += display_output(vv[i]);
    }
    s += "]";
    return s;
}

static string display_output(const vector<char> &v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); ++i) {
        if (i) s += ", ";
        s += string(1, v[i]);
    }
    s += "]";
    return s;
}

static string display_output(const vector<vector<char>> &vv) {
    string s = "[";
    for (size_t i = 0; i < vv.size(); ++i) {
        if (i) s += ", ";
        s += display_output(vv[i]);
    }
    s += "]";
    return s;
}

static string display_output(const vector<string> &v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); ++i) {
        if (i) s += ", ";
        s += '"' + v[i] + '"';
    }
    s += "]";
    return s;
}

static string display_output(const vector<vector<string>> &vv) {
    string s = "[";
    for (size_t i = 0; i < vv.size(); ++i) {
        if (i) s += ", ";
        s += display_output(vv[i]);
    }
    s += "]";
    return s;
}

static vector<int> to_int_array(const string &s) {
    vector<int> res;
    if (s.empty() || s == "[]") return res;
    string inner = s;
    if (inner.front() == '[' && inner.back() == ']') {
        inner = inner.substr(1, inner.size() - 2);
    }
    string cur; 
    stringstream ss(inner);
    while (getline(ss, cur, ',')) {
        // trim spaces
        size_t b = cur.find_first_not_of(' ');
        size_t e = cur.find_last_not_of(' ');
        if (b == string::npos) continue;
        string t = cur.substr(b, e - b + 1);
        if (!t.empty()) res.push_back(stoi(t));
    }
    return res;
}

static vector<vector<int>> to_int_array_2d(const string &s) {
    vector<vector<int>> res;
    if (s.empty()) return res;
    string t = s;
    // Trim spaces
    auto trim = [](const string &str) {
        size_t b = str.find_first_not_of(" \\t\\n\\r");
        if (b == string::npos) return string();
        size_t e = str.find_last_not_of(" \\t\\n\\r");
        return str.substr(b, e - b + 1);
    };
    t = trim(t);
    if (t == "[]") return res;
    if (t.front() == '[') t = t.substr(1);
    if (!t.empty() && t.back() == ']') t = t.substr(0, t.size()-1);

    int depth = 0; size_t start = 0;
    for (size_t i = 0; i < t.size(); ++i) {
        char c = t[i];
        if (c == '[') depth++;
        else if (c == ']') depth--;
        else if (c == ',' && depth == 0) {
            string part = trim(t.substr(start, i - start));
            if (!part.empty()) res.push_back(to_int_array(part));
            start = i + 1;
        }
    }
    string last = trim(t.substr(start));
    if (!last.empty()) res.push_back(to_int_array(last));
    return res;
}

static string unquote(const string &x) {
    if (x.size() >= 2) {
        if ((x.front() == '"' && x.back() == '"') || (x.front() == '\\'' && x.back() == '\\'')) {
            return x.substr(1, x.size() - 2);
        }
    }
    return x;
}

static vector<string> to_string_array(const string &s) {
    vector<string> res;
    if (s.empty()) return res;
    string t = s;
    // Trim spaces
    auto trim = [](const string &str) {
        size_t b = str.find_first_not_of(" \\t\\n\\r");
        if (b == string::npos) return string();
        size_t e = str.find_last_not_of(" \\t\\n\\r");
        return str.substr(b, e - b + 1);
    };
    t = trim(t);
    if (t == "[]") return res;
    if (t.front() == '[' && t.back() == ']') {
        t = t.substr(1, t.size() - 2);
    }
    bool inDQ = false, inSQ = false;
    string cur;
    for (size_t i = 0; i < t.size(); ++i) {
        char c = t[i];
        if (c == '"' && !inSQ) { inDQ = !inDQ; continue; }
        if (c == '\\'' && !inDQ) { inSQ = !inSQ; continue; }
        if (c == ',' && !inDQ && !inSQ) {
            string token = trim(cur);
            if (!token.empty()) res.push_back(unquote(token));
            cur.clear();
        } else {
            cur.push_back(c);
        }
    }
    string last = trim(cur);
    if (!last.empty()) res.push_back(unquote(last));
    return res;
}

static vector<string> to_string_list(const string &s) {
    return to_string_array(s);
}

static vector<vector<string>> to_string_list_2d(const string &s) {
    vector<vector<string>> res;
    if (s.empty()) return res;
    string t = s;
    // Trim spaces
    auto trim = [](const string &str) {
        size_t b = str.find_first_not_of(" \\t\\n\\r");
        if (b == string::npos) return string();
        size_t e = str.find_last_not_of(" \\t\\n\\r");
        return str.substr(b, e - b + 1);
    };
    t = trim(t);
    if (t == "[]") return res;
    if (t.front() == '[') t = t.substr(1);
    if (!t.empty() && t.back() == ']') t = t.substr(0, t.size()-1);

    int depth = 0; size_t start = 0;
    for (size_t i = 0; i < t.size(); ++i) {
        char c = t[i];
        if (c == '[') depth++;
        else if (c == ']') depth--;
        else if (c == ',' && depth == 0) {
            string part = trim(t.substr(start, i - start));
            if (!part.empty()) res.push_back(to_string_array(part));
            start = i + 1;
        }
    }
    string last = trim(t.substr(start));
    if (!last.empty()) res.push_back(to_string_array(last));
    return res;
}

static vector<char> to_char_array(const string &s) {
    vector<char> res;
    vector<string> tokens = to_string_array(s);
    for (const auto &tok : tokens) {
        if (!tok.empty()) res.push_back(tok[0]);
    }
    return res;
}

static vector<vector<char>> to_char_array_2d(const string &s) {
    vector<vector<char>> res;
    if (s.empty()) return res;
    string t = s;
    // Trim spaces
    auto trim = [](const string &str) {
        size_t b = str.find_first_not_of(" \\t\\n\\r");
        if (b == string::npos) return string();
        size_t e = str.find_last_not_of(" \\t\\n\\r");
        return str.substr(b, e - b + 1);
    };
    t = trim(t);
    if (t == "[]") return res;
    if (t.front() == '[') t = t.substr(1);
    if (!t.empty() && t.back() == ']') t = t.substr(0, t.size()-1);

    int depth = 0; size_t start = 0;
    for (size_t i = 0; i < t.size(); ++i) {
        char c = t[i];
        if (c == '[') depth++;
        else if (c == ']') depth--;
        else if (c == ',' && depth == 0) {
            string part = trim(t.substr(start, i - start));
            if (!part.empty()) res.push_back(to_char_array(part));
            start = i + 1;
        }
    }
    string last = trim(t.substr(start));
    if (!last.empty()) res.push_back(to_char_array(last));
    return res;
}

static ListNode* to_list_node(const string &s) {
    vector<int> nums = to_int_array(s);
    int n = nums.size();
    if (n == 0) return nullptr;
    ListNode* head = new ListNode(nums[0]);
    ListNode* cur = head;
    for (int i = 1; i < n; i++) {
        cur->next = new ListNode(nums[i]);
        cur = cur->next;
    }
    return head;
}

static vector<ListNode*> to_list_node_array(const string &s) {
    vector<string> sarr = to_string_array(s);
    vector<ListNode*> ans(sarr.size());
    for (int i = 0; i < sarr.size(); i++) {
        ans[i] = to_list_node(sarr[i]);
    }
    return ans;
}

static vector<string> split_tree_tokens(const string &s) {
    vector<string> res;
    if (s.empty()) return res;
    string t = s;
    // trim
    auto trim = [](const string &str) {
        size_t b = str.find_first_not_of(" \\t\\n\\r");
        if (b == string::npos) return string();
        size_t e = str.find_last_not_of(" \\t\\n\\r");
        return str.substr(b, e - b + 1);
    };
    t = trim(t);
    if (t.size() >= 2 && t.front() == '[' && t.back() == ']') {
        t = t.substr(1, t.size() - 2);
    }
    string cur;
    int depth = 0;
    for (size_t i = 0; i < t.size(); ++i) {
        char c = t[i];
        if (c == ',' && depth == 0) {
            string token = trim(cur);
            if (!token.empty()) res.push_back(token);
            cur.clear();
        } else {
            if (c == '[') depth++;
            if (c == ']') depth--;
            cur.push_back(c);
        }
    }
    string last = trim(cur);
    if (!last.empty()) res.push_back(last);
    return res;
}

static TreeNode* to_tree_node(const string &s) {
    vector<string> tok = split_tree_tokens(s);
    if (tok.empty()) return nullptr;
    auto parseVal = [](const string &x, bool &ok) -> int {
        string t = x;
        // remove quotes if any
        if ((t.size() >= 2 && ((t.front() == '"' && t.back() == '"') || (t.front() == '\\'' && t.back() == '\\'')))) {
            t = t.substr(1, t.size() - 2);
        }
        if (t == "null" || t == "None" || t == "NULL") { ok = false; return 0; }
        ok = true; return stoi(t);
    };
    bool ok = false;
    int v0 = 0;
    v0 = parseVal(tok[0], ok);
    if (!ok) return nullptr;
    TreeNode* root = new TreeNode(v0);
    deque<TreeNode*> q; q.push_back(root);
    size_t i = 1;
    while (!q.empty() && i < tok.size()) {
        TreeNode* node = q.front(); q.pop_front();
        // left
        bool okL = false; int lv = 0;
        lv = parseVal(tok[i++], okL);
        if (okL) { node->left = new TreeNode(lv); q.push_back(node->left); }
        if (i >= tok.size()) break;
        // right
        bool okR = false; int rv = 0;
        rv = parseVal(tok[i++], okR);
        if (okR) { node->right = new TreeNode(rv); q.push_back(node->right); }
    }
    return root;
}

// escape helper for static usage if needed
`;

function cppEscapeStringLiteral(str: string): string {
    if (str === null || str === undefined) return '""';
    const escaped = String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `"${escaped}"`;
}

export function cppGetFullParam(params: Param[], tc: any): string {
    const parts: string[] = [];
    for (const p of params) {
        const val = tc[p.name];
        if (p.type === 'string') {
            parts.push(cppEscapeStringLiteral(val ?? ''));
        } else if (p.type === 'string_list_2d') {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(`to_string_list_2d(${cppEscapeStringLiteral(strVal)})`);
        } else if (p.type === 'string_list') {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(`to_string_list(${cppEscapeStringLiteral(strVal)})`);
        } else if (p.type === 'string_array') {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(`to_string_array(${cppEscapeStringLiteral(strVal)})`);
        } else if (p.type === 'int_array') {
            parts.push(`to_int_array(${cppEscapeStringLiteral(val ?? '[]')})`);
        } else if (p.type === 'int_array_2d' || p.type === 'int_matrix') {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(`to_int_array_2d(${cppEscapeStringLiteral(strVal)})`);
        } else if (p.type === 'char_array_2d') {
            let strVal: string;
            if (Array.isArray(val)) {
                try { strVal = JSON.stringify(val); } catch { strVal = '[]'; }
            } else {
                strVal = String(val ?? '[]');
            }
            parts.push(`to_char_array_2d(${cppEscapeStringLiteral(strVal)})`);
        } else if (p.type === 'int') {
            parts.push(`${val}`);
        } else if (p.type === 'boolean') {
            parts.push(String(val) === 'true' ? 'true' : 'false');
        } else if (p.type === 'list_node') {
            parts.push(`to_list_node(${cppEscapeStringLiteral(val ?? '[]')})`);
        } else if (p.type === 'list_node_array') {
            parts.push(`to_list_node_array(${cppEscapeStringLiteral(val ?? '[]')})`);
        } else if (p.type === 'tree_node') {
            parts.push(`to_tree_node(${cppEscapeStringLiteral(val ?? '[]')})`);
        } else {
            // default pass as string
            parts.push(cppEscapeStringLiteral(String(val ?? '')));
        }
    }
    return parts.join(', ');
}

export function generateCppRunner(functionName: string, params: Param[], testCases: any[]): string {
    const calls = testCases
        .map((tc, caseIndex) => {
            const decls: string[] = [];
            const args: string[] = [];
            params.forEach((p, i) => {
                const vname = `p${i}`;
                const raw = tc[p.name];
                if (p.type === 'int_array') {
                    decls.push(`vector<int> ${vname} = to_int_array(${cppEscapeStringLiteral(raw ?? '[]')});`);
                    args.push(vname);
                } else if (p.type === 'int_array_2d' || p.type === 'int_matrix') {
                    let strVal: string;
                    if (Array.isArray(raw)) {
                        try { strVal = JSON.stringify(raw); } catch { strVal = '[]'; }
                    } else {
                        strVal = String(raw ?? '[]');
                    }
                    decls.push(`vector<vector<int>> ${vname} = to_int_array_2d(${cppEscapeStringLiteral(strVal)});`);
                    args.push(vname);
                } else if (p.type === 'char_array_2d') {
                    let strVal: string;
                    if (Array.isArray(raw)) {
                        try { strVal = JSON.stringify(raw); } catch { strVal = '[]'; }
                    } else {
                        strVal = String(raw ?? '[]');
                    }
                    decls.push(`vector<vector<char>> ${vname} = to_char_array_2d(${cppEscapeStringLiteral(strVal)});`);
                    args.push(vname);
                } else if (p.type === 'string_array') {
                    let strVal: string;
                    if (Array.isArray(raw)) {
                        try { strVal = JSON.stringify(raw); } catch { strVal = '[]'; }
                    } else {
                        strVal = String(raw ?? '[]');
                    }
                    decls.push(`vector<string> ${vname} = to_string_array(${cppEscapeStringLiteral(strVal)});`);
                    args.push(vname);
                } else if (p.type === 'string_list') {
                    let strVal: string;
                    if (Array.isArray(raw)) {
                        try { strVal = JSON.stringify(raw); } catch { strVal = '[]'; }
                    } else {
                        strVal = String(raw ?? '[]');
                    }
                    decls.push(`vector<string> ${vname} = to_string_list(${cppEscapeStringLiteral(strVal)});`);
                    args.push(vname);
                } else if (p.type === 'string_list_2d') {
                    let strVal: string;
                    if (Array.isArray(raw)) {
                        try { strVal = JSON.stringify(raw); } catch { strVal = '[]'; }
                    } else {
                        strVal = String(raw ?? '[]');
                    }
                    decls.push(`vector<vector<string>> ${vname} = to_string_list_2d(${cppEscapeStringLiteral(strVal)});`);
                    args.push(vname);
                } else if (p.type === 'string') {
                    decls.push(`string ${vname} = ${cppEscapeStringLiteral(raw ?? '')};`);
                    args.push(vname);
                } else if (p.type === 'int') {
                    decls.push(`int ${vname} = ${raw};`);
                    args.push(vname);
                } else if (p.type === 'boolean') {
                    decls.push(`bool ${vname} = ${String(raw) === 'true' ? 'true' : 'false'};`);
                    args.push(vname);
                } else if (p.type === 'list_node') {
                    let strVal: string;
                    if (Array.isArray(raw)) {
                        try { strVal = JSON.stringify(raw); } catch { strVal = '[]'; }
                    } else {
                        strVal = String(raw ?? '[]');
                    }
                    decls.push(`ListNode* ${vname} = to_list_node(${cppEscapeStringLiteral(strVal)});`);
                    args.push(vname);
                } else if (p.type === 'list_node_array') {
                    let strVal: string;
                    if (Array.isArray(raw)) {
                        try { strVal = JSON.stringify(raw); } catch { strVal = '[]'; }
                    } else {
                        strVal = String(raw ?? '[]');
                    }
                    decls.push(`vector<ListNode*> ${vname} = to_list_node_array(${cppEscapeStringLiteral(strVal)});`);
                    args.push(vname);
                } else if (p.type === 'tree_node') {
                    let strVal: string;
                    if (Array.isArray(raw)) {
                        try { strVal = JSON.stringify(raw); } catch { strVal = '[]'; }
                    } else {
                        strVal = String(raw ?? '[]');
                    }
                    decls.push(`TreeNode* ${vname} = to_tree_node(${cppEscapeStringLiteral(strVal)});`);
                    args.push(vname);
                } else {
                    // Default to string
                    decls.push(`string ${vname} = ${cppEscapeStringLiteral(String(raw ?? ''))};`);
                    args.push(vname);
                }
            });
            return `{
        ${decls.join('\n        ')}
        // Capture final result in a variable to avoid mixing with user prints
        auto __res = sol.${functionName}(${args.join(', ')});
        cout << ":::RESULT:::" << display_output(__res) << "\\n";
        cout << "---\\n";
    }`;
        })
        .join('\n    ');

    return `${cppHelperMethods}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    Solution sol;
    ${calls}
    return 0;
}
`;
}
