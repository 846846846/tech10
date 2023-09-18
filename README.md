# バックログ
  - https://846846846.atlassian.net/jira/software/projects/TEC/boards/2/backlog

# 技術
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

# 手順
## soft
  - node.js
  - docker
  - aws cli
  - python

## front
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

## back
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
    2. npm run ddb:s

  - deploy2AWS
    - 不要

# 忘備録
## 別チケット化候補
  - バリテーション
    - 画像ファイル保存期間の注意喚起
  - jpeg以外のフォーマットに対応する
    - 
  - 開発者として、保存されなった商品に関してはS3の画像ファイルを定期的に削除したい。なぜなら、容量の削減に繋がるからだ。
  - バックエンド側のdynamoDBとS3を毎回消さない

## 参考
  - Amazon S3 から HTTP 307 Temporary Redirect レスポンスが返されるのはなぜですか?
    - https://repost.aws/ja/knowledge-center/s3-http-307-response

## git
  - git switch -c develop
  - git push -u origin develop
  - git branch -u origin/develop
  - git branch -vv

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