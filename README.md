# 目標
  - 

# 基準
  - 

# 工程
  |Step|状況|予測|実態|
  |--|--|--|--|
  |1.決める|NEW|0p|0p|
  |2.作る|NEW|0p|0p|
  |3.教える|NEW|0p|0p|

# 技術
  |カテゴリ|名称|説明|備考|
  |--|--|--|--|
  |言語|HTML/CSS|コンテンツ構造と見た目を定義する||
  |言語|TypeScript|型宣言可能なJavaScriptのスーパーセット||
  |フレームワーク|Next.js|Reactフレームワーク||
  |フレームワーク|Node.js|JavaScriptのサーバーサイドランタイム環境||
  |設計|Figma|WebデザインやUI/UXデザインに特化したクラウドベースのデザインツール||
  |インフラ|AWS|Amazonが運営するクラウドサービスプラットフォーム||
  |インフラ|Serverless Framework|サーバレスアプリ特化のIaCツール||
  |管理|Git/GitHub|変更履歴を記録・追跡するための分散型バージョン管理システム||

# 手順
## front
  - install
    1. cd app/front/
    2. npm i

  - localhost
    1. cd app/front/
    2. npm run local

  - deploy2AWS
    1. cd tool/CloudFormation/
    2. aws cloudformation create-stack --stack-name tech09 --template-body file://permanent.yaml
    3. AWS Console からスタックの状況を確認する。
    4. cd app/front/
    5. npm run deploy
    6. aws s3 sync out/ s3://{S3のバケット名}

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

# メモ
## git
  - git switch -c develop
  - git push origin develop

## aws cli
  - aws cloudformation validate-template --template-body file://permanent.yaml
  - aws cloudformation create-stack --stack-name tech10 --template-body file://permanent.yaml
  - aws cloudformation update-stack --stack-name tech10 --template-body file://permanent.yaml
  - aws cloudformation describe-stacks --stack-name tech10
  - aws cloudformation delete-stack --stack-name tech10

  - aws s3 sync out/ s3://tech09-s3bucketforcloudfront-ec4rmmi7se4n
  - aws s3 ls s3://tech09-s3bucketforcloudfront-ec4rmmi7se4n
  - aws s3 rm s3://tech09-s3bucketforcloudfront-ec4rmmi7se4n

# 参考
  - 
