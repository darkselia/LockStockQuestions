"""CSV-to-JSON converter for LockStockQuestions data."""

import argparse
import csv
import json
from pathlib import Path
from typing import Any, Dict, Iterable, Optional


def normalize_text(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    stripped = value.strip()
    return stripped or None


def parse_int(value: Optional[str]) -> Optional[int]:
    normalized = normalize_text(value)
    if normalized is None:
        return None
    try:
        return int(normalized)
    except ValueError:
        return None


def parse_answer(value: Optional[str]) -> Optional[Any]:
    normalized = normalize_text(value)
    if normalized is None:
        return None
    try:
        return int(normalized)
    except ValueError:
        return normalized


def build_grouped_questions(rows: Iterable[Dict[str, str]]) -> Dict[int, list]:
    grouped: Dict[int, list] = {}
    for row in rows:
        if not any(value.strip() for value in row.values() if value):
            continue
        video_id = parse_int(row.get("video-id"))
        question_id = parse_int(row.get("question-id"))
        if video_id is None or question_id is None:
            raise ValueError("Row is missing required numeric identifiers: %r" % row)
        question_record = {
            "question-id": question_id,
            "question": row.get("question", "").strip(),
            "hint1": normalize_text(row.get("hint1")),
            "hint2": normalize_text(row.get("hint2")),
            "answer": parse_answer(row.get("answer")),
            "answer-comm": normalize_text(row.get("answer-comm")),
        }
        grouped.setdefault(video_id, []).append(question_record)
    return grouped


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert a semicolon CSV of LockStock questions into JSON grouped by video-id.")
    parser.add_argument("csv_path", type=Path, help="Path to the source questions.csv")
    parser.add_argument("json_path", type=Path, help="Path where the JSON dump will be written")
    args = parser.parse_args()

    with args.csv_path.open(encoding="utf-8-sig", newline="") as csv_file:
        reader = csv.DictReader(csv_file, delimiter=";")
        data = build_grouped_questions(reader)

    args.json_path.parent.mkdir(parents=True, exist_ok=True)
    with args.json_path.open("w", encoding="utf-8") as out_file:
        json.dump(data, out_file, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
