# -*- coding: utf-8 -*-
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import nltk
import time
from tqdm import tqdm


def split_text_into_sentences(text):
    # 문장 토큰화를 위해 nltk의 PunktSentenceTokenizer를 사용합니다.
    nltk.download('punkt')
    tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
    sentences = tokenizer.tokenize(text)

    return sentences


def read_text(path):
    with open(path, "r", encoding="utf-8-sig") as f:
        text = f.read()

    return text


def main(sentences):
    model = SentenceTransformer('jhgan/ko-sroberta-multitask')

    stack = []
    for sentence in tqdm(sentences):
        if not stack:
            stack.append(sentence)
            continue

        region = stack[-1]
        if len(region) >= 400:
            stack.append(sentence)
            continue

        current_sentence = sentence
        embeddings = model.encode([region, current_sentence])

        vector1 = embeddings[0]
        vector2 = embeddings[1]

        vector1 = vector1.reshape(1, -1)
        vector2 = vector2.reshape(1, -1)

        similarity = cosine_similarity(vector1, vector2)

        if len(region) <= 30 or len(current_sentence) <= 30:
            if similarity >= 0.2:
                stack[-1] += ' ' + current_sentence
                continue

        if similarity >= 0.4:
            stack[-1] += ' ' + current_sentence
        else:
            stack.append(current_sentence)

    return stack
