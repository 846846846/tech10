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
## git
  - git switch -c develop
  - git push -u origin develop
  - git branch -u origin/develop
  - git branch -vv

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

  docker ps -q -f ancestor=amazon/dynamodb-local

  docker rm $(docker ps -a -q -f ancestor=amazon/dynamodb-local)

  docker inspect --format '{{.State}}' $(docker ps -a -q -f ancestor=amazon/dynamodb-local)


  aws --endpoint-url=http://localhost:4566 s3api put-bucket-cors --bucket goods --cors-configuration file://cors-config.xml


  aws s3 cp s3://goods/temp/ ./down.jpeg  --endpoint-url=http://localhost:4566 
