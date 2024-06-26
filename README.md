# 名前
ECSiteアプリ  

# 説明
ユーザー管理と簡単なCRUD機能を備えたアプリ。  
Webアプリ開発の基礎的な[スキルセット](#スキルセット)を身につけるために作成しました。  

![アプリの流れ](./spec//sub//appStruct.png "アプリの流れ")

# デモ
アプリのデモサイト(AWSで稼働しています)。
  - https://hello8463.com/

  - お試し用アカウント
    - 所有者
      - Owner1
      - hello8463job+Owner1@gmail.com
      - Bf12Asf123

    - 顧客
      - Customer1
      - hello8463job+Customer1@gmail.com
      - Bf12Asf123

# スキルセット
このアプリを作る中で、以下のスキルセットの基礎が身につきました。
![スキルセット](./spec//sub//skillset.png "スキルセット")
 
## フロントエンド
  |カテゴリ|名称|説明|備考|
  |--|--|--|--|
  |言語|HTML|ウェブページの構造を定義するために使用される標準マークアップ言語||
  |言語|CSS|ウェブページのフォーマットとレイアウトを指定するスタイルシート言語||
  |言語|SCSS|CSSの機能を拡張したプリプロセッサで、変数、ネスト、ミックスインなどの機能を提供||
  |言語|TypeScript|型宣言可能なJavaScriptの上位互換言語||
  |フレームワーク|Next.js|サーバーサイドレンダリングや静的サイト生成をサポートするReactベースのフレームワーク||
  |フレームワーク|BootStrap|HTML、CSS、JavaScriptを用いたレスポンシブなウェブデザインを簡単に実装できるフロントエンドフレームワーク||
  |ライブラリ|axios|ブラウザとNode.jsの両方で動作するPromiseベースのHTTPクライアント||
  |ライブラリ|react-hook-form|効率的なフォーム検証と状態管理を提供するReact用の軽量フォームライブラリ||
  |ライブラリ|react-table|Reactでデータを扱うための軽量でフレキシブルなテーブルライブラリ||
  |ツール|StoryBook|UIコンポーネントを隔離して開発し、カタログ化するためのオープンソースの開発環境||

## バックエンド
  |カテゴリ|名称|説明|備考|
  |--|--|--|--|
  |言語|TypeScript|型宣言可能なJavaScriptのスーパーセット||
  |実行環境|Node.js|サーバーサイドでJavaScriptを実行するための非同期イベント駆動型のJavaScriptランタイム||
  |ライブラリ|express|APIの構築やウェブサービスの実装に広く使われているNode.js上で動作する軽量で柔軟なウェブアプリケーション||
  |ライブラリ|AWS SDK|Amazon Web Servicesの各種サービスをプログラム的に操作するためのソフトウェア開発キット||
  |ライブラリ|Jest|JavaScriptのテストフレームワークで、特にReactやNode.jsのプロジェクトでのユニットテストに適している||
  |Iac|Serverless Framework|AWS LambdaなどのFaaS（Function as a Service）プロバイダーを利用してサーバーレスアプリケーションを構築、デプロイするためのIacツール||

## クラウドインフラ(AWS)
  |カテゴリ|名称|説明|備考|
  |--|--|--|--|
  |コンピューティング|Lambda|サーバーを管理することなくコードを実行できる、イベント駆動型のコンピュートサービス||
  |ルーティング|API Gateway|APIを簡単に公開、維持、監視、保護するためのフルマネージドサービス||
  |データベース|DynamoDB|高速でスケーラブルなNoSQLデータベースサービスで、フレキシブルなデータモデルと信頼性の高いパフォーマンスを提供||
  |認証認可|Cognito|モバイルやウェブアプリケーションに対してユーザー認証、アクセス制御、ユーザー管理を提供するサービス||
  |ストレージ|S3|オブジェクトストレージサービスで、データを安全に保存し、どこからでもアクセス可能||
  |CDN|CloudFront|コンテンツ配信ネットワーク(CDN)サービスで、ウェブコンテンツを全世界に迅速に配信||
  |Iac|CloudFormation|インフラストラクチャをコードとして管理し、プロビジョニングと管理を自動化するサービス||
  |ツール|Console|AWSリソースをブラウザから管理するためのユーザーフレンドリーなウェブベースインターフェース||

## 開発ツール
  |カテゴリ|名称|説明|備考|
  |--|--|--|--|
  |ツール|Git|バージョン管理システムで、コードの変更履歴を効率的に管理し協業を容易にする||
  |ツール|GitHub|Gitリポジトリのホスティングを提供するプラットフォームで、コード共有やコラボレーションのための機能を備えている|
  |ツール|Docker|アプリケーションをコンテナとしてパッケージ化し、依存性を含めて一貫した環境で実行するためのプラットフォーム|
  |ツール|JIRA|プロジェクト管理とイシュートラッキングのためのツールで、チームのタスク管理と進捗追跡をサポート|
  |ツール|Python|汎用的で読みやすい構文を持ち、幅広いアプリケーションで使用される高水準プログラミング言語|
  |ツール|Markdown|簡易なマークアップ言語で、プレーンテキストで書かれた文書をHTMLに変換することができる|
  |ツール|Mermaid|テキストベースの図記述言語で、コードのように記述してフローチャートやダイアグラムを生成|
  |ツール|OpenAPI|RESTful APIを記述するための仕様で、APIの構造を明確に定義し、ドキュメント化やクライアント生成を自動化|
  |ツール|Draw.io|ブラウザベースで利用できるダイアグラム作成ツールで、多様な図を簡単に作成・共有可能|
  |ツール|NoSQL WorkBench|NoSQLデータベースを視覚的にモデリングし、クエリを開発・テストするためのツール|
  |ツール|localstack|AWSのクラウドリソースをローカルで模倣するためのフレームワーク、開発やテストに利用|
  |ツール|moto|Pythonベースのライブラリで、AWSサービスのモックを提供し、テスト時にAWS呼び出しをエミュレート|
  |ツール|AWS CLI|コマンドラインからAmazon Web Servicesを操作するためのツール、スクリプトの自動化や管理タスクに使用|
  |ツール|ESLint|JavaScriptおよびTypeScriptのコードのための静的解析ツール。コードの問題を識別し、一貫したコーディングスタイルを強制|
  |ツール|Prettier|コードフォーマッター。ソースコードの書式を一貫したスタイルに整形するために使用|

# こだわりポイント
個人だけでなくチームでも利用できる構成を目指しました。
  1. 並行開発ができる
      - フロントエンドとバックエンドを完全に分割。
      - StoryBookを導入し、コンポーネント単位で開発できるように。
      - OpenAPIを導入し、フロントとバックエンドの担当者間で意思疎通できるように。

  2. 再利用性を高める
      - フロントエンドのコンポーネントを可能な限り分割。
      - CRUDに沿う形でバックエンドのWebAPI仕様を定義。
      - クラウドインフラをIaCを利用し構築。

  3. 自動で品質を保つ
      - GitHub Actionsを利用しCI/CDを実施。
      - Jestを利用したUTを作成し、かつCI/CDに組み込み。
      - ESLintとPrettierを利用してコード品質を一定に保つ。

# 前提条件
アプリを開発するために必要だった最低限のソフトウェアです。

## Windows
Windows10で開発しました。それ以外のOSでは動作未確認です。

## node.js
JavaScriptのサーバーサイドランタイム環境です。
v20で開発しました。
  - https://nodejs.org/en/download

## docker desktop
コンテナを利用した仮想化ツールです。
ローカルPCでの開発に利用しました。
  - https://www.docker.com/ja-jp/products/docker-desktop/

## aws cli
AWSのリソースを操作するためのコマンドラインプログラムです。
 - https://aws.amazon.com/jp/cli/

## python
環境構築及び動作確認用のスクリプトを作成するときにpythonを利用しました。
  - https://www.python.org/downloads/

## NoSQL Workbench
AWS DynamoDBのテーブル設計で利用しました。
  - https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/workbench.settingup.html

# インストール
アプリのインストール手順です。  
ローカルPCで動かす場合とAWSにホスティングする場合の2ケースあります。

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
    3. python3 t.py seed

  - アプリ起動
    1. cd app/back/
    2. npm run local

  - お試し用アカウントの登録
    1. cd tool
    2. python3 t.py req userReg

## AWS
AWSアカウントの作成と認証情報の設定が事前に必要でした。
  1. AWSアカウントの作成
      - https://aws.amazon.com/jp/register-flow/
  2. AWS認証情報の設定
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
  2. npm i
  3. npm run deploy

# ライセンス
このプロジェクトはMITライセンスのもとで公開されています。  
詳細については[LICENSE](./LICENSE)ファイルを参照してください。
