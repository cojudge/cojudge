// PHP debug driver: source-instrumentation approach (mirrors CsharpDebugDriver).
//
// The php:8.3-cli image has no Xdebug, so breakpoints are implemented by
// rewriting the user's source: a `\__cjd_check(<original-line>, $vars)`
// call is inserted before each executable line, plus `$__cjd_v[...]` capture
// assignments after it. Breakpoints therefore always refer to the user's
// original 1-based line numbers, regardless of inserted lines.
//
// Protocol (same files as the other drivers):
//   /tmp/cojudge_debug_state.json  driver -> server (running/paused/completed/error/stopped)
//   /tmp/cojudge_debug_cmd.json    server -> driver (continue/step/stop/set_breakpoints/eval)
//   /tmp/cojudge_eval_result.json  driver -> server (eval result)

export const PHP_DEBUG_SUPPORT: string = String.raw`<?php
// CoJudge PHP debug runtime. Loaded via require_once from instrumented files.
if (!function_exists('__cjd_init')) {
$GLOBALS['__cjd_state_file'] = '/tmp/cojudge_debug_state.json';
$GLOBALS['__cjd_cmd_file'] = '/tmp/cojudge_debug_cmd.json';
$GLOBALS['__cjd_eval_file'] = '/tmp/cojudge_eval_result.json';
$GLOBALS['__cjd_breaks'] = array();
$GLOBALS['__cjd_step'] = false;
$GLOBALS['__cjd_out'] = '';
$GLOBALS['__cjd_poll'] = 0;
$GLOBALS['__cjd_bps_changed'] = false;

function __cjd_init($bpStr) {
    $bps = array();
    foreach (explode(',', (string)$bpStr) as $p) {
        $p = trim($p);
        if ($p !== '' && is_numeric($p)) { $bps[(int)$p] = true; }
    }
    $GLOBALS['__cjd_breaks'] = $bps;
    $GLOBALS['__cjd_out'] = '';
    set_exception_handler(function($e) {
        $msg = ($e instanceof Throwable) ? $e->getMessage() : (string)$e;
        __cjd_write_state('error', -1, null, $msg);
        exit(1);
    });
    register_shutdown_function(function() {
        $err = error_get_last();
        if ($err !== null && in_array($err['type'], array(E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR), true)) {
            __cjd_write_state('error', -1, null, isset($err['message']) ? $err['message'] : 'fatal error');
            return;
        }
        $cur = __cjd_read_state_status();
        if ($cur === null || ($cur !== 'completed' && $cur !== 'error' && $cur !== 'stopped')) {
            __cjd_write_state('completed', -1, null, null);
        }
    });
    // Chunk size 1: the callback runs on every write, so __cjd_out is
    // always current (default chunk size would only flush at shutdown,
    // after the final state is already written).
    ob_start(function($buf) { $GLOBALS['__cjd_out'] .= $buf; return ''; }, 1);
    __cjd_write_state('running', -1, null, null);
}

function __cjd_render($v, $depth = 0) {
    if ($v === null) { return 'null'; }
    if (is_bool($v)) { return $v ? 'true' : 'false'; }
    if (is_int($v)) { return (string)$v; }
    if (is_float($v)) {
        if (is_nan($v)) { return 'NAN'; }
        if (is_infinite($v)) { return $v > 0 ? 'INF' : '-INF'; }
        return (string)$v;
    }
    if (is_string($v)) {
        $s = $v;
        if (strlen($s) > 500) { $s = substr($s, 0, 500) . '...'; }
        return '"' . addcslashes($s, '\0..\37"\\') . '"';
    }
    if ($depth >= 3) { return '[...]'; }
    if (is_array($v)) {
        if (count($v) === 0) { return '[]'; }
        $isList = array_is_list($v);
        $parts = array();
        $i = 0;
        foreach ($v as $k => $item) {
            if ($i >= 100) { $parts[] = '...'; break; }
            $r = __cjd_render($item, $depth + 1);
            $parts[] = $isList ? $r : (__cjd_render_key($k) . ': ' . $r);
            $i++;
        }
        return ($isList ? '[' : '{') . implode(', ', $parts) . ($isList ? ']' : '}');
    }
    if (is_object($v)) {
        $cls = get_class($v);
        $props = get_object_vars($v);
        if (empty($props)) { return '<' . $cls . '>'; }
        $parts = array();
        $i = 0;
        foreach ($props as $k => $item) {
            if ($i >= 20) { $parts[] = '...'; break; }
            $parts[] = $k . ': ' . __cjd_render($item, $depth + 1);
            $i++;
        }
        return $cls . '{' . implode(', ', $parts) . '}';
    }
    if (is_resource($v)) { return '<resource>'; }
    return '<' . gettype($v) . '>';
}

function __cjd_render_key($k) {
    if (is_int($k)) { return (string)$k; }
    return '"' . addcslashes((string)$k, '\0..\37"\\') . '"';
}

function __cjd_write_state($status, $line, $vars, $error) {
    $st = array('status' => $status, 'output' => $GLOBALS['__cjd_out']);
    if ($line >= 0) { $st['line'] = $line; }
    if (is_array($vars) && count($vars) > 0) { $st['vars'] = $vars; }
    if ($error !== null) { $st['error'] = $error; }
    $data = json_encode($st);
    if ($data === false) { $data = '{"status":"error","error":"state encode failed"}'; }
    $tmp = $GLOBALS['__cjd_state_file'] . '.tmp';
    @file_put_contents($tmp, $data);
    @rename($tmp, $GLOBALS['__cjd_state_file']);
}

function __cjd_read_state_status() {
    $raw = @file_get_contents($GLOBALS['__cjd_state_file']);
    if ($raw === false) { return null; }
    $d = json_decode(trim($raw), true);
    if (!is_array($d) || !isset($d['status'])) { return null; }
    return $d['status'];
}

function __cjd_poll_cmd() {
    $f = $GLOBALS['__cjd_cmd_file'];
    clearstatcache(true, $f);
    if (!file_exists($f)) { return null; }
    $raw = @file_get_contents($f);
    if ($raw === false || trim($raw) === '') { return null; }
    $cmd = json_decode(trim($raw), true);
    @unlink($f);
    if (!is_array($cmd)) { return null; }
    if ((isset($cmd['action']) ? $cmd['action'] : '') === 'set_breakpoints') {
        $bps = array();
        foreach ((array)(isset($cmd['breakpoints']) ? $cmd['breakpoints'] : array()) as $b) { $bps[(int)$b] = true; }
        $GLOBALS['__cjd_breaks'] = $bps;
        $GLOBALS['__cjd_bps_changed'] = true;
        return null;
    }
    return $cmd;
}

function __cjd_check($line, $vars) {
    $c = $GLOBALS['__cjd_poll'] + 1;
    $GLOBALS['__cjd_poll'] = $c;
    if ($c % 50 === 0) {
        $cmd = __cjd_poll_cmd();
        if (is_array($cmd) && (isset($cmd['action']) ? $cmd['action'] : '') === 'stop') {
            __cjd_write_state('stopped', -1, null, null);
            exit(0);
        }
    }
    if ($GLOBALS['__cjd_step'] || isset($GLOBALS['__cjd_breaks'][$line])) {
        $GLOBALS['__cjd_step'] = false;
        __cjd_pause($line, $vars);
    }
}

function __cjd_pause($line, $vars) {
    $rendered = array();
    foreach ((array)$vars as $k => $v) { $rendered[$k] = __cjd_render($v); }
    __cjd_write_state('paused', $line, $rendered, null);
    while (true) {
        usleep(100000);
        $cmd = __cjd_poll_cmd();
        if ($cmd === null) {
            if ($GLOBALS['__cjd_bps_changed']) {
                $GLOBALS['__cjd_bps_changed'] = false;
                __cjd_write_state('paused', $line, $rendered, null);
            }
            continue;
        }
        $a = isset($cmd['action']) ? $cmd['action'] : '';
        if ($a === 'eval') {
            $expr = isset($cmd['expression']) ? (string)$cmd['expression'] : '';
            try {
                $val = __cjd_eval($expr, (array)$vars);
                @file_put_contents($GLOBALS['__cjd_eval_file'], json_encode(array('value' => $val)));
            } catch (Throwable $e) {
                @file_put_contents($GLOBALS['__cjd_eval_file'], json_encode(array('error' => $e->getMessage())));
            }
            continue;
        }
        if ($a === 'step') { $GLOBALS['__cjd_step'] = true; return; }
        if ($a === 'continue') { return; }
        if ($a === 'stop') {
            __cjd_write_state('stopped', -1, null, null);
            exit(0);
        }
    }
}

function __cjd_eval($expr, $vars) {
    if (trim($expr) === '') { throw new Exception('Empty expression'); }
    unset($vars['this']);
    $fn = function() use ($expr, $vars) {
        extract($vars, EXTR_SKIP);
        return eval('return (' . $expr . ');');
    };
    return __cjd_render($fn());
}
}
`;

