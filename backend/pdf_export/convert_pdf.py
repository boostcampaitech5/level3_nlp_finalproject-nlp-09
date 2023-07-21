import tempfile
import sys
sys.path.append('../')

from typing import List
from models import History
from sqlalchemy.orm import Session
from fastapi import Depends
from dependency import get_db
from crud import get_qnas_by_history_id

from weasyprint import HTML, CSS
from weasyprint.fonts import FontConfiguration
from markdown2 import markdown_path
import markdown


def md2pdf(filename, output):
    html_string = markdown_path(filename, encoding="utf-8")
    html_font = 'NanumSquareR'
    html_with_font_css = f'''
        <html>
            <head>
                <meta charset="utf-8">
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/moonspam/NanumSquare@2.0/nanumsquare.css">
                <style>
                    body, table, div, p {{ font-family: '{html_font}'; text-align: justify; }}
                </style>
            </head>
            <body>
                {html_string}
            </body>
        </html>
    '''
    html = HTML(string=html_with_font_css, encoding="utf-8")
    html.write_pdf(output)


def text_to_pdf(output_filename: str, content_types: List, history: History, db: Session = Depends(get_db)):
    md_title, md_contents = f"# {history.title}", ""
    if 'transcription' in content_types:
        md_history = f"## 속기\n\n{history.transcription}"
        md_contents += "\n\n" + md_history
    if 'summary' in content_types:
        md_summary = f"## 요약\n\n{history.summary}"
        md_contents += "\n\n" + md_summary
    if 'qnas' in content_types:
        qnas = get_qnas_by_history_id(db, history.history_id)
        md_qnas = "\n\n" + "## 퀴즈"
        for qna_number, qna in enumerate(qnas):
            md_qna = f"### 퀴즈 {qna_number+1}.\nQ. {qna.question}\n\nA. {qna.answer}"
            md_qnas += "\n" + md_qna
        md_contents += md_qnas

    md_text = md_title + md_contents

    temp_md_file = tempfile.NamedTemporaryFile(mode="w", delete=True, suffix=".md")
    with open(temp_md_file.name, "w", encoding="utf-8") as temp_file:
        temp_file.write(md_text)
    md2pdf(temp_md_file.name, output_filename)


def main():
    import schemas
    from crud import create_user_history, create_qna, delete_user_history, delete_history_qna
    import datetime
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    db_url = "sqlite:///../project.db"
    engine = create_engine(db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    user_id_for_test = "nlp09"
    test_history = schemas.History(
        title="Title", transcription="Transcription", summary="Summary"
    )
    test_history = create_user_history(db, test_history, user_id_for_test)
    test_qna = schemas.QnA(
        question="Question1", answer="Answer1", history_id=test_history.history_id
    )
    test_qna = create_qna(db, test_qna)

    current_time = datetime.datetime.now().strftime("%y%m%d%H%M%S")
    pdf_filename = f"justfortest_{current_time}.pdf"
    content_types = ['transcription', 'summary', 'qnas']
    text_to_pdf(
        output_filename=pdf_filename,
        content_types=content_types,
        history=test_history,
        db=db
    )
    delete_user_history(db, user_id_for_test, test_history.history_id)
    delete_history_qna(db, test_qna)


if __name__ == "__main__":
    main()