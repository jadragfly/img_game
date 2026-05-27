#!/usr/bin/env python3
"""
Game Asset Generation Script
游戏资源生成脚本

当使用 img-game-dev 技能创建新游戏时，AI 会将此脚本复制到项目根目录。
"""

import os
import sys
import subprocess
import argparse

SCRIPTS_DIR = r"{{GAME_CHARACTER_DESIGN_SCRIPTS}}"
GAME_DIR = r"{{GAME_DIR}}"


def run_command(cmd, description=""):
    """执行命令并打印结果"""
    print(f"\n{'='*60}")
    print(f" {description}")
    print(f"{'='*60}")
    print(f"Running: {' '.join(cmd)}")
    print()
    
    result = subprocess.run(cmd, shell=True, cwd=GAME_DIR)
    
    if result.returncode != 0:
        print(f"❌ Failed: {description}")
        return False
    
    print(f"✅ Done: {description}")
    return True


def main():
    parser = argparse.ArgumentParser(description="Generate all game assets")
    parser.add_argument("--skip-player", action="store_true", help="Skip player character generation")
    parser.add_argument("--skip-enemy", action="store_true", help="Skip enemy character generation")
    parser.add_argument("--skip-bg", action="store_true", help="Skip background generation")
    parser.add_argument("--force", action="store_true", help="Force regenerate existing files")
    args = parser.parse_args()
    
    print("""
╔══════════════════════════════════════════════════════════╗
║     Game Asset Generation                                ║
║     游戏资源生成                                         ║
╚══════════════════════════════════════════════════════════╝
    """)
    
    all_success = True
    
    # 1. 生成玩家角色
    if not args.skip_player:
        print("\n📦 Part 1: Generating Player Character")
        
        commands = [
            ([sys.executable, f"{SCRIPTS_DIR}\\prepare_run.py",
              "--animation-mode", "game",
              "--game-type", "platformer",
              "--character-name", "Player Character",
              "--description", "{{PLAYER_DESCRIPTION}}",
              "--style", "platformer-16bit",
              "--category", "{{CATEGORY}}",
              "--output-dir", f"{GAME_DIR}\\run\\player",
              "--force" if args.force else ""],
             "Preparing player character"),
            
            ([sys.executable, f"{SCRIPTS_DIR}\\generate_base.py",
              "--run-dir", f"{GAME_DIR}\\run\\player"],
             "Generating player base image"),
            
            ([sys.executable, f"{SCRIPTS_DIR}\\generate_row.py",
              "--run-dir", f"{GAME_DIR}\\run\\player",
              "--row", "all",
              "--mode", "grid",
              "--force" if args.force else ""],
             "Generating player animation rows"),
            
            ([sys.executable, f"{SCRIPTS_DIR}\\extract_frames.py",
              "--run-dir", f"{GAME_DIR}\\run\\player"],
             "Extracting player frames"),
            
            ([sys.executable, f"{SCRIPTS_DIR}\\chroma_key.py",
              "--run-dir", f"{GAME_DIR}\\run\\player"],
             "Processing player chroma key"),
            
            ([sys.executable, f"{SCRIPTS_DIR}\\compose_atlas.py",
              "--run-dir", f"{GAME_DIR}\\run\\player"],
             "Composing player atlas"),
            
            ([sys.executable, f"{SCRIPTS_DIR}\\package_pet.py",
              "--run-dir", f"{GAME_DIR}\\run\\player",
              "--slug", "player",
              "--output-dir", f"{GAME_DIR}\\assets\\characters\\player"],
             "Packaging player character"),
        ]
        
        for cmd, desc in commands:
            cmd = [c for c in cmd if c]
            if not run_command(cmd, desc):
                all_success = False
    
    # 2. 生成敌方角色
    if not args.skip_enemy:
        print("\n📦 Part 2: Generating Enemy Character")
        
        commands = [
            ([sys.executable, f"{SCRIPTS_DIR}\\prepare_run.py",
              "--animation-mode", "game",
              "--game-type", "platformer",
              "--character-name", "Enemy Character",
              "--description", "{{ENEMY_DESCRIPTION}}",
              "--style", "platformer-16bit",
              "--category", "{{CATEGORY}}",
              "--output-dir", f"{GAME_DIR}\\run\\enemy",
              "--force" if args.force else ""],
             "Preparing enemy character"),
            
            ([sys.executable, f"{SCRIPTS_DIR}\\generate_base.py",
              "--run-dir", f"{GAME_DIR}\\run\\enemy"],
             "Generating enemy base image"),
            
            ([sys.executable, f"{SCRIPTS_DIR}\\generate_row.py",
              "--run-dir", f"{GAME_DIR}\\run\\enemy",
              "--row", "all",
              "--mode", "grid",
              "--force" if args.force else ""],
             "Generating enemy animation rows"),
            
            ([sys.executable, f"{SCRIPTS_DIR}\\extract_frames.py",
              "--run-dir", f"{GAME_DIR}\\run\\enemy"],
             "Extracting enemy frames"),
            
            ([sys.executable, f"{SCRIPTS_DIR}\\chroma_key.py",
              "--run-dir", f"{GAME_DIR}\\run\\enemy"],
             "Processing enemy chroma key"),
            
            ([sys.executable, f"{SCRIPTS_DIR}\\compose_atlas.py",
              "--run-dir", f"{GAME_DIR}\\run\\enemy"],
             "Composing enemy atlas"),
            
            ([sys.executable, f"{SCRIPTS_DIR}\\package_pet.py",
              "--run-dir", f"{GAME_DIR}\\run\\enemy",
              "--slug", "enemy",
              "--output-dir", f"{GAME_DIR}\\assets\\characters\\enemy"],
             "Packaging enemy character"),
        ]
        
        for cmd, desc in commands:
            cmd = [c for c in cmd if c]
            if not run_command(cmd, desc):
                all_success = False
    
    # 3. 创建背景目录
    if not args.skip_bg:
        print("\n📦 Part 3: Background")
        bg_dir = f"{GAME_DIR}\\assets\\backgrounds"
        if not os.path.exists(bg_dir):
            os.makedirs(bg_dir)
            print(f"✅ Created background directory: {bg_dir}")
        else:
            print(f"✅ Background directory exists: {bg_dir}")
        
        print("""
📝 Background Options:
   - Game will use procedural background (built-in)
   - Or use doubao-api skill to generate custom background
   - Place image at: assets/backgrounds/game-bg.webp
        """)
    
    # 总结
    print("\n" + "="*60)
    if all_success:
        print("✅ All assets generated successfully!")
    else:
        print("⚠️ Some steps failed. Check logs above.")
    print("="*60)
    
    print("""
📁 Generated Assets:
   - Player:  assets/characters/player/spritesheet.webp
   - Enemy:   assets/characters/enemy/spritesheet.webp
   - Background: assets/backgrounds/ (procedural)

🚀 Next Step:
   Open index.html in browser to play!
    """)


if __name__ == "__main__":
    main()
