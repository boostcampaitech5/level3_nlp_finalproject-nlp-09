from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from transformers import PreTrainedTokenizerFast, BartForConditionalGeneration
import re


def inference(text):

    # kobart
    model_name = "junsun10/kobart-base-v2-add-period"
    model = BartForConditionalGeneration.from_pretrained(model_name).to("cuda")
    tokenizer = PreTrainedTokenizerFast.from_pretrained(model_name)

    split_text = []
    for i in range(0, len(text), 100):
        split_text.append(text[i:i+100])
    result = []
    for text in split_text:
        # 입력 문장 토큰화
        input_ids = tokenizer.encode(text, return_tensors="pt").to("cuda")

        # kobart
        translated = model.generate(
            input_ids=input_ids,
            bos_token_id=model.config.bos_token_id,
            eos_token_id=model.config.eos_token_id,
            length_penalty=2.0,
            # max_length=142,
            max_length=50,
            # min_length=56,
            # min_length=10,
            num_beams=4,
        )

        # 디코딩
        translated_text = tokenizer.decode(
            translated[0], skip_special_tokens=True)
        result.append([text, translated_text])

    return result


def post_processing(result):
    new_result = ""
    for origin, predict in result:
        origin_count = origin.count(".")
        predict_count = predict.count(".")
        new_predict = predict[:len(origin) + predict_count - origin_count - 1]
        print(origin)
        print(predict)
        print(new_predict)
        print()
        new_result += new_predict

    return new_result


def add_period(text):
    result = inference(text)
    new_result = post_processing(result)
    return new_result
