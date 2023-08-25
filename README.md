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

顧客（購入者）の視点:

商品の検索
顧客として、商品名で商品を検索したい。なぜなら、欲しい商品を迅速に見つけたいから。

商品の詳細表示
顧客として、商品の詳細情報を見たい。なぜなら、購入の判断をするための情報が欲しいから。

カートに商品を追加
顧客として、商品をカートに追加したい。なぜなら、複数の商品を一度に購入したいから。

購入手続き
顧客として、手軽に購入手続きを進めたい。なぜなら、煩わしさなく購入を完了したいから。

商品のレビュー・評価
顧客として、商品のレビューや評価を読み書きしたい。なぜなら、自分の経験を共有したり、他の人の意見を参考にしたいから。

販売者の視点:

商品の登録
販売者として、新しい商品をサイトに掲載したい。なぜなら、顧客に商品を購入してもらいたいから。

注文の管理
販売者として、顧客の注文を管理したい。なぜなら、迅速に商品を配送したいから。

在庫の管理
販売者として、商品の在庫状況を更新したい。なぜなら、顧客に正確な商品の在庫情報を知らせたいから。

管理者の視点:

ユーザーの管理
管理者として、ユーザーアカウントを管理したい。なぜなら、サイトのセキュリティと整合性を保つため。

セールスレポートの閲覧
管理者として、売上レポートを閲覧したい。なぜなら、データに基づいたビジネス判断を下したいから。

プロモーションや割引の設定
管理者として、プロモーションや割引を設定したい。なぜなら、売上を促進し、忠実な顧客に報いたいから。