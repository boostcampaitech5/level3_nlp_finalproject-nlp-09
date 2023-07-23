import asyncio
from pprint import pprint
from tqdm import tqdm

import nltk
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer


class SentenceGrouper:
    def __init__(self, model_name='jhgan/ko-sroberta-multitask'):
        self.device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
        assert self.device != 'cuda', f"CUDA GPU is not available now (DEVICE: {self.device})"
        self.model = SentenceTransformer(model_name)
        self.model.to(self.device)
        nltk.download('punkt')
        self.tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')

    def split_text_into_sentences(self, text):
        sentences = self.tokenizer.tokenize(text)
        return sentences
    

    def _calculate_cosine_similarity(self, vector1, vector2):
        vector1 = vector1.reshape(1, -1)
        vector2 = vector2.reshape(1, -1)
        similarity = cosine_similarity(vector1, vector2)
        return similarity

    def grouping(self, sentences, length_threshold=30, similarity_threshold_for_short=0.2, similarity_threshold_for_long=0.3, length_threshold_for_paragraph=50):
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
            embeddings = self.model.encode([region, current_sentence])

            similarity = self._calculate_cosine_similarity(
                embeddings[0], embeddings[1]
            )

            if len(region) <= length_threshold or len(current_sentence) <= length_threshold:
                if similarity >= similarity_threshold_for_short:
                    stack[-1] += ' ' + current_sentence
                    continue

            if similarity >= similarity_threshold_for_long:
                stack[-1] += ' ' + current_sentence
            else:
                stack.append(current_sentence)
                
        filtered_stack = [i for i in stack if len(i) >= length_threshold_for_paragraph]  # 의미 없다고 판단되는 문단 filtering
    
        return filtered_stack

    
    def re_grouping(self, filtered_list, paragraph_group_num: int = 2, paragraph_sentence_num: int = 2):
    
        def split_paragraph(sentences, sentences_num, isGrouping):
            temp = []
            split_num = len(sentences) // sentences_num if isGrouping else sentences_num
            sentences_num = sentences_num if isGrouping else len(sentences) // sentences_num
            
            for i in range(0, split_num):
                if i == split_num - 1:
                    temp.append(' '.join(sentences[i*sentences_num : ]))
                else:
                    temp.append(' '.join(sentences[i*sentences_num : (i+1)*sentences_num]))
            
            return temp
            
        grouping_paragraph = split_paragraph(filtered_list, paragraph_group_num, True)
        total_paragraph = []
        
        for group in grouping_paragraph:
            group = self.split_text_into_sentences(group)
            total_paragraph.append(split_paragraph(group, paragraph_sentence_num, False))

        return total_paragraph
        

class TextSummarizer:
    def __init__(self, model_name="junsun10/mt5-base-kor-paper-summary"):
        self.device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
        assert self.device != 'cuda', f"CUDA GPU is not available now (DEVICE: {self.device})"
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        self.model.to(self.device)
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)

    def inference_group(self, data):
        summary = []
        for i in tqdm(data):
            input_text = i + "\n요약: "
            # input_text = i  # if use lcw99 model
            input_ids = self.tokenizer.encode(input_text, return_tensors="pt").to(self.device)
            translated = self.model.generate(
                input_ids=input_ids,
                max_length=400,
                no_repeat_ngram_size=2,
                num_beams=4
            )
            translated_text = self.tokenizer.decode(
                translated[0], skip_special_tokens=True)
            summary.append(translated_text[12:].strip())
            # summary.append(translated_text)  # if use lcw99 model

        return summary

    def post_processing(self, summary):
        new_summary = []
        for i in summary:
            if len(i) < 6:
                continue
            
            if i[0] == "." or i[0] == ",":
                i = i[1:].strip()
                
            if i.strip()[:4] == "요약 :" or i.strip()[:3] == "요약:":
                i = i[4:].strip() if i.strip()[:4] == "요약 :" else i[3:].strip()
                
            new_summary.append(i)
            
        return new_summary


def set_summary_inference():
    sentence_grouper = SentenceGrouper()
    text_summarizer = TextSummarizer()
    return sentence_grouper, text_summarizer


def summarize(transcription):
    sentence_grouper, text_summarizer = set_summary_inference()
    data = sentence_grouper.split_text_into_sentences(transcription)
    grouped_data = sentence_grouper.grouping(data)

    # 원본 -> re_grouping 미사용
    # raw_summary = text_summarizer.inference_group(grouped_data)
    # summary_list = text_summarizer.post_processing(raw_summary)
    # summary = '- ' + '\n\n- '.join(summary_list)

    regrouped_data = sentence_grouper.re_grouping(grouped_data)
    summary_list = []
    
    for paragraph in regrouped_data:
        raw_summary = text_summarizer.inference_group(paragraph)
        summary_list.append(' '.join(text_summarizer.post_processing(raw_summary)))
        
    # summary = '\n'.join(summary_list) 
    summary = '- ' + '\n\n- '.join(summary_list) # 현재 PDF에서 요약의 MD bullet 형식 출력을 위해 수정했습니다.
    
    return summary_list, summary


async def summarize_async(transcription):
    summary_list, summary = summarize(transcription)
    return summary_list, summary


async def summarize_test(transcription):
    await asyncio.sleep(5)
    summary_list = ["Sample Summary 1", "Sample Summary 2", "Sample Summary 3"]
    summary = "Sample Summary 1\nSample Summary2\nSample Summary3"
    return summary_list, summary


def main():
    transcription = """아는데 이게 왜 이런지 이론적으로 이게 말끔하게 설명이 안 되고 있었다면 그런 것들을 
        좀 더 잘 설명해 줄 수 있는 현실에 맞게 잘 설명해 줄 수 있는 그런 어떤 모델로서 요게 기능을 할 수가 있게 됩니다. 
        이런 매개효과나 매개효과를 포함한 어떤 모델들의 역할이 그런 것들이라고 생각을 하시면은 알겠습니다. 요게 이제 매개효과구요. 
        매개효과에는 두가지 종류가 있어요. 두가지 종류가 있는데 뒤에 나올테지만 뒤에도 하나는 이제 완전, 안뒤에 보면 다른걸까? 하나는 어디있니? 완전 매개. 
        그리고 다른 하나는 부분 매개. 이렇게 두가지가 있어요. 이 완전 매개와 부분 매개는 뭐냐면은 이 학교폭력이 자살 사고에 직접적으로 영향을 끼치는 것은 없고 
        학교폭력은 무조건 우울을 증가시키고 그래서 그 증가된 우울이 자살 사고를 증가시키게 된다라는게 이제 검증이 되게 된다면은 그거를 우리가 완전 매개라고 합니다. 
        즉 원래 우리가 생각을 했던 원인 변인인 학교폭력과 결과 변인인 자살 사고 두 변인간의 직접적인 관계가 없고 무조건 저 중간단위를 거쳐갈 때 우리가 그걸 완전 
        매개라고 하고요. 부분 매개 같은 경우에는 학교폭력이 우울을 심화시키고 그 심화된 우울이 자살 사고를 증가시키지만 동시에 그것만으로는 이 학교폭력이 자살 사고를 
        높이는 그거를 온전히 다 설명할 수가 없어. 학교폭력이 우울을 높여서 높아진 우울이 자살 사고를 높이기도 하지만 동시에 또 학교폭력도 이 자살 사고를 직접적으로 
        좀 높이는 역할을 하는 걸로 보여 그렇게 검증이 된다면 그거는 우리가 매개 중에서도 부분 매개라고 이제 이야기를 하게 됩니다. 이렇게 두 가지로 좀 나뉘게 되고요. 
        이제 뭐 그렇다. 이렇게 완전 매개, 부분 매개. 검증은 여러분 검증은 어렵지 않습니다. 검증은 되게 쉬워요. 쉽고 검증은 이제 총 이렇게 요 뭐라그러냐 요 단계를 
        거쳐가지고 우리가 매개효과를 검증을 하게 됩니다. 요 단계를 거치게 되는데 한번 하나씩 살펴보도록 하죠. 먼저 가장 첫 번째는 뭐겠어요. 저 학교폭력이라는 예측 변수가 
        원인 변수가 자살 사고라는 결과 변수, 종속 변수를 이렇게 두 가지만 놓고 봤을 때 단순해기 모델이죠. 단순해기 모델로 저 두 가지 변수만을 놓고 봤을 때 학교폭력이 
        자살 사고를 유의미하게 예측을 하는지 학교폭력이 높아지면 자살 사고가 유의미하게 높아지는지를 우리가 단순해기로 먼저 검증을 해야겠죠. 
        그래서 요거를 이제 그림에서 확인을 하면 C라고 볼 수가 있어요. C에 있는 화살표 부분이에요. 요 루트를 우리가 먼저 검증을 하는 거죠. 1단계로 요거를 보고, 
        그리고 두 번째 단계는 뭐겠어요? 두 번째 단계는 C기기 확인이 됐으면 우리가 A를 검증을 해줘야겠죠. A를 검증을 해줄건데 학교폭력이 우울을 과연 유의미하게 예측을 하는지, 
        학교폭력이 우울을 유의미하게 예측을 하는지에 대해서 우울이 종속변이 되는 겁니다. 이 경우에는 우울을 종속변으로 놓고 학교폭력이 우울을 예측하는지 검증을 해줍니다. 
        단순하게 이 모델이 되겠죠. 그렇게 해서 저 A가 학교폭력이 우울을 유의미하게 예측하는지 혹은 높이는지 낮추는지 이것들이 이제 검증이 되고 나면은 그 다음 스텝으로는 
        우리가 뭘 검증을 해야겠어요? 우울이 자살 사고를 유의미하게 예측을 하는지 혹은 증명시키는지 감소시키는지 이론에 따라서 이런 목표에 좀 달라질 수가 있겠죠. 이런 것들은. 
        그리고 B를 우리가 검증을 하게 됩니다. 그래서 이렇게 세 가지가 다 검증, 요 세 가지 단순하게 분석을 우리가 실시를 하고 나면은 그리고 남은 그 다음 단계는 
        우리가 뭘 해야겠어요? 그 다음 단계는 이 학교폭력과 우울이 자살 사고를 예측하는 이 두 가지가 모두 한꺼번에 포함이 된 다중일기 모형을 우리가 검증을 해보게 됩니다. 
        그렇게 될 경우에 이제 어떻게 되냐면은 우울의 영향력, 그러니까 학교폭력이 우울에 영향을 끼쳐서 그 우울이 자살 사고에 영향을 끼치는 이 A, A만큼의 정확히는 뭐 
        A만큼이라고 엄밀히 말할 수는 없는데 어쨌든 이 학교폭력이 우울을 통해서 자살 사고에 끼치는 영향, 정확히는 이 길이죠. 전체 길 만큼의 영향력을 제외한, 제외하고도 
        이 학교폭력이 자살 사고를 유의미하게 예측하는지, 그러니까 이 C2다고 같은 경우에는 C2, 학교폭력이 이제 우울을, 우울이 끼치는 영향력을 통제하고도 여전히 유의미하게 
        자살 사고를 예측을 하는지를 우리가 검증을 하게 되고 만약에 매개효과가 유의미하다면 저 C2가 C에 비해서 어떻게 되겠어요? C2가 C에 비해서, C2가 기존 C에 비해서 
        유의미하게 줄어들겠죠. C2가 C에 비해서 줄어들 겁니다. 왜? 이게 원래는 이렇게 두 가지만 놓고 생각했을 때는 이 C만큼 얘가 설명을 했었는데 얘가 우울을 통해서 
        자살 사고를 설명하는 분량만큼을 통제를 하게 되니까 요만큼의 분량이 빠지게 되겠죠. 그러니까 그렇게 되면 요만큼의 분량을 뺀 값이 이제 C2가 될 건데 요 C2는
        그러면 어떻게 되겠어요. 그만큼 빠진 거니까 줄어들겠죠. C보다 그래서 유의미하게 줄어드는 거를 우리가 확인을 해주면 되겠습니다."""
    
    summary, su = summarize(transcription)
    print(su)
    
if __name__ == "__main__":
    main()
