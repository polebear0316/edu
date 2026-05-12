# 1. Node.js 베이스 이미지 선택
FROM node:20-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 종속성 설치 (서버 폴더 기준)
# server/package.json 파일을 복사하여 라이브러리 설치
COPY server/package*.json ./server/
RUN cd server && npm install --production

# 4. 모든 소스 코드 복사
COPY . .

# 5. 앱 실행 포트 설정
EXPOSE 3000

# 6. 서버 실행 명령어
# WORKDIR를 server로 옮기거나 경로를 지정하여 실행
CMD ["node", "server/index.js"]
