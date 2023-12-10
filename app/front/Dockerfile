# Node.jsのイメージをベースにする
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json （もしあれば）をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# 開発サーバーを起動
CMD ["npm", "run", "local"]
