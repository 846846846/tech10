# バックログ
  - https://846846846.atlassian.net/jira/software/projects/TEC/boards/2/backlog

# サイト
  - https://d3g1t7tx4q2vwo.cloudfront.net/
  - http://localhost:3000/

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
  - NoSQL Workbench
    - https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/workbench.settingup.html

## 共通
  - docker network create tech10_network

## フロントエンド
  - ローカル
    - インストール
      1. cd app/front/
      2. npm i

    - 起動
      1. cd app/front/
      2. npm run local

  - AWS
    - 初回のみ(コンテンツ格納用s3やCloudFront(CDN)のセットアップ)
      1. cd app/front/
      2. aws cloudformation create-stack --stack-name {ProjectName} --template-body file://cf.yaml
      3. AWS Console からスタックの状況を確認する。
      4. コンテンツ格納用s3のバケット名を以下に転記する。
        - app/front/package.json > config > s3buket

    - 毎回
      1. cd app/front/
      2. npm i
      3. npm run deploy

## バックエンド
  - ローカル
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

  - AWS
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
  - 画像ファイル格納用S3バケットを定期的にクリーニングする。
  - dockerのCPU使用率が100%から回復しない問題の対策。
  - サブの商品画像の登録参照に対応する。
  - roleによるバックエンドAPIの機能利用制限
  - AWS Well-Architected ツールを利用してレビューする。

## 試験用アカウント
  - 所有者
    - Owner1
    - ayas88888+Owner1@gmail.com
    - Bf12Asf123

  - 顧客
    - Customer1
    - ayas88888+Customer1@gmail.com
    - Bf12Asf123

## git
  - リモートブランチの新規作成
    - git switch -c ECSITE-38
    - git push -u origin ECSITE-38

  - リモートブランチへのプッシュ
    - git status
    - git add .
    - git commit -m "next buildエラー対応"
    - git push origin ECSITE-38

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

### DynamoDB
  - 用語
    - プライマリキー (Primary Key)
      - DynamoDBテーブルの各アイテムを一意に識別するキー。
      - テーブルのすべてのアイテムは、プライマリキーによって一意でなければなりません。
      - プライマリキーは、データの取得、更新、削除を行う際に使用されます。
      - また、データの分散と効率的なアクセスにも重要な役割を果たします。

    - パーティションキー (Partition Key)
      - プライマリキーの一種で、テーブル内の各アイテムが配置されるパーティションを決定するために使用されるキー。
      - パーティションキーは、テーブル内でのデータの分散に影響を与えます。
      - 効率的なデータの分散を促進し、データベースのスケーラビリティとパフォーマンスを向上させます。

    - ソートキー (Sort Key)
      - プライマリキーのオプションの第二の要素で、パーティションキーと組み合わせて使用されることがあります。
      - ソートキーによって、同じパーティションキーを持つアイテムの並び順が決定されます。
      - ソートキーを使用することで、一つのパーティション内のアイテムを特定の順序でクエリしたり、範囲クエリを実行することができます。

    - 複合プライマリキー (Composite Primary Key)
      - パーティションキーとソートキーの組み合わせで構成されるプライマリキー。
      - これにより、より細かいアクセス制御とクエリの柔軟性が実現されます。
      - 複合プライマリキーを使用することで、同じパーティションキーを持つアイテム間でのソートや、特定の条件を満たすアイテムの効率的な取得が可能になります。

  - 読み込み容量単位（RCU）
    - RCUは、毎秒1回の強い整合性のある読み込み操作、または毎秒2回の結果整合性のある読み込み操作を表します。これは、最大4KBのデータを読み込む能力を持っています。
    - 強い整合性の読み込み: 最新の書き込みを反映したデータを取得します。
    - 結果整合性の読み込み: 最新の書き込みが反映されていない可能性のあるデータを取得します（ただし、通常は遅延はごくわずかです）。
    - 使用例: 4KBを超えるデータを読み込む場合、必要なRCUは読み込みたいデータサイズに応じて増加します。例えば、8KBのデータを強い整合性で読み込む場合、2RCUが必要です。

  - 書き込み容量単位（WCU）
    - WCUは、毎秒1回の書き込み操作を表します。これは、最大1KBのデータを書き込む能力を持っています。
    - 使用例: 1KBを超えるデータを書き込む場合、必要なWCUは書き込みたいデータサイズに応じて増加します。例えば、2KBのデータを書き込む場合、2WCUが必要です。

  - プロビジョニングとオンデマンド
    - DynamoDBでは、2つのスループットモデルがあります：プロビジョニングモードとオンデマンドモード。
    - プロビジョニングモード: 事前にRCUとWCUを設定します。使用量が予測可能な場合やコストを最適化したい場合に適しています。
    - オンデマンドモード: 必要に応じて自動的にスループットが調整されます。トラフィックが予測不可能で変動が大きい場合に適しています。

  - シングルテーブルデザイン
    - アプリケーションのすべてのデータを1つのDynamoDBテーブルに格納。
    - メリット
      1. パフォーマンスとスケーラビリティ
        - すべてのデータが同じテーブルにあるため、クエリの効率が向上し、スケーラビリティが高まります。
      2. コスト削減
        - DynamoDBの料金は使用量に基づくため、データを1つのテーブルに集約することでコストを抑えることができます。
      3. データアクセスの簡素化
        - 複数のテーブルにまたがるトランザクションやクエリを避けることができます。
    - デメリット
      1. 設計の複雑さ
        - 異なる種類のデータを単一のテーブルに適切に組み込むには、複雑な設計が必要になることがあります。
      2. 柔軟性の制限
        - 将来的にデータモデルに大きな変更が必要になる場合、シングルテーブルデザインは変更が難しいことがあります。
      3. 学習曲線
        - このアプローチはDynamoDBの標準的な使用方法とは異なるため、新しい開発者にとっては学習が難しいかもしれません。

  - 型
    - スカラー型(単一の値を表す)
      - 文字列 (String, S): UTF-8エンコーディングを使用した文字列データ。
      - 数値 (Number, N): 正確な数値データ。符号付き整数、符号付き浮動小数点数、および任意精度の数値をサポート。
      - バイナリ (Binary, B): バイナリデータ。例えば、画像や暗号化データなど。
      - ブール (Boolean, BOOL): 真（true）または偽（false）。
      - Null (NULL): 値が存在しないことを示す。

    - マルチバリュー型(複数の値を持つ)
      - 文字列セット (String Set, SS): 文字列の集合。各要素は一意でなければならない。
      - 数値セット (Number Set, NS): 数値の集合。各要素は一意でなければならない。
      - バイナリセット (Binary Set, BS): バイナリデータの集合。各要素は一意でなければならない。

    - ドキュメント型(JSON形式のデータを表す複合型)
      - リスト (List, L): 値の順序付きリスト。異なるデータ型の要素を含むことができる。
      - マップ (Map, M): 文字列のキーと値のマッピング。異なるデータ型の値を持つことができる。

    - その他の型
      - 属性セット: DynamoDB は、リストとマップのネストや、他のセット型の組み合わせを含む複雑なデータ構造もサポートします。

  - 参考サイト
    - AWS公式
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
  - ポートオープン確認
    - netstat -an | findstr :{port number}

## StoryBook
  - [備忘録] Nextjsプロジェクトにstorybookを導入する場合に発生するModule not found対応
    - https://qiita.com/sinnlosses/items/51e614570180c5f12e86

## 便利サイト
  - 任意サイズのダミー画像生成
    - https://placehold.jp/
