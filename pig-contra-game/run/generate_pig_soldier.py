#!/usr/bin/env python3
"""生成猪士兵（玩家）完整精灵"""
import sys
import os
from pathlib import Path

sys.path.insert(0, r"D:\impotent\skills\make_game\game-character-design\scripts")
os.chdir(r"D:\impotent\skills\make_game\game-character-design")

import generate_row
import extract_frames
import chroma_key
import compose_atlas
import render_qa
import package_pet

RUN_DIR = Path(r"D:\impotent\skills\make_game\pig-contra-game\run\pig-soldier")
OUTPUT_DIR = Path(r"D:\impotent\skills\make_game\pig-contra-game\assets\characters\player")

print("=" * 60)
print("生成猪士兵（玩家）精灵")
print("=" * 60)

rows = ["idle", "walk-right", "walk-left", "jump", "crouch", "attack", "pickup"]
for row in rows:
    print(f"生成 {row}...")
    sys.argv = ["generate_row.py", "--run-dir", str(RUN_DIR), "--row", row, "--mode", "grid"]
    result = generate_row.main()
    if result != 0:
        print(f"❌ {row} 生成失败!")
        sys.exit(1)
    else:
        print(f"✅ {row} 完成")

print("\n提取帧...")
sys.argv = ["extract_frames.py", "--run-dir", str(RUN_DIR)]
result = extract_frames.main()
if result != 0:
    print("❌ 帧提取失败!")
    sys.exit(1)

print("\n抠图处理...")
sys.argv = ["chroma_key.py", "--run-dir", str(RUN_DIR)]
result = chroma_key.main()
if result != 0:
    print("❌ 抠图失败!")
    sys.exit(1)

print("\n合成精灵图...")
sys.argv = ["compose_atlas.py", "--run-dir", str(RUN_DIR)]
result = compose_atlas.main()
if result != 0:
    print("❌ 合成失败!")
    sys.exit(1)

print("\nQA 检查...")
sys.argv = ["render_qa.py", "--run-dir", str(RUN_DIR), "--chroma-threshold", "5"]
result = render_qa.main()
if result != 0:
    print("❌ QA 检查失败!")
    sys.exit(1)

print("\n打包输出...")
sys.argv = ["package_pet.py", "--run-dir", str(RUN_DIR), "--slug", "pig-soldier", "--output-dir", str(OUTPUT_DIR)]
result = package_pet.main()
if result != 0:
    print("❌ 打包失败!")
    sys.exit(1)

print("\n" + "=" * 60)
print("猪士兵（玩家）精灵生成完成!")
print("=" * 60)
