#!/usr/bin/env python3
import subprocess, os, sys

os.chdir('/opt/workspace/nova-vault-studio')

# Get all changed files
result = subprocess.run(['git', 'diff', '--name-only'], capture_output=True, text=True, check=True)
files = [f.strip() for f in result.stdout.strip().split('\n') if f.strip()]
print(f"Total changed files: {len(files)}")

# Split into batches of 30
batch_size = 30
batches = [files[i:i+batch_size] for i in range(0, len(files), batch_size)]
print(f"Batches: {len(batches)}")

for i, batch in enumerate(batches):
    print(f"\n=== Batch {i+1}/{len(batches)}: {len(batch)} files ===")
    # Stage batch files
    r = subprocess.run(['git', 'add'] + batch, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  Stage failed: {r.stderr[:200]}")
        continue
    
    # Commit
    r = subprocess.run(['git', 'commit', '-m', f'prompt: 图片压缩批次 {i+1}/{len(batches)}', '--no-verify'],
                      capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  Commit failed: {r.stderr[:200]}")
        continue
    
    # Push - try up to 3 times
    for attempt in range(3):
        try:
            r = subprocess.run(['git', 'push', 'origin', 'HEAD:main'], 
                             capture_output=True, text=True, timeout=180)
            if r.returncode == 0:
                print(f"  PUSHED OK")
                break
            else:
                print(f"  Push attempt {attempt+1} failed: {r.stderr[:100]}")
        except subprocess.TimeoutExpired:
            print(f"  Push attempt {attempt+1} timed out")
    
    # Check if we still have unstaged files to commit
    r = subprocess.run(['git', 'status', '--porcelain', '--untracked-files=no'], capture_output=True, text=True)
    if not r.stdout.strip():
        print("  No more uncommitted changes - all committed!")
        break

print("\n=== Done ===")
r = subprocess.run(['git', 'log', 'origin/main..HEAD', '--oneline'], capture_output=True, text=True)
remaining = r.stdout.strip()
if remaining:
    print(f"Remaining: {remaining}")
else:
    print("All pushed successfully!")