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

# 参考
  - Amazon S3 から HTTP 307 Temporary Redirect レスポンスが返されるのはなぜですか?
    - https://repost.aws/ja/knowledge-center/s3-http-307-response

  - クライアントからS3に署名付きURLでアップロードする
    - https://r-tech14.com/pre-signed-url-upload/

  - Dockerを使っていたらPC容量が枯渇したので対処した（ext4.vhdxの最適化）
    - https://qiita.com/msymacromill/items/282a2212b93380511437

  - BootStrapのサンプル
    - https://getbootstrap.jp/docs/5.3/examples/
      - https://getbootstrap.jp/docs/5.3/examples/sign-in/
      - https://getbootstrap.jp/docs/5.3/examples/navbars/
      - https://getbootstrap.jp/docs/5.3/examples/features/

# 忘備録
## チケット化したいアイテム
  - 画像ファイル格納用S3バケットの定期的クリーニング
  - 固定ドメインを得る。

## git
  - リモートブランチの新規作成
    - git switch -c ECSITE-37
    - git push -u origin ECSITE-37

  - コミット＆リモートブランチへのプッシュ
    - git add .
    - git commit -m "GitHubAction対応(バックエンド)"
    - git push origin ECSITE-37

## docker
  - WSLのシャットダウン
    - wsl --shutdown
    - ※再起動はDokcerDesktopからstartで。

  - 最適化
    - diskpart
    - select vdisk file="C:\Users\ss7wp\AppData\Local\Docker\wsl\data\ext4.vhdx"
    - attach vdisk readonly
    - compact vdisk
    - detach vdisk
    - exit

## localhost
  - APIGateway + Lambda
    - sls local
  - DynamoDB
    - DynamoDB Local
  - S3
    - localstack
  - Cognito
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

## 一時メモ
  - buyer1
  - ayas88888+buyer1@gmail.com
  - Bf12Asf123

  - buyer2
  - ayas88888+buyer2@gmail.com
  - Bf12Asf123


http://localhost:5000/images/satou/20240106T090501483_Healslime.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=dummy%2F20240106%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20240106T001025Z&X-Amz-Expires=600&X-Amz-Signature=139d10a5aa3fef255340c3eab053e5b89266ef2775007ac3f4dd7720b0965676&X-Amz-SignedHeaders=host&x-id=GetObject
satou/20240106T085311445_Healslime.png

http://localhost:5000/images/satou/20240106T085311445_Healslime.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=dummy%2F20240106%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20240106T001025Z&X-Amz-Expires=600&X-Amz-Signature=139d10a5aa3fef255340c3eab053e5b89266ef2775007ac3f4dd7720b0965676&X-Amz-SignedHeaders=host&x-id=GetObject

aws --endpoint-url=http://localhost:4566 s3api get-bucket-policy --bucket images --profile localstack 

aws s3api list-buckets --endpoint-url=http://localhost:4566 --profile localstack 

aws s3api get-bucket-policy --bucket images --endpoint-url=http://localhost:4566 --profile localstack 