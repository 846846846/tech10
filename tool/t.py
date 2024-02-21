# debug用スクリプト
import os
import sys
import subprocess
import requests
import json
import random
import string
import re
import boto3
from moto import mock_cognitoidp

# DynamoDB.
def ddb(arg1, arg2):

  # variable.
  table_name = 'ecsite-dev'

  # cmd parts.
  BSE = "aws dynamodb "

  LTB = "list-tables "
  CTB = "create-table "
  UTB = "update-table "
  DSB = "describe-table "
  DTB = "delete-table "
  BWI = "batch-write-item "

  QRY = "query "

  CIJ = "--cli-input-json file://ddb-schema/"
  RIS = "--request-items file://ddb-schema/"
  EPU = " --endpoint-url http://localhost:8000"
  TNA = " --table-name "
  DMY = ""

  # alias to cmd.
  a2c = {
    # arg1.
    "lt": BSE + LTB,
    "st": BSE + DSB + TNA + table_name,
    "dt": BSE + DTB + TNA + table_name,

    # arg2.
    "lo": EPU,

    # n/a.
    "": DMY,
  }
  cmd = a2c[arg1] + a2c[arg2]

  # exec command.
  print(cmd)
  subprocess.run(cmd)

# S3.
def s3(arg1, arg2):

  # cmd parts.
  BSE = "aws s3api "
 
  ## bucket.
  CB = "create-bucket "
  LB = "list-buckets "
  DB = "delete-bucket "

  ## bucket(cors).
  GBC = "get-bucket-cors "
  PBC = "put-bucket-cors "

  ## object(=file).
  LO = "list-objects "
  GO = "get-object "
  DO = "delete-object "
  RM = "rm "

  ## variable.
  BUKET = "--bucket images "
  KEY = "--key temp/90e1a7ae-c98f-4945-85d5-cca89b32ab27.jpeg "

  COCON = "--cors-configuration file://seed/s3/cors.json "

  ENDP = "--endpoint-url=http://localhost:4566 "
  PROF = "--profile localstack "
  REG = "--region ap-northeast-1 --create-bucket-configuration LocationConstraint=ap-northeast-1 "

  DMY = ""

  # alias to cmd.
  a2c = {
    # arg1.
    ## bucket.
    "cb": BSE + CB + BUKET + ENDP + PROF + REG,
    "lb": BSE + LB + ENDP + PROF,
    "db": BSE + DB + BUKET + ENDP,

    ## bucket(cors).
    "gbc": BSE + GBC + BUKET + ENDP,
    "pbc": BSE + PBC + BUKET + COCON + ENDP,

    ## object(=file).
    "lo": BSE + LO + BUKET + ENDP,
    "dall": "aws s3 rm s3://images --recursive " + ENDP,
    "do": BSE + DO + BUKET + KEY + ENDP,

    # n/a.
    "": DMY,
  }
  cmd = a2c[arg1] + a2c[arg2]

  # exec command.
  print(cmd)
  subprocess.run(cmd)

# cloudformation
def cfn(arg1, arg2):

  # cmd parts.
  BSE = "aws cloudformation "

  ## command.
  VT = "validate-template "
  CS = "create-stack --stack-name "
  US = "update-stack --stack-name "
  DES = "describe-stacks --stack-name "
  DS = "delete-stack --stack-name "
  DMY = ""

  ## variable.
  sn = ""
  yml = ""
  if arg1 == "core":
    sn = "tech10-front "
    yml = "--template-body file://../app/infra/core.cfn.yaml"
  elif arg1 == "front":
    sn = "tech10-core "
    yml = "--template-body file://../app/infra/front.cfn.yaml"
  elif arg1 == "back":
    sn = "tech10-back "
    yml = "--template-body file://../app/infra/back.sls.yaml"

  # alias to cmd.
  a2c = {
    # arg2.
    "vt": BSE + VT + yml,
    "cs": BSE + CS + sn + yml,
    "us": BSE + US + sn + yml,
    "des": BSE + DES + sn,
    "ds": BSE + DS + sn,

    # arg2.

    # n/a.
    "": DMY,
  }
  cmd = a2c[arg1] + a2c[arg2]

  print(cmd)
  # subprocess.run(cmd)

# moto server.
def moto(arg1, arg2):
  moto_server_url = "http://localhost:5000"

  if arg1 == "cup":
    @mock_cognitoidp
    def create_user_pool():

      # Cognito Identity Provider サービスクライアントの作成
      client = boto3.client('cognito-idp', region_name='ap-northeast-1', endpoint_url=moto_server_url)
      
      # ユーザープールの作成
      user_pool = client.create_user_pool(
          PoolName='MyUserPool',
          MfaConfiguration='OFF',
          Policies={
            'PasswordPolicy': {
              'MinimumLength': 8,
              'RequireUppercase': True,
              'RequireLowercase': True,
              'RequireNumbers': True,
              'RequireSymbols': False
            }
          },
          Schema=[
              {
                'Name': 'email',
                'Required': True,
                'Mutable': True,
                'AttributeDataType': 'String',
              },
              {
                'Name': 'role',
                'Mutable': False,
                'Required': False,
                'AttributeDataType': 'String',
                'StringAttributeConstraints': {
                    'MaxLength': '30',
                    'MinLength': '0'
                }
              },
          ],
          # AliasAttributes=['email'],
          VerificationMessageTemplate = {
            'DefaultEmailOption': 'CONFIRM_WITH_CODE'
          }
      )
      user_pool_id = user_pool['UserPool']['Id']
      print(user_pool_id)
      
      # ユーザープールクライアントの作成
      user_pool_client = client.create_user_pool_client(
          UserPoolId=user_pool_id,
          ClientName='MyTestClient',
          GenerateSecret=True
      )
      client_id = user_pool_client['UserPoolClient']['ClientId']
      print(client_id)

      # クライアントIDを書き込む.
      with open("../app/back/env/local/clientId", 'w') as file:
        file.write(client_id)

    create_user_pool()

  elif arg1 == "sup":
    @mock_cognitoidp
    def show_user_pool():
      # Cognito Identity Provider サービスクライアントの作成
      client = boto3.client('cognito-idp', region_name='ap-northeast-1', endpoint_url=moto_server_url)

      # ユーザープールの一覧を取得
      pools_response  = client.list_user_pools(MaxResults=10)
      print(pools_response)

      # ユーザープールごとにクライアントのリストを取得します。
      for pool in pools_response['UserPools']:
        user_pool_id = pool['Id']
        print(f"User Pool ID: {user_pool_id}")
        
        # ユーザープールクライアントの一覧を取得します。
        clients_response = client.list_user_pool_clients(UserPoolId=user_pool_id, MaxResults=60)
        print(f"User Pool Clients for {user_pool_id}:")
        for client_data in clients_response['UserPoolClients']:
          print(client_data)

    show_user_pool()

  elif arg1 == "dup":
    @mock_cognitoidp
    def delete_user_pool():
      # Cognito Identity Provider サービスクライアントの作成
      client = boto3.client('cognito-idp', region_name='ap-northeast-1', endpoint_url=moto_server_url)

      # ユーザープールの一覧を取得
      pools_response  = client.list_user_pools(MaxResults=10)
      for pool in pools_response['UserPools']:
          user_pool_id = pool['Id']
          print(f"User Pool ID: {user_pool_id}")
          
          # ユーザープールを削除
          client.delete_user_pool(UserPoolId=user_pool_id)

    delete_user_pool()

  elif arg1 == "lu":
    @mock_cognitoidp
    def list_users():
      # Cognito Identity Provider サービスクライアントの作成
      client = boto3.client('cognito-idp', region_name='ap-northeast-1', endpoint_url=moto_server_url)

      # ユーザープールの一覧を取得
      pools_response  = client.list_user_pools(MaxResults=10)
      for pool in pools_response['UserPools']:
          user_pool_id = pool['Id']
          print(f"User Pool ID: {user_pool_id}")
          
          # ユーザー一覧を取得
          lu_response = client.list_users(UserPoolId=user_pool_id)

          # ユーザー一覧を表示
          print(lu_response)
          # for user in lu_response['Users']:
          #     print(f"Username: {user['Username']} - User Status: {user['UserStatus']}")

    list_users()

# http req.
def req(arg1, arg2):

  domain = "http://localhost:3001/local/api/v1"
  # domain = "https://r2a4d8x5za.execute-api.ap-northeast-1.amazonaws.com/dev/api/v1"

  def generate_dummy_integer(max_value=100):
    return random.randint(1, max_value)

  def generate_random_string(length):
    letters_and_digits = string.ascii_letters + string.digits
    result_str = ''.join(random.choice(letters_and_digits) for _ in range(length))
    return result_str

  def getBearer():
    url = domain + '/public' + '/users/signin'
    print('S: signin => ' + url)
    payload = {
      'name': 'Owner1',
      'password': 'Bf12Asf123', 
    }
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, headers=headers, json=payload)
    bearer = json.loads(response.content)["IdToken"]
    print('E: signin => ' + str(response.status_code))
    return bearer

  response = ""
  if arg1 == "":
    url = domain + '/public' + '/health'
    print(url)
    response = requests.get(url)

  elif arg1 == "upload":
    url = domain + '/private' + '/presigned-url/upload'
    print(url)
    headers = {'Authorization': 'Bearer ' + getBearer()}
    params = {
      "name": "xxx.jpeg",
      "type": "image/jpeg"
    }
    response = requests.get(url, params=params, headers=headers)

  elif arg1 == "download":
    url = domain + '/private' + '/presigned-url/download'
    print(url)
    headers = {'Authorization': 'Bearer ' + getBearer()}
    params = {
      "name": "satou/20240106T091825519_Healslime.png",
    }
    response = requests.get(url, params=params, headers=headers)

  elif arg1 == "signup":
    url = domain + '/public' + '/users/signup'
    print(url)
    payload = {
      'name': 'Owner1', 
      'email': 'ayas88888+Owner1@gmail.com', 
      'password': 'Bf12Asf123',
      'role': {'seller': True, 'buyer': False},
    }
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, headers=headers, json=payload)
    print(response.text)

  elif arg1 == "confirmSignUp":
    url = domain + '/public' + '/users/confirmSignUp'
    print(url)
    payload = {
      'name': 'Owner1', 
      'confirmationCode': '809654', 
    }
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, headers=headers, json=payload)

  elif arg1 == "signin":
    url = domain + '/public' + '/users/signin'
    print(url)
    payload = {
      'name': 'Owner1',
      'password': 'Yash88888', 
    }
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, headers=headers, json=payload)

  elif arg1 == "get":
    url = domain + '/private' + '/products/' + arg2
    print(url)
    headers = {'Authorization': 'Bearer ' + getBearer()}
    response = requests.get(url, headers=headers)

  elif arg1 == "post":
    dummyFileName = 'Healslime.png'
    dummyFileType = 'image/png'

    for _ in range(int(arg2)):

      with open(dummyFileName, 'rb') as file:
        # 1. PresignedURLを取得.
        endpoint = '/private/presigned-url/upload'
        headers = {'Authorization': 'Bearer ' + getBearer()}
        params = {
          "name": dummyFileName,
          'type': dummyFileType
        }
        print('S: get presignedUrl => ' + domain + endpoint)
        preRes = requests.get(domain + endpoint, params=params, headers=headers)
        print('E: get presignedUrl => ' + str(preRes.status_code))

        # 2. PresignedURLに画像データをアップロード.
        endpoint = json.loads(preRes.text)["url"]
        print('S: put image => ' + endpoint)
        res = requests.put(endpoint, data=file, headers={'Content-Type': 'image/png'})
        print('E: put image => ' + str(res.status_code))
        # print("URL:", res.request.url)
        # print("Method:", res.request.method)
        # print("Headers:", res.request.headers)
        # print("Body:", res.request.body)
        imageName = re.search(r"/([^/]+)\?", endpoint).group(1)

        # 3. アップロードした画像ファイル名を含めて商品情報をPOST.
        endpoint = '/private/products/'
        owner = 'Owner1'  # 固定
        payload = {
          'name': generate_random_string(10),
          'owner': owner,
          'explanation': generate_random_string(100),
          'price': str(generate_dummy_integer(10000)),
          'image':  [owner + '/' + imageName],
          'category': generate_random_string(30),
        }
        headers['Content-Type'] = 'application/json'
        print('S: post products data => ' + domain + endpoint)
        response = requests.post(domain + endpoint, headers=headers, json=payload)
        print('E: post products data => ' + str(response.status_code))

  elif arg1 == "put":
    url = domain + '/private' + '/products/' + arg2
    owner = 'Owner1'  # 固定
    payload = {
      'name': 'テスト', 
      'owner': owner,
      'explanation': 'テスト', 
      'price': 9999, 
      'image':  [owner + '/' + generate_random_string(30), owner + '/' + generate_random_string(30)], 
      'category': 'test', 
    }
    headers = {'Authorization': 'Bearer ' + getBearer(), 'Content-Type': 'application/json'}
    print(url)
    response = requests.put(url, headers=headers, json=payload)

  elif arg1 == "delete":
    url = domain + '/private' + '/products/' + arg2
    headers = {'Authorization': 'Bearer ' + getBearer()}
    response = requests.delete(url, headers=headers)

  elif arg1 == "user":
    userLists = [
      {
        'name': 'Owner1', 
        'email': 'ayas88888+Owner1@gmail.com', 
        'password': 'Bf12Asf123',
        'role': 'Owner',
      },
      {
        'name': 'Customer1', 
        'email': 'ayas88888+Customer1@gmail.com', 
        'password': 'Bf12Asf123',
        'role': 'Customer',
      },
    ]

    for user in userLists:
      url = domain + '/public' + '/users/signup'
      print(url)
      payload = {
        'name': user['name'], 
        'email': user['email'], 
        'password': user['password'],
        'role': user['role'],
      }
      headers = {'Content-Type': 'application/json'}
      response = requests.post(url, headers=headers, json=payload)
      print(response.status_code)
      print(response.text)

      url = domain + '/public' + '/users/confirmSignUp'
      print(url)
      payload = {
        'name': user['name'], 
        'confirmationCode': user['password'],
      }
      headers = {'Content-Type': 'application/json'}
      response = requests.post(url, headers=headers, json=payload)
      print(response.status_code)
      print(response.text)

  elif arg1 == "localstack":
    response = requests.get('http://localhost:4566/health')

  # disp res.
  print(response.status_code)
  print(response.text)

# seed.
def seed(arg1, arg2):
  # subprocess.run("aws dynamodb create-table --cli-input-yaml file://seed/dynamodb/table.yml --endpoint-url http://localhost:8000")
  s3("cb", "")
  s3("pbc", "")
  moto("cup", "")

# run.
def run():
  try:
    # list of funcs.
    funcs = {
      "ddb": ddb,
      "req": req,
      "s3": s3,
      "cfn": cfn,
      "moto": moto,
      "seed": seed,
    }

    # take out args.
    func = sys.argv[1] if len(sys.argv) >= 2 else ""
    arg1 = sys.argv[2] if len(sys.argv) >= 3 else ""
    arg2 = sys.argv[3] if len(sys.argv) >= 4 else ""

    # run cmd.
    funcs[func](arg1, arg2)

  except Exception as e:
    print(e)

run()