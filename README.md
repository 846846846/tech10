# バックログ
  - https://846846846.atlassian.net/jira/software/projects/TEC/boards/2/backlog

# サイト
  - https://d3g1t7tx4q2vwo.cloudfront.net/

# スキルセット
  |カテゴリ|名称|説明|備考|
  |--|--|--|--|
  |言語|HTML/CSS|コンテンツ構造と見た目を定義する||
  |言語|TypeScript|型宣言可能なJavaScriptのスーパーセット||
  |フロントエンド|Next.js|Reactフレームワーク||
  |バックエンド|Node.js|JavaScriptのサーバーサイドランタイム環境||
  |インフラ|AWS|Amazonが運営するクラウドサービスプラットフォーム||
  |設計|Figma|WebデザインやUI/UXデザインに特化したクラウドベースのデザインツール||
  |管理|Git/GitHub|変更履歴を記録・追跡するための分散型バージョン管理システム||
  |ツール|Docker|コンテナを利用した仮想化ツール||
  |ツール|Serverless Framework|サーバレスアプリ特化のIaCツール||

# 起動手順
## インストールが必要なソフトウェア
  - node.js
  - docker
  - aws cli
  - python

## フロントエンド
  - install
    1. cd app/front/
    2. npm i

  - localhost
    1. cd app/front/
    2. npm run local

  - deploy2AWS
    - one time only
      1. cd tool/CloudFormation/
      2. aws cloudformation create-stack --stack-name {ProjectName} --template-body file://permanent.yaml
      3. AWS Console からスタックの状況を確認する。

    - every time
      1. cd app/front/
      2. npm run deploy
      3. aws s3 sync out/ s3://{S3のバケット名}

## バックエンド
  - install
    1. cd app/back/
    2. npm i

  - localhost
    1. cd app/back/
    2. npm run local

  - deploy2AWS
    1. cd app/back/
    2. npm run dev

## db
  - localhost
    1. cd app/back/
    2. npm run ddb:ct
    3. cd tool/
    4. python d.py s3 pbc

  - deploy2AWS
    - 不要

# 忘備録
## チケット化したいアイテム
  - 画像ファイル格納用S3バケットの定期的クリーニング
  - DynamoDBとS3バケットの永続化(デプロイ毎に削除しない)
  - 固定ドメインを得る。

## 参考
  - Amazon S3 から HTTP 307 Temporary Redirect レスポンスが返されるのはなぜですか?
    - https://repost.aws/ja/knowledge-center/s3-http-307-response

  - クライアントからS3に署名付きURLでアップロードする
    - https://r-tech14.com/pre-signed-url-upload/

## git
  - git switch -c develop
  - git push -u origin develop
  - git branch -u origin/develop
  - git branch -vv

  - git add .
  - git commit -m "ECSITE-3:顧客として、商品の詳細情報を見たい(中間コミット)-2"
  - git push

## Jira
  - 子課題テンプレート
    - デザイン
    - 設計
    - 実装
    - デプロイ

## 一時メモ
  ap-northeast-1

  aws --endpoint-url=http://localhost:4566 s3api put-bucket-cors --bucket goods --cors-configuration file://cors-config.xml
  aws s3 cp s3://goods/temp/ ./down.jpeg  --endpoint-url=http://localhost:4566 


awsexamplebucketname.s3.amazonaws.com
awsexamplebucket.s3.ap-northeast-1.amazonaws.com 

tech10-front-dev-nextjs-15l0zggnq3h7n.s3.amazonaws.com
tech10-front-dev-nextjs-15l0zggnq3h7n.s3.ap-northeast-1.amazonaws.com


tech10-back-dev-ap-northeast-1-image-1694828604730
tech10-back-dev-ap-northeast-1-image-1694828604730

CORS
Access 権限

arn:aws:s3:::tech10-back-dev-ap-northeast-1-image-1695033895143
arn:aws:s3:::tech10-back-dev-ap-northeast-1-image-1695033895143

1b4d1727-bc59-4aa3-8c8c-2e826e35d2a0.png
1b4d1727-bc59-4aa3-8c8c-2e826e35d2a0.jpeg

20230920T103452518_Healslime.jpeg
20230920T103548171_Healslime.png