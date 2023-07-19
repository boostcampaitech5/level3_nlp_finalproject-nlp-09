from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import re
from tqdm import tqdm


def inference_group(data, model_path):

    # 모델과 토크나이저 불러오기
    model = AutoModelForSeq2SeqLM.from_pretrained(model_path)
    tokenizer = AutoTokenizer.from_pretrained(model_path)

    # 결과 저장할 리스트
    summary = []

    for i in tqdm(data):

        # 입력 문장
        # input_text = "문단 요약: " + i
        input_text = i + "\n요약: "

        # 입력 문장 토큰화
        input_ids = tokenizer.encode(input_text, return_tensors="pt")

        # 요약 수행
        translated = model.generate(
            input_ids=input_ids,
            max_length=400,
            # max_length=1000,
            no_repeat_ngram_size=2,
            num_beams=4
        )

        # 요약된 문장 디코딩
        translated_text = tokenizer.decode(
            translated[0], skip_special_tokens=True)
        summary.append(translated_text[12:].strip())

    return summary


def post_processing(summary):
    new_summary = []
    for i in summary:
        if len(i) < 6:
            continue

        if i[0] == "." or i[0] == ",":
            i = i[1:].strip()

        if i[:3] == "요약:":
            i = i[3:].strip()

        new_summary.append(i)

    return new_summary


def save_summary(summary, path):
    with open(path, "w", encoding="utf-8-sig") as f:
        for i in summary:
            f.write(i+"\n")

    return
