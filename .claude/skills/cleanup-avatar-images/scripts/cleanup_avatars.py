#!/usr/bin/env python3
"""
Avatar Image Cleanup

Executes the cleanup operation based on scan report.
Removes avatar image references and special link patterns from markdown files.
"""

import os
import sys
import json
import argparse
import re
from pathlib import Path
from typing import List, Dict


def parse_args():
    parser = argparse.ArgumentParser(description='Execute avatar cleanup based on scan report')
    parser.add_argument('--report', required=True, help='Input scan report JSON path')
    parser.add_argument('--execute', action='store_true', help='Actually modify files (default: dry-run)')
    parser.add_argument('--output', required=True, help='Output result JSON path')
    return parser.parse_args()


def cleanup_file(file_info: Dict, execute: bool = False) -> Dict:
    """
    Clean up a single markdown file.
    Returns dict with cleanup statistics.
    """
    file_path = Path(file_info['absolute_path'])
    
    if not file_path.exists():
        return {
            'success': False,
            'error': 'File not found',
            'removed_count': 0
        }
    
    try:
        # Read file
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Build set of line numbers to remove
        lines_to_remove = set()
        
        # Add avatar reference lines
        for ref in file_info['avatar_refs']:
            lines_to_remove.add(ref['line_num'])
        
        # Add special link lines
        for ref in file_info['special_refs']:
            lines_to_remove.add(ref['line_num'])
        
        # Filter out lines to remove
        new_lines = []
        removed_count = 0
        
        for line_num, line in enumerate(lines, start=1):
            if line_num in lines_to_remove:
                removed_count += 1
            else:
                new_lines.append(line)
        
        # Write back if executing
        if execute:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
        
        return {
            'success': True,
            'removed_count': removed_count,
            'avatar_refs_removed': len(file_info['avatar_refs']),
            'special_refs_removed': len(file_info['special_refs'])
        }
    
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'removed_count': 0
        }


def main():
    args = parse_args()
    
    # Load scan report
    print(f"📖 Loading scan report: {args.report}")
    with open(args.report, 'r', encoding='utf-8') as f:
        scan_data = json.load(f)
    
    mode = "EXECUTING" if args.execute else "DRY-RUN"
    print(f"\n🚀 Mode: {mode}")
    
    if not args.execute:
        print("   (No files will be modified)")
    
    # Process each file
    print(f"\n🔧 Processing {len(scan_data['files'])} files...")
    
    results = {
        'mode': mode,
        'scan_params': scan_data['scan_params'],
        'files_processed': {},
        'statistics': {
            'files_processed': 0,
            'files_modified': 0,
            'files_failed': 0,
            'avatar_refs_removed': 0,
            'special_refs_removed': 0,
            'total_removed': 0
        }
    }
    
    for rel_path, file_info in scan_data['files'].items():
        print(f"   Processing: {rel_path}")
        
        cleanup_result = cleanup_file(file_info, execute=args.execute)
        
        results['files_processed'][rel_path] = cleanup_result
        results['statistics']['files_processed'] += 1
        
        if cleanup_result['success']:
            if cleanup_result['removed_count'] > 0:
                results['statistics']['files_modified'] += 1
                results['statistics']['avatar_refs_removed'] += cleanup_result['avatar_refs_removed']
                results['statistics']['special_refs_removed'] += cleanup_result['special_refs_removed']
                results['statistics']['total_removed'] += cleanup_result['removed_count']
                
                print(f"      ✓ Removed {cleanup_result['removed_count']} references")
        else:
            results['statistics']['files_failed'] += 1
            print(f"      ✗ Error: {cleanup_result['error']}")
    
    # Write results
    print(f"\n💾 Writing results to {args.output}")
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    # Summary
    print("\n" + "="*60)
    if args.execute:
        print("✅ Cleanup Complete!")
    else:
        print("✅ Dry-run Complete!")
    print("="*60)
    
    stats = results['statistics']
    print(f"Files processed: {stats['files_processed']}")
    print(f"Files modified: {stats['files_modified']}")
    if stats['files_failed'] > 0:
        print(f"Files failed: {stats['files_failed']}")
    print(f"\nReferences removed:")
    print(f"  - Avatar refs: {stats['avatar_refs_removed']}")
    print(f"  - Special links: {stats['special_refs_removed']}")
    print(f"  - Total: {stats['total_removed']}")
    
    if not args.execute:
        print("\n💡 Run with --execute to actually modify files")


if __name__ == '__main__':
    main()
