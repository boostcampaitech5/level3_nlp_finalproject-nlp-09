from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from transformers import PreTrainedTokenizerFast, BartForConditionalGeneration
import re
from tqdm import tqdm

import stt
import grouping
import text_to_sum
import time


if __name__ == "__main__":

    start = time.time()

    audio_path = "./data/speach_test/stt_audio_psychology1_short.m4a"
    save_path = "./output/summary_psychology1_test.txt"
    text = stt.main(audio_path)

    # text_path = "./data/stt_result_law1.txt"
    # text = grouping.read_text(text_path)
    data = grouping.split_text_into_sentences(text)
    grouped_data = grouping.main(data)

    model_dict = {
        "mt5": ["./models/mt5"],
        "kobart": ["./models/kobart_sum"],
    }
    model_type = ["mt5", "kobart"]

    summary = text_to_sum.inference_group(
        grouped_data, model_path=model_dict[model_type[0]][0], type=model_type[0])
    result = text_to_sum.post_processing(summary)
    text_to_sum.save_summary(result, save_path)

    print("total :", time.time() - start)