const CJD_V = '$__cjd_v';

// Strip '...' "..." literals and // # comments so brace counting for
// depth tracking isn't confused by braces inside strings.
function phpStripForDepth(s: string): string {
    return s
        .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
        .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
        .replace(/\/\/.*$/, '')
        .replace(/#.*$/, '');
}

function phpShouldInstrument(trimmed: string): boolean {
    if (!trimmed) return false;
    if (
        trimmed === '{' || trimmed === '}' || trimmed === '};' ||
        trimmed === '});' || trimmed === '})' || trimmed === ');' ||
        trimmed === ']' || trimmed === '];'
    ) return false;
    if (trimmed.startsWith('<?') || trimmed === '?>') return false;
    if (
        trimmed.startsWith('//') || trimmed.startsWith('#') ||
        trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('*/')
    ) return false;
    if (/^(require|require_once|include|include_once)\b/.test(trimmed)) return false;
    if (/^declare\s*\(/.test(trimmed)) return false;
    // use/import lines must stay pristine at top level
    if (/^(namespace|use)\b/.test(trimmed) && trimmed.endsWith(';')) return false;
    if (/^(abstract\s+|final\s+)?(class|interface|trait|enum)\b/.test(trimmed)) return false;
    // Declarations themselves are never executable; their bodies still are.
    // NOTE: single-line `function f() { ... }` bodies are therefore not debuggable.
    if (/\bfunction\b/.test(trimmed)) return false;
    if (/^(case|default)\b/.test(trimmed)) return false;
    // `else`/`elseif`/`catch`/`finally` must directly follow `}` with no
    // statement in between, so a Check call must never precede them.
    if (/^(else|elseif|catch|finally)\b/.test(trimmed)) return false;
    if (/^(endif|endfor|endforeach|endwhile|endswitch)\b/.test(trimmed)) return false;
    return true;
}

function phpIsCatchForHeader(trimmed: string): boolean {
    return /^}?\s*(catch|for|foreach|while)\b/.test(trimmed);
}

function extractPhpIdents(line: string): string[] {
    const clean = phpStripForDepth(line);
    const out: string[] = [];
    const re = /\$([A-Za-z_][A-Za-z0-9_]*)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(clean)) !== null) {
        const n = m[1];
        if (n === 'this' || n.startsWith('__cjd')) continue;
        if (!out.includes(n)) out.push(n);
    }
    return out;
}

