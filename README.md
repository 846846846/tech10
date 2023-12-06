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
  - git commit -m "ECSITE-31:開発者として、開発効率を高めるために、リファクタリングをしたい(中間コミット3)"
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

## node.js
  - npm list -g

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

http://s3.localhost.localstack.cloud:4566/images/dummy/20231010T185640259_Healslime.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=dummy%2F20231010%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20231010T095640Z&X-Amz-Expires=30&X-Amz-Signature=830ac9556f4480d36d7ba8e289060228ad3b90f56a03bdb1e30fa11f7143ed10&X-Amz-SignedHeaders=host&x-id=PutObject

"Key": "dummy/20231010T185640259_Healslime.png",

"http://s3.localhost.localstack.cloud:4566/images/dummy/20231010T185640259_Healslime.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=dummy%2F20231010%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20231010T095713Z&X-Amz-Expires=30&X-Amz-Signature=3e32680d8fae82223617901bf61ffc8fb53b201f8d04aa2e6f80f37039cdfc82&X-Amz-SignedHeaders=host&x-id=GetObject"

https://s3.ap-northeast-1.amazonaws.com/tech10-back-dev-ap-northeast-1-image-846846846/dummy/20231014T085347152_Healslime.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAR23PMMLRGTCTXEEA%2F20231013%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20231013T235353Z&X-Amz-Expires=600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECAaDmFwLW5vcnRoZWFzdC0xIkcwRQIhALsbZBDzNTyIHB5pLSYBVbBoWjsQmOnEBZiyRHALl5BlAiBEYEjscNqplngvI2BkHZBy0914IC2m%2B18a3%2Ffqot29pyr%2FAgg5EAAaDDEyNjM5ODI1OTkzOCIMvAdoDrKCGJj5WFu4KtwCAQ1tws%2FGIxPZdufnNjWB38DYJYTqJriSPcX%2BXAca2fS2FduRoMFtqzmwP0ELs6lhVrBPNUNSKtmXwda4PXpMaGZZ0picH17t3Uakmal4sPpdXVTKQX2g8%2FjjucuAW3k78mw7qzIehY%2B77MJHyENYDw4NW1RCctVdXgRAU%2FG1hTioRy1ApwozWCyruaw8e3s7dZW4Lf9YhLKdRux5NMwuaF%2Fp5zI5aameZZhJoTCa6GHFFDzv6RtimPS2WvB2JCOIgweQfwBs%2BGebT6Bn9IgaPnzMmptzC0O5drysyAZ5%2F7DpRdlPda%2BPBux0JjRkIjCofltBCwaXCGp%2F%2B4sfLeGTXyD5WsQVSeFwUPgPpC70gwOuAvcGjYZ0fR%2FfeLJr2%2FM8V8ZBTwtfR%2BbSWP%2BEmjDFxdvgzHZeL%2FFLpJMBFxtnQi0OzQr2VjOqosA066M0gIbIUXwt8ETJ8VuHQYPPMIqxp6kGOp4BmdQXq19%2BznGZg0bS8KhcEw9IP0ktBp2plN6EZq5hZh9rXlNIoVJVAM2LCLsUHnlN8ggKuK3AphfGTqp0dQigu1C1YO38L3JlEzfjmVWZ%2F5uZzGJJDa6voCFsy%2BkQ3dV2IAn3%2FX5Hkwo3qs29UXs9N0ZIxcHITpChB4bquj9q%2FdireAQaSWOl6QPO027BAil9wNAMTFtfoO5j4mLhEA0%3D&X-Amz-Signature=ab59be2fc4fcab3c616908a57525b3dd46df19f9fdd14e612dc443ec3d8203de&X-Amz-SignedHeaders=host&x-id=GetObject

npm install --save-dev typescript @types/react @types/node

npm install --save-dev @types/jsonwebtoken @types/jwks-rsa

npm install @aws-amplify/ui-react

npm uninstall jwks-rsa


npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken

buyer1
ayas88888+buyer1@gmail.com
Bf12Asf123

buyer2
ayas88888+buyer2@gmail.com
Bf12Asf123



aws cloudformation create-stack --stack-name cognitoTest --template-body file://cf.yaml
aws cloudformation update-stack --stack-name cognitoTest --template-body file://cf.yaml
aws cloudformation delete-stack --stack-name cognitoTest

aws cloudformation validate-template --template-body file://core.yaml
aws cloudformation validate-template --template-body file://cf.yaml

  - Next.jsをTypeScirptでセットアップする手順
    1. npx create-next-app testApp
    2. cd testApp
    3. npm install --save-dev typescript @types/react @types/node
    4. touch tsconfig.json
    5. npm run dev
    6. .js ファイルを .tsx に変更


    C:\Users\ss7wp\AppData\Local\Programs\Python\Python312\python.exe

aws cloudformation create-stack --stack-name test --template-body file://core.cfn.yaml --parameters ParameterKey=EnvironmentName,ParameterValue=dev

aws cloudformation update-stack --stack-name test --template-body file://core.cfn.yaml --parameters ParameterKey=EnvironmentName,ParameterValue=dev

aws cloudformation delete-stack --stack-name test


/api/v1/users/signup

https://xxr3q09l5d.execute-api.ap-northeast-1.amazonaws.com/dev/api/v1/users/


docker exec -it cc47a4857f03 env

エンティティ毎にAPIGatewayとLamdbaを分ける。

public
private