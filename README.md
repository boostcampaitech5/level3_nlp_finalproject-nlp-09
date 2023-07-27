# Lec & Rec: 누가 나 대신 수업 좀 들어줘!

### ⬇️ 서비스 웹 페이지 (테스트 용 ID: test, PW: 1234)
http://lecnrec.kro.kr

## 🤷🏻‍♂️ Lec & Rec은 왜 사용하나요?

- Lec & Rec은 끊임없이 배우고자 하는 분들이 **보다 효율적으로 학습할 수 있는 도구를 제공**해요
- Lec & Rec은 **무엇인가를 배우고자 하는 모든 분들을 위해** 탄생했어요

## 🤷🏻‍♀️ Lec & Rec은 무엇을 하나요?

### 당신 대신 수업을 들어줍니다.

**Lec & Rec**은 강의 **유튜브 링크**나 **음성 파일**을 입력 받아

**1) 모든 내용을 적은 속기본
2)** **핵심을 빠르고 쉽게 파악할 수 있는 요약본
3) 이해도를 체크해볼 수 있는 퀴즈를 제공해요**

- 유튜브 링크나 음성 파일을 입력으로 받아 먼저 속기본을 만들어요
- AI 모델이 속기본으로 요약본과 퀴즈를 생성하게 돼요
- 각각의 결과는 만들어지는 즉시 확인하실 수 있어요

### 이것도 가능해요.

더 **효율적인 학습**을 위해 **Lec & Rec이 추가로 제공하는 기능**은 다음과 같아요.

- 한번 학습으로 끝? ❌
    - 시간이 지나더라도 **언제라도 다시 학습하실 수 있게 히스토리 기능을 제공**해요
- 자신만의 노트를 만들고 싶으신가요? ⭕
    - 모든 내용을 커스터마이즈하실 수 있게 **수정, 삭제 기능을 제공**해요
- 파일로 학습하고 싶으신가요? ⭕
    - 속기본, 요약본, 퀴즈 **원하는 자료를 골라 pdf 형태로 다운**받으실 수 있어요

## 구동 방법
### 요구사항
`python 3.10`
### clone 및 세팅
```shell
$ git clone https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-09.git

$ cd level3_nlp_finalproject-nlp-09

$ chmod +x setting.sh
$ ./setting.sh
```

### Frontend setting

**frontend/.env.development 수정**

```python
BACKEND_SERVER_ADDRESS=<IP주소:포트번호>
```

### Backend setting

**Database setting**

```shell
$ sudo apt install -y alembic

$ cd backend
$ source .venv/bin/activate

$ alembic init migrations
```

**backend/alembic.ini 수정**

```text
sqlalchemy.url = sqlite:///./project.db
```

**backend/migrations/env.py 수정**

```python
import sys
sys.path.append('../backend')
import models
...
...
target_metadata = models.Base.metadata
```

```shell
$ alembic revision --autogenerate
$ alembic upgrade head
```

**backend/secret.py 수정**

```python
JWJ_SECRET_KEY = <임의의 문자열>
JWT_ALGORITHM = <암호화 알고리즘> # ex) HS256, AES128
OPENAI_API_KEY = <openai api key>
PORT = <포트번호>
```

### 프로젝트 실행

```shell
# backend 실행
$ python main.py

# frontend 실행
$ cd ..
$ cd frontend
$ sudo npm start
```