// Params from a (possibly multiline) function signature: text between the
// first '(' and its match, plus closure `use (...)` idents.
function extractPhpParams(sig: string): string[] {
    const names: string[] = [];
    const start = sig.indexOf('(');
    if (start >= 0) {
        let depth = 0;
        let end = -1;
        for (let i = start; i < sig.length; i++) {
            if (sig[i] === '(') depth++;
            else if (sig[i] === ')') {
                depth--;
                if (depth === 0) { end = i; break; }
            }
        }
        const inside = end > start ? sig.slice(start + 1, end) : sig.slice(start + 1);
        // Split top-level commas only (defaults may contain []/array()).
        let cur = '';
        let d = 0;
        const parts: string[] = [];
        for (const ch of inside) {
            if (ch === '(' || ch === '[') d++;
            else if (ch === ')' || ch === ']') d--;
            if (ch === ',' && d === 0) { parts.push(cur); cur = ''; }
            else cur += ch;
        }
        parts.push(cur);
        for (const part of parts) {
            const mm = part.match(/(\.\.\.)?\s*\$([A-Za-z_][A-Za-z0-9_]*)/);
            if (mm && !names.includes(mm[2])) names.push(mm[2]);
        }
    }
    const um = sig.match(/\buse\s*\(([^)]*)\)/);
    if (um) {
        for (const p of um[1].split(',')) {
            const mm = p.match(/\$([A-Za-z_][A-Za-z0-9_]*)/);
            if (mm && !names.includes(mm[1])) names.push(mm[1]);
        }
    }
    return names.filter((n) => n !== 'this' && !n.startsWith('__cjd'));
}

