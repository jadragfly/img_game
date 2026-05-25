#!/usr/bin/env python3
"""Generate game backgrounds for Pig Contra game using Doubao API."""
import sys
import os
from pathlib import Path

sys.path.insert(0, r"D:\impotent\skills\make_game\.trae\skills\doubao-api")
os.environ["DOUBAO_DEBUG"] = "1"

from doubao_client import generate_image, DoubaoError

BG_DIR = Path(r"D:\impotent\skills\make_game\pig-contra-game\assets\backgrounds")
BG_DIR.mkdir(parents=True, exist_ok=True)

def generate_backgrounds():
    """Generate game background images."""
    backgrounds = [
        {
            "prompt": "A dramatic war-torn jungle battlefield, destroyed military base, burning ruins, thick vegetation, dark stormy sky, parallax scrolling ready, cinematic lighting, intense atmosphere, video game background art style, detailed illustration",
            "aspect_ratio": "16:9",
            "prefix": "main-bg",
            "desc": "主背景 - 战争丛林战场"
        },
        {
            "prompt": "Mid-ground jungle with dense trees and fog, destroyed structures, parallax scrolling layer, muted colors with green and brown tones, game background, atmospheric depth",
            "aspect_ratio": "16:9",
            "prefix": "layer1",
            "desc": "中景 - 丛林层次"
        },
        {
            "prompt": "Foreground military structures, metallic debris, concrete walls, barbed wire, industrial war equipment, dark silhouettes, parallax foreground layer, game art style",
            "aspect_ratio": "16:9",
            "prefix": "foreground",
            "desc": "前景 - 军事废墟"
        },
    ]

    print("=" * 60)
    print("Generating Pig Contra Game Backgrounds")
    print("=" * 60)

    for bg in backgrounds:
        print(f"\nGenerating: {bg['desc']}")
        print(f"Prompt: {bg['prompt'][:80]}...")
        try:
            paths = generate_image(
                prompt=bg["prompt"],
                aspect_ratio=bg["aspect_ratio"],
                out_dir=BG_DIR,
                out_prefix=bg["prefix"],
            )
            print(f"✅ Success: {paths}")
        except DoubaoError as e:
            print(f"❌ Error: {e.code} - {e.message}")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")

    print("\n" + "=" * 60)
    print(f"Backgrounds saved to: {BG_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    generate_backgrounds()
