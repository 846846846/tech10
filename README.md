# 名前
ECSiteアプリ

# 説明
以下のスキルセットをざっくり習得するために作成しました。
![スキルセット](./spec//sub//skillset.png "スキルセット")
  |カテゴリ|名称|説明|備考|
  |--|--|--|--|
  |言語|HTML/CSS|Webコンテンツの構造と見た目を定義||
  |言語|TypeScript|型宣言可能なJavaScriptのスーパーセット||
  |フロントエンド|Next.js|Reactフレームワーク||
  |バックエンド|Node.js|JavaScriptのサーバーサイドランタイム環境||
  |インフラ|AWS|Amazonが運営するクラウドサービスプラットフォーム||
  |管理|Git/GitHub|変更履歴を記録・追跡するための分散型バージョン管理システム||
  |ツール|Docker|コンテナを利用した仮想化ツール||
  |ツール|Serverless Framework|サーバレスアプリ特化のIaCツール||

# デモ
アプリのデモサイト(AWSで稼働しています)。
  - https://d3g1t7tx4q2vwo.cloudfront.net/

  - お試し用アカウント
    - 所有者
      - Owner1
      - ayas88888+Owner1@gmail.com
      - Bf12Asf123

    - 顧客
      - Customer1
      - ayas88888+Customer1@gmail.com
      - Bf12Asf123

# 前提条件
ECSiteアプリを開発するために必要になった最低限のソフトウェアです。

## node.js
JavaScriptのサーバーサイドランタイム環境です。
v20で開発しました。
  - https://nodejs.org/en/download

## docker desktop
コンテナを利用した仮想化ツールです。
ローカルPCで開発するときに利用しました。
  - https://www.docker.com/ja-jp/products/docker-desktop/

## aws cli
AWSのリソースを操作するためのコマンドラインプログラムです。
 - https://aws.amazon.com/jp/cli/

## python
テスト用のシェルスクリプトをPythonで作成しました。そのスクリプトを動かすときに使います。
  - https://www.python.org/downloads/

## NoSQL Workbench
AWS DynamoDB のテーブル設計で利用しました。
  - https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/workbench.settingup.html

# インストール
ECSiteアプリのインストール手順です。ローカルPCで動かす場合とAWSにホスティングする場合の2ケースあります。

## ローカルPC
### フロントエンド
  - インストール
    1. cd app/front/
    2. npm i

  - 起動
    1. cd app/front/
    2. npm run local

### バックエンド
  - インストール
    1. cd app/back/
    2. npm i

  - AWSスタブ群の起動
    1. cd tool
    2. docker compose up -d
    3. python t.py seed

  - アプリ起動
    1. cd app/back/
    2. npm run local

  - お試し用アカウントの登録
    1. cd tool
    2. python t.py req userReg

## AWS
AWSへのホスティングでは、事前にAWSアカウントを作成し、かつPCにAWSの認証情報を設定しました。
  - https://aws.amazon.com/jp/register-flow/
  - https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-configure-files.html

### フロントエンド
  - 初回のみ実行(コンテンツ格納用S3バケットやCloudFront(CDN)のセットアップ)。
    1. cd app/front/
    2. npm run cfn
    3. コンテンツ格納用S3バケットの物理IDを転記.
      - 実行したスタックのステータスが"CREATE_COMPLETE"となることを確認
      - リソースタブに移動
      - 論理ID"NextJS"に該当する物理IDをコピーし、"s3://{物理ID}"の形式に加工.
      - 下記値を"s3://{物理ID}"で更新.
        - app/front/package.json > config > s3buket

  - 毎回
    1. cd app/front/
    2. npm i
    3. npm run deploy

### バックエンド
  1. cd app/back/
  2. npm run deploy

# 備忘録
## バックログ
### テンプレート
  - ユーザーストーリー
  - 受け入れ基準
  - タスク
  - 参考情報

### チケット化したいアイテム
  - 固定ドメインを割り当てる。
  - 画像ファイル格納用S3バケットの定期クリーニングバッチの作成。
  - dockerのCPU使用率が100%から回復しない問題の対策。
  - roleによるバックエンドAPIの機能利用制限

## git
  - リモートブランチの新規作成
    - git switch -c ECSITE-40
    - git push -u origin ECSITE-40

  - リモートブランチへのプッシュ
    - git status
    - git add .
    - git commit -m "ECSITE-40 ドキュメント群を整備する。"
    - git push origin ECSITE-40

## docker
  - WSLのシャットダウン
    - wsl --shutdown
    - ※再起動はDokcerDesktopをスタートさせる。

  - 仮想ストレージ領域の最適化
    - diskpart
    - select vdisk file="C:\Users\ss7wp\AppData\Local\Docker\wsl\data\ext4.vhdx"
    - attach vdisk readonly
    - compact vdisk
    - detach vdisk
    - exit

  - 参考サイト 
    - Dockerを使っていたらPC容量が枯渇したので対処した（ext4.vhdxの最適化）
      - https://qiita.com/msymacromill/items/282a2212b93380511437

## node.js
  - グローバルインストールのNPM一覧表示
    - npm list -g

  - devDependenciesにインストールするコマンド
    - npm install --save-dev {パッケージ名}
    - npm install --save-dev @storybook/addon-mdx-gfm

  - アンインストールコマンド
    - npm uninstall {パッケージ名}
    - npm uninstall @storybook/addon-mdx-gfm

  - 再インストール
    - rm -rf node_modules package-lock.json
    - npm install

  - パッケージのアップデート
    - npm install {パッケージ名}@latest
    - npm update {パッケージ名}
    - npm update @storybook/testing-library
    - npm install @storybook/addons@latest

  - アップデートが利用可能なパッケージのみを表示
    - npm outdated

  - Next.js(TypeScirpt)セットアップ手順
    1. npx create-next-app testApp
    2. cd testApp
    3. npm install --save-dev typescript @types/react @types/node
    4. touch tsconfig.json
    5. npm run dev
    6. .js ファイルを .tsx に変更

## AWS
  - localhost内のスタブ構成
    - APIGateway + Lambda
      - ServerlessFramework local
    - DynamoDB
      - DynamoDB Local(NoSQL Workbenchに同梱)
    - S3
      - localstack
    - Cognito
      - moto(localstackはPro(有償版)しかCognitoを利用できない)。
  
  - 参考サイト 
    - CloudFormationテンプレートの構造分析
      - https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/template-anatomy.html

    - Amazon S3 から HTTP 307 Temporary Redirect レスポンスが返されるのはなぜですか?
      - https://repost.aws/ja/knowledge-center/s3-http-307-response

    - クライアントからS3に署名付きURLでアップロードする
      - https://r-tech14.com/pre-signed-url-upload/

    - DynamoDB テーブルのデータモデリング
      - https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/data-modeling.html
    
    - DynamoDB をオンラインショップのデータストアとして使用する
      - https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/data-modeling-online-shop.html

  - DynamoDB の設計について考えてみる。
    - https://qiita.com/_kensh/items/2351096e6c3bf431ff6f

## BootStrap
  - 参考サイト
    - サンプル
      - https://getbootstrap.jp/docs/5.3/examples/

    - スペーシング
      - https://getbootstrap.jp/docs/5.3/utilities/spacing/

## Mermind
  - 参考サイト
    - ダイアグラムの構文
      - https://mermaid.js.org/intro/syntax-reference.html

## Windows
  - 参考サイト
    - ポートオープン確認
      - netstat -an | findstr :{port number}

## StoryBook
  - 参考サイト
    - Nextjsプロジェクトにstorybookを導入する場合に発生するModule not found対応
      - https://qiita.com/sinnlosses/items/51e614570180c5f12e86

## Jest
  - 参考サイト
    - Jest テストは Github Action では失敗しますが、ローカルでは成功します
      - https://github.com/jestjs/jest/issues/11430

## READMEの書き方
  - 参考サイト
    - https://www.makeareadme.com/
    - https://github.com/matiassingers/awesome-readme

## 便利サイト
  - 任意サイズのダミー画像生成
    - https://placehold.jp/
