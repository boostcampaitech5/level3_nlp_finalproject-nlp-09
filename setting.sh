#!/bin/bash
apt update
apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_17.x | bash
apt install -y nodejs

cd frontend
npm install
touch .env.development


cd ..
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cd backend
touch project.db
touch secret.py
apt install -y libpango-1.0-0
apt install -y libcairo2-dev
apt install -y libpangocairo-1.0-0
apt install -y ffmpeg