// The original user code, normalized so `php -l` parses it as PHP and
// reports the user's own line numbers (no lines added or removed: the tag
// is prepended on the same first line).
export function phpOriginalForLint(code: string): string {
    const src = String(code ?? '');
    if (/^\s*<\?php/.test(src)) return src;
    return '<?php ' + src;
}

// Instruments user code. Returned file keeps the user's original 1-based
// line numbers in every `\__cjd_check(N, ...)` call, so breakpoints bind to
// the lines the user sees. The debug runtime require + init are emitted as
// unnumbered header lines.
export function generatePhpDebugWrapper(code: string, breakpoints: number[]): string {
    const bpStr = [...new Set(breakpoints.map(Number).filter((n) => n > 0))].join(',');

    // Split off a leading <?php tag (mirrors PhpRunner.stripPhpTag).
    let rest = String(code ?? '');
    let offset = 0;
    const tagOnOwnLine = /^\s*<\?php[ \t]*\r?\n/.test(rest);
    if (/^\s*<\?php/.test(rest)) {
        if (tagOnOwnLine) offset = 1;
        rest = rest.replace(/^\s*<\?php\s?/, '');
    }
    const body = rest.split('\n');

    // Preserve leading declare()/namespace lines ahead of the debug header
    // (declare must be the first statement; namespace must precede code).
    const pre: string[] = [];
    let bi = 0;
    while (bi < body.length) {
        const t = body[bi].trim();
        if (t === '' || /^declare\s*\(/.test(t) || /^(namespace\s|namespace;)/.test(t)) {
            pre.push(body[bi]);
            bi++;
        } else break;
    }
    const main = body.slice(bi);
    const baseNum = offset + bi; // main[i] is original line baseNum + i + 1

    const out: string[] = [];
    out.push('<?php');
    for (const p of pre) out.push(p);
    out.push(`require_once __DIR__ . '/PhpDebugSupport.php';`);
    out.push(`\\__cjd_init('${bpStr}');`);
    out.push(`${CJD_V} = array();`);

    let depth = 0;
    let inFunc = false;
    let funcEntryDepth = 0;
    let funcVars: string[] = [];
    let pendingSig = '';
    let inClass = false;
    let classEntryDepth = 0;
    let pendingClass = false;
    let inPhp = true;
    let topVars: string[] = [];
    // Unclosed (/[ at line start means this line continues the previous
    // statement: never split it with a Check() call (would be a parse error).
    let parenDepth = 0;

    for (let i = 0; i < main.length; i++) {
        const num = baseNum + i + 1;
        const raw = main[i];
        const trimmed = raw.trim();
        const indent = raw.slice(0, raw.length - trimmed.length);

        if (!inPhp) {
            out.push(raw);
            if (/<\?php/i.test(raw)) inPhp = true;
            continue;
        }
        const codePart = phpStripForDepth(raw);
        if (/\?>/.test(codePart)) {
            // Mixed code/HTML line: leave pristine, drop to HTML mode.
            out.push(raw);
            inPhp = false;
            continue;
        }

        let opens = 0;
        let closes = 0;
        let pOpens = 0;
        let pCloses = 0;
        for (const ch of codePart) {
            if (ch === '{') opens++;
            else if (ch === '}') closes++;
            else if (ch === '(' || ch === '[') pOpens++;
            else if (ch === ')' || ch === ']') pCloses++;
        }
        const continued = parenDepth > 0;
        parenDepth += pOpens - pCloses;
        const dBefore = depth;
        depth += opens - closes;
        const dAfter = depth;

        const hasFunc = /\bfunction\b/.test(codePart) && !/^\s*(\/\/|#|\*)/.test(trimmed);
        const hasClassWord = /\bclass\b/.test(codePart) && !/::class\b/.test(codePart);
        // A multiline signature's continuation lines carry no `function`
        // keyword but still belong to the pending signature.
        if (!inFunc && (hasFunc || pendingSig)) pendingSig += (pendingSig ? '\n' : '') + trimmed;

        let entered = false;
        if (!inFunc && pendingSig && dAfter > dBefore) {
            inFunc = true;
            funcEntryDepth = dAfter;
            funcVars = extractPhpParams(pendingSig);
            pendingSig = '';
            entered = true;
        } else if (pendingSig && /;\s*$/.test(trimmed) && dAfter <= dBefore) {
            pendingSig = ''; // prototype/abstract/interface signature: no body follows
        }

        if (!inClass && !inFunc && hasClassWord) {
            if (dAfter > dBefore) {
                inClass = true;
                classEntryDepth = dAfter;
                pendingClass = false;
            } else {
                pendingClass = true;
            }
        } else if (pendingClass) {
            if (dAfter > dBefore) {
                inClass = true;
                classEntryDepth = dAfter;
                pendingClass = false;
            } else if (
                trimmed !== '' &&
                !/^(extends|implements)\b/.test(trimmed) &&
                !trimmed.startsWith('//') && !trimmed.startsWith('#') &&
                !trimmed.startsWith('/*') && !trimmed.startsWith('*')
            ) {
                pendingClass = false;
            }
        }
        if (inClass && dAfter < classEntryDepth) inClass = false;

        const known = inFunc ? funcVars : topVars;
        // A line that leaves (/[ unclosed continues on the next line: its
        // captures must wait (emitting them here would split the statement).
        const leavesOpen = parenDepth > 0;
        if (!continued && (inFunc || !inClass) && phpShouldInstrument(trimmed)) {
            out.push(`${indent}\\__cjd_check(${num}, ${CJD_V});`);
            out.push(raw);
            for (const v of extractPhpIdents(raw)) {
                if (!known.includes(v)) known.push(v);
            }
            if (!leavesOpen) {
                for (const v of known) {
                    out.push(`${indent}${CJD_V}["${v}"] = $${v} ?? null;`);
                }
            }
        } else {
            out.push(raw);
            if ((!inFunc && !inClass && phpIsCatchForHeader(trimmed)) || (continued && (inFunc || !inClass))) {
                for (const v of extractPhpIdents(raw)) {
                    if (!known.includes(v)) known.push(v);
                }
            }
        }

        if (entered) {
            const bInd = indent + '    ';
            out.push(`${bInd}${CJD_V} = array();`);
            for (const p of funcVars) {
                out.push(`${bInd}${CJD_V}["${p}"] = $${p} ?? null;`);
            }
        }
        if (inFunc && dAfter < funcEntryDepth) {
            inFunc = false;
            funcVars = [];
        }
    }

    return out.join('\n') + '\n';
}
