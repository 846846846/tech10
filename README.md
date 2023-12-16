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

## 共通
  - docker network create tech10_network

## フロントエンド
  - インストール
    1. cd app/front/
    2. npm i

  - ローカルホスト起動
    1. cd app/front/
    2. npm run local

  - AWSデプロイ
    - 初回: CloudFormationを利用して、コンテンツ格納用S3やCloudFront(CDN)をセットアップする。
      1. cd app/front/
      2. aws cloudformation create-stack --stack-name {ProjectName} --template-body file://cf.yaml
      3. AWS Console からスタックの状況を確認する。

    - 毎回: ローカルで資材をビルドして、S3に格納する。
      1. cd app/front/
      2. npm run deploy
      3. aws s3 sync out/ s3://{S3のバケット名}

## バックエンド
  - インストール
    1. cd app/back/
    2. npm i

  - ローカルホスト
    - データベース起動
      1. cd app/back/
      2. npm run ddb:ct
      3. cd tool/
      4. python d.py s3 pbc

    - アプリ起動
      1. cd app/back/
      2. npm run local

  - AWSデプロイ(ServerlessFrameworkを利用)
    1. cd app/back/
    2. npm run dev

# 忘備録
## チケット化したいアイテム
  - 画像ファイル格納用S3バケットの定期的クリーニング
  - 固定ドメインを得る。
  - セットアップをDockerで。
  - サインインなどの異常ケースが判定できていない。

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

  - git switch -c ECSITE-31

  - git add .
  - git commit -m "ECSITE-31:開発者として、開発効率を高めるために、リファクタリングをしたい(完了)"
  - git push origin ECSITE-31


## localhost
  - APIGateway + Lambda
    - sls local
  - DynamoDB
    - DynamoDB Local
  - S3
    - localstack
  - Cognito
    - 
    - localstackのCognitoはPro(有償版)しか利用できない。

## Next.js
  - TypeScirptセットアップ手順
    1. npx create-next-app testApp
    2. cd testApp
    3. npm install --save-dev typescript @types/react @types/node
    4. touch tsconfig.json
    5. npm run dev
    6. .js ファイルを .tsx に変更

## node.js
  - グローバルインストールのNPM一覧表示
    - npm list -g

  - devDependenciesにインストールするコマンド
    - npm install --save-dev {パッケージ名}

  - アンインストールコマンド
    - npm uninstall {パッケージ名}

## amplify
  - amplify status

## CloudFormation
  - テンプレートの構造分析
    - https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/template-anatomy.html

## Jira
  - 子課題テンプレート
    - デザイン
    - 設計
    - 実装
    - デプロイ

## 一時メモ
  npm install --save-dev @aws-sdk/client-cognito-identity-provider

  ap-northeast-1

  aws --endpoint-url=http://localhost:4566 s3api put-bucket-cors --bucket goods --cors-configuration file://cors-config.xml
  aws s3 cp s3://goods/temp/ ./down.jpeg  --endpoint-url=http://localhost:4566 





npm uninstall jwks-rsa


npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken

buyer1
ayas88888+buyer1@gmail.com
Bf12Asf123

buyer2
ayas88888+buyer2@gmail.com
Bf12Asf123
