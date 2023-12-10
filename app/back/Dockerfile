# Node.jsのイメージをベースにする
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json （もしあれば）をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ssコマンドを含むiproute2パッケージのインストール
RUN apt-get update && apt-get install -y iproute2

# ソースコードをコピー
COPY . .

# サーバーレスオフラインを起動
CMD ["npm", "run", "local"]