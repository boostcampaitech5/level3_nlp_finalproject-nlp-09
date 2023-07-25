import tempfile
import sys
import os
sys.path.append('../')

from typing import Dict
from models import History
from sqlalchemy.orm import Session
from fastapi import Depends
from dependency import get_db
from crud import get_qnas_by_history_id

from weasyprint import HTML
from markdown2 import markdown_path
import datetime


def md2pdf(filename, output):
    print(output)
    html_string = markdown_path(filename, encoding="utf-8")
    html_font = 'NanumSquareR'
    html_with_font_css = f'''
        <html>
            <head>
                <meta charset="utf-8">
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/moonspam/NanumSquare@2.0/nanumsquare.css">
                <style>
                    body, table, div, p {{ font-family: '{html_font}'; text-align: justify; }}
                    h2:first-of-type {{ page-break-before: avoid; }}
                    h2 {{ page-break-before: always; }}
                </style>
            </head>
            <body>
                {html_string}
            </body>
        </html>
    '''
    html = HTML(string=html_with_font_css, encoding="utf-8")
    html.write_pdf(output)


def text_to_pdf(is_exported: Dict, history: History, db: Session = Depends(get_db)):
    current_time = datetime.datetime.now().strftime("%y%m%d%H%M%S")
    pdf_filename = f"lecnrec_{history.title}_{current_time}.pdf"
    pdf_temppath = './pdf_tempfiles'
    pdf_filepath = os.path.join(pdf_temppath, pdf_filename)

    title = history.title.replace('_', '\_')
    md_title, md_contents = f"# {title}", ""
    if is_exported['transcription']:
        md_history = f"## 속기\n\n{history.transcription}"
        md_contents += "\n\n" + md_history
    if is_exported['summary']:
        summary_list = history.summary.split('\n')
        summary_with_bullet = '- ' + '\n\n- '.join(summary_list)
        md_summary = f"## 요약\n\n{summary_with_bullet}"
        md_contents += "\n\n" + md_summary
    if is_exported['qnas']:
        qnas = get_qnas_by_history_id(db, history.history_id)
        md_qnas = "\n\n" + "## 퀴즈"
        if qnas:
            for qna_number, qna in enumerate(qnas):
                md_qna = f"### 퀴즈 {qna_number+1}.\n\nQ. {qna.question}\n\nA. {qna.answer}"
                md_qnas += "\n\n" + md_qna
        else:
            md_qnas += "\n\n" + "생성된 퀴즈가 없습니다.\n\n제공된 영상 또는 음성의 길이가 너무 짧지는 않은지 확인해주세요."
        md_contents += md_qnas

    md_text = md_title + md_contents

    temp_md_file = tempfile.NamedTemporaryFile(mode="w", delete=True, suffix=".md")
    with open(temp_md_file.name, "w", encoding="utf-8") as temp_file:
        temp_file.write(md_text)
    md2pdf(temp_md_file.name, pdf_filepath)

    return pdf_filepath, pdf_filename


def main():
    import schemas
    from crud import create_user_history, create_qna, delete_user_history, delete_history_qna, get_history_by_id
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

    is_exported = {
        'transcription' : False, 
        'summary': True,
        'qnas': True
        }
    text_to_pdf(
        is_exported=is_exported,
        history=test_history,
        db=db
    )
    delete_user_history(db, user_id_for_test, test_history.history_id)
    delete_history_qna(db, test_qna)


if __name__ == "__main__":
    main()
