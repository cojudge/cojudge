export const RUST_DEBUG_DRIVER: string = String.raw`#!/usr/bin/env python3
import subprocess
import json
import os
import sys
import re
import time

STATE_FILE = '/tmp/cojudge_debug_state.json'
CMD_FILE = '/tmp/cojudge_debug_cmd.json'
STDOUT_FILE = '/tmp/cojudge_stdout.txt'

def send_mi(gdb_proc, cmd):
    gdb_proc.stdin.write(cmd + '\n')
    gdb_proc.stdin.flush()

def read_mi_until(gdb_proc, sentinel='(gdb)'):
    lines = []
    while True:
        line = gdb_proc.stdout.readline()
        if line == '':
            break
        line = line.strip()
        if line == sentinel:
            break
        lines.append(line)
    return lines

def read_output():
    try:
        with open(STDOUT_FILE, 'r') as f:
            content = f.read()
        lines = content.split('\n')
        filtered = [l for l in lines if not l.startswith('&"')]
        return '\n'.join(filtered)
    except:
        return ''

def handle_exit_reason(data, gdb_proc):
    reason_match = re.search(r'reason="([^"]*)"', data)
    reason = reason_match.group(1) if reason_match else 'exited'

    output = read_output()
    if reason in ('exited-normally', 'exited'):
        exit_code_match = re.search(r'exit-code="(\d+)"', data)
        exit_code = exit_code_match.group(1) if exit_code_match else '0'
        state = {'status': 'completed', 'output': output}
        if exit_code != '0':
            state['status'] = 'error'
            state['error'] = 'Process exited with code ' + exit_code
        with open(STATE_FILE, 'w') as f:
            json.dump(state, f)
        send_mi(gdb_proc, '-gdb-exit')
        return True
    elif reason == 'signal-received':
        sig_match = re.search(r'signal-name="([^"]*)"', data)
        sig_name = sig_match.group(1) if sig_match else 'unknown'
        sig_meaning_match = re.search(r'signal-meaning="([^"]*)"', data)
        sig_meaning = sig_meaning_match.group(1) if sig_meaning_match else sig_name
        state = {'status': 'error', 'error': sig_meaning, 'output': output}
        with open(STATE_FILE, 'w') as f:
            json.dump(state, f)
        send_mi(gdb_proc, '-gdb-exit')
        return True
    return False

def _mi_eval(gdb_proc, expr):
    send_mi(gdb_proc, '-data-evaluate-expression ' + expr)
    resp = read_mi_until(gdb_proc)
    for record in resp:
        if record.startswith('^error'):
            return None
        m = re.match(r'\^done,value="((?:[^"\\]|\\.)*)"', record)
        if m:
            raw = m.group(1)
            return raw.replace('\\"', '"').replace('\\\\', '\\')
    return None

def _format_scalar(raw):
    if raw is None:
        return '<unavailable>'
    if '{' not in raw:
        return raw
    if 'string::String' in raw or 'str>' in raw:
        return '<String>'
    type_name = re.match(r'([^{\s<]+)', raw)
    if type_name:
        short = type_name.group(1).rsplit('::', 1)[-1]
        return '<' + short + '>'
    return raw[:60]

def collect_variables(gdb_proc):
    send_mi(gdb_proc, '-stack-list-variables --no-values')
    resp = read_mi_until(gdb_proc)

    names = []
    for record in resp:
        if record.startswith('^done,variables='):
            for m in re.finditer(r'name="([^"]*)"', record):
                name = m.group(1)
                if name and not name.startswith('_') and name != 'this':
                    names.append(name)

    vars_dict = {}
    for name in names:
        raw = _mi_eval(gdb_proc, name)
        if raw and '{' not in raw:
            vars_dict[name] = raw
        elif raw and re.match(r'^(alloc::)?vec::Vec<', raw):
            len_m = re.search(r'\blen:\s*(\d+)', raw)
            length = int(len_m.group(1)) if len_m else 0
            displayed = False
            if length > 0:
                send_mi(gdb_proc, '-interpreter-exec console "print *' + name + '.buf.ptr.pointer.pointer@' + str(length) + '"')
                resp = read_mi_until(gdb_proc)
                for record in resp:
                    if record.startswith('~"') and '= ' in record:
                        eq = record.index('= ')
                        end = record.rfind('\\n"')
                        if end > eq:
                            vars_dict[name] = record[eq + 2:end].strip()
                            displayed = True
                            break
            if not displayed:
                vars_dict[name] = '<Vec len=' + str(length) + '>'
        elif raw and re.search(r'HashMap<', raw):
            items_m = re.search(r'\bitems:\s*(\d+)', raw)
            count = items_m.group(1) if items_m else '?'
            vars_dict[name] = '<HashMap(' + str(count) + ')>'
        elif raw and ('string::String' in raw or 'str>' in raw):
            len_m = re.search(r'\blen:\s*(\d+)', raw)
            slen = int(len_m.group(1)) if len_m else 0
            if slen > 0:
                send_mi(gdb_proc, '-interpreter-exec console "print *' + name + '.vec.buf.ptr.pointer.pointer@' + str(slen) + '"')
                resp = read_mi_until(gdb_proc)
                for record in resp:
                    if record.startswith('~"') and '= ' in record:
                        eq = record.index('= ')
                        end = record.rfind('\\n"')
                        if end > eq:
                            arr_val = record[eq + 2:end].strip()
                            if arr_val.startswith('[') and arr_val.endswith(']'):
                                chars = []
                                for byte_str in arr_val[1:-1].split(', '):
                                    try:
                                        chars.append(chr(int(byte_str)))
                                    except:
                                        chars.append('?')
                                vars_dict[name] = '"' + ''.join(chars) + '"'
                            else:
                                vars_dict[name] = arr_val
                            break
            if name not in vars_dict:
                vars_dict[name] = '<String len=' + str(slen) + '>'
        else:
            vars_dict[name] = _format_scalar(raw)
    return vars_dict

def wait_for_cmd():
    while True:
        try:
            if os.path.exists(CMD_FILE):
                with open(CMD_FILE, 'r') as f:
                    content = f.read().strip()
                if content:
                    cmd = json.loads(content)
                    os.remove(CMD_FILE)
                    return cmd
        except:
            pass
        time.sleep(0.1)

def update_breakpoints(gdb_proc, source_file, new_bps):
    send_mi(gdb_proc, '-break-delete')
    read_mi_until(gdb_proc)
    for line_no in new_bps:
        send_mi(gdb_proc, '-break-insert ' + source_file + ':' + str(line_no))
        read_mi_until(gdb_proc)

def main():
    if len(sys.argv) < 3:
        print('Usage: rust_debug_driver.py <source_file> <breakpoints> [binary] [line_offset]', file=sys.stderr)
        sys.exit(1)

    source_file = sys.argv[1]
    bp_str = sys.argv[2]
    binary = sys.argv[3] if len(sys.argv) > 3 else './main'
    line_offset = int(sys.argv[4]) if len(sys.argv) > 4 else 0

    breakpoints = []
    for s in bp_str.split(','):
        s = s.strip()
        if s:
            try:
                breakpoints.append(int(s))
            except ValueError:
                pass

    try:
        with open(STDOUT_FILE, 'w') as f:
            f.write('')
    except:
        pass

    with open(STATE_FILE, 'w') as f:
        json.dump({'status': 'running', 'output': ''}, f)

    gdb_proc = subprocess.Popen(
        ['gdb', '--interpreter=mi', '--quiet', binary],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    read_mi_until(gdb_proc)

    send_mi(gdb_proc, '-gdb-set auto-load safe-path /')
    read_mi_until(gdb_proc)

    send_mi(gdb_proc, '-enable-pretty-printing')
    read_mi_until(gdb_proc)

    send_mi(gdb_proc, '-gdb-set inferior-tty ' + STDOUT_FILE)
    read_mi_until(gdb_proc)

    for line_no in breakpoints:
        send_mi(gdb_proc, '-break-insert ' + source_file + ':' + str(line_no))
        read_mi_until(gdb_proc)

    send_mi(gdb_proc, '-exec-run')

    exited = False

    while not exited and gdb_proc.poll() is None:
        lines = read_mi_until(gdb_proc)

        for line in lines:
            if line.startswith('*stopped'):
                if handle_exit_reason(line, gdb_proc):
                    exited = True
                    break

                reason_match = re.search(r'reason="([^"]*)"', line)
                reason = reason_match.group(1) if reason_match else 'unknown'

                if reason in ('breakpoint-hit', 'end-stepping-range', 'function-finished'):
                    line_match = re.search(r'line="(\d+)"', line)
                    line_no = int(line_match.group(1)) if line_match else None

                    if line_no is not None and line_offset > 0:
                        display_line = line_no - line_offset
                    else:
                        display_line = line_no

                    vars_dict = collect_variables(gdb_proc)
                    output = read_output()

                    state = {
                        'status': 'paused',
                        'line': display_line,
                        'vars': vars_dict,
                        'output': output
                    }
                    with open(STATE_FILE, 'w') as f:
                        json.dump(state, f)

                    while True:
                        cmd = wait_for_cmd()
                        action = cmd.get('action', '')

                        if action == 'stop':
                            output = read_output()
                            state = {'status': 'stopped', 'output': output}
                            with open(STATE_FILE, 'w') as f:
                                json.dump(state, f)
                            send_mi(gdb_proc, '-gdb-exit')
                            exited = True
                            break
                        elif action == 'step':
                            send_mi(gdb_proc, '-exec-next')
                            break
                        elif action == 'continue':
                            send_mi(gdb_proc, '-exec-continue')
                            break
                        elif action == 'set_breakpoints':
                            new_bps = cmd.get('breakpoints', [])
                            new_bps_int = []
                            for b in new_bps:
                                try:
                                    new_bps_int.append(int(str(b)))
                                except ValueError:
                                    pass
                            update_breakpoints(gdb_proc, source_file, new_bps_int)
                            output = read_output()
                            state['output'] = output
                            with open(STATE_FILE, 'w') as f:
                                json.dump(state, f)
                    if exited:
                        break
            elif line.startswith('&'):
                pass

    try:
        gdb_proc.wait(timeout=5)
    except:
        try:
            gdb_proc.terminate()
        except:
            pass

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        try:
            output = read_output()
            with open(STATE_FILE, 'w') as f:
                json.dump({'status': 'error', 'error': str(e), 'output': output}, f)
        except:
            pass
`;
