#!/usr/bin/env python3
import os
import re
import csv

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET_DIR = os.path.join(ROOT, "app", "(dashboard)")
OUT_CSV = os.path.join(ROOT, "docs", "DASHBOARD_onclicks.csv")

def classify(snippet):
    s = snippet
    if re.search(r"\brouter\.push\b", s):
        return "navigation", "Client navigation; ensure auth and route correctness."
    if re.search(r"\b(set[A-Z]\w*|setNotice|set[A-Z]\w*\()", s):
        return "local", "Updates local UI state; wire to backend if persistence required."
    if re.search(r"\b(Service|service|fetch|create|update|remove|delete|invite|save|addCard|addLocal|fetchData|updateTicket|removeTicket|createRelease)\b", s, re.I):
        return "api", "Calls backend API; verify endpoint, error handling, and auth."
    return "unknown", "Review handler to determine required action."

def scan():
    rows = []
    for dirpath, dirs, files in os.walk(TARGET_DIR):
        for fname in files:
            if not fname.endswith(('.tsx', '.ts', '.jsx', '.js')):
                continue
            path = os.path.join(dirpath, fname)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
            except Exception:
                continue
            for i, line in enumerate(lines, start=1):
                if 'onClick' in line:
                    snippet = line.strip()
                    cls, suggestion = classify(snippet)
                    rows.append({
                        'file': os.path.relpath(path, ROOT),
                        'line': i,
                        'snippet': snippet,
                        'classification': cls,
                        'suggested_fix': suggestion,
                    })
    return rows

def write_csv(rows):
    os.makedirs(os.path.dirname(OUT_CSV), exist_ok=True)
    with open(OUT_CSV, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=['file','line','snippet','classification','suggested_fix'])
        writer.writeheader()
        for r in rows:
            writer.writerow(r)

def main():
    rows = scan()
    write_csv(rows)
    print(f"Wrote {len(rows)} entries to {OUT_CSV}")

if __name__ == '__main__':
    main()
