# debug用スクリプト
import os
import sys
import subprocess
import requests
import json
import random
import string
import re

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
  BSE2 = "aws s3 "
 
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

  COCON = "--cors-configuration file://s3cors.json "

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

# http req.
def req(arg1, arg2):

  # domain = "http://localhost:3001/dev/api/v1"
  domain = "https://xxr3q09l5d.execute-api.ap-northeast-1.amazonaws.com/dev/api/v1"
  authorization = 'dummy'

  response = ""
  if arg1 == "":
    endpoint = '/health'
    response = requests.get(domain + endpoint)

  elif arg1 == "upload":
    endpoint = '/presigned-url/upload'
    headers = {'Authorization': authorization}
    params = {
      "name": "xxx.jpeg",
      "type": "image/jpeg"
    }
    response = requests.get(domain + endpoint, params=params, headers=headers)

  elif arg1 == "download":
    endpoint = '/presigned-url/download'
    headers = {'Authorization': authorization}
    params = {
      "name": "xxx.jpeg",
    }
    response = requests.get(domain + endpoint, params=params, headers=headers)

  elif arg1 == "signup":
    endpoint = '/users/signup'
    payload = {
      'email': 'ayas88888@gmail.com', 
      'password': 'a1faS112', 
    }
    headers = {'Authorization': authorization, 'Content-Type': 'application/json'}
    print(domain + endpoint)
    response = requests.post(domain + endpoint, headers=headers, json=payload)

  elif arg1 == "confirmSignUp":
    endpoint = '/users/confirmSignUp'
    payload = {
      'email': 'ayas88888@gmail.com', 
      'confirmationCode': '911208', 
    }
    headers = {'Authorization': authorization, 'Content-Type': 'application/json'}
    print(domain + endpoint)
    response = requests.post(domain + endpoint, headers=headers, json=payload)

  elif arg1 == "signin":
    endpoint = '/users/signin'
    payload = {
      'email': 'ayas88888@gmail.com', 
      'password': 'a1faS112', 
    }
    headers = {'Authorization': authorization, 'Content-Type': 'application/json'}
    print(domain + endpoint)
    response = requests.post(domain + endpoint, headers=headers, json=payload)

  elif arg1 == "goodsList":
    endpoint = '/goods/' + arg2
    headers = {'Authorization': authorization}
    response = requests.get(domain + endpoint, headers=headers)

  elif arg1 == "goodsDetail":
    endpoint = '/goods/' + arg2
    headers = {'Authorization': authorization}
    response = requests.get(domain + endpoint, headers=headers)

  elif arg1 == "post":
    endpoint = '/goods/'
    payload = {
      'id': 'apple_001', 
      'name': 'りんご', 
      'owner': 'さとう',
      'explanation': 'りんごは、数ある果物の中でも人々に広く親しまれているものの一つです。その鮮やかな赤や緑の色合いは、見る者の目を引きつけ、果肉のジューシーで甘酸っぱい味は多くの人々の舌を楽しませてきました。りんごにはビタミンCや食物繊維が豊富に含まれており、健康に対するメリットも多いとされています。特に、食物繊維は腸内環境の改善に役立つとされています。また、様々な料理やデザート、ジュースとしての利用方法も幅広く、その利便性と美味しさから多くの家庭の食卓に欠かせない存在となっています。異なる品種や栽培方法によって、りんごの味や食感はさまざま。甘さを追求したものから、爽やかな酸味を持つものまで、好みに合わせて選ぶ楽しさも魅力の一つです。', 
      'price': '100', 
      'image': '20230928T073511479_Apple.jpeg', 
      'category': 'food', 
    }
    headers = {'Authorization': authorization, 'Content-Type': 'application/json'}
    response = requests.post(domain + endpoint, headers=headers, json=payload)

  elif arg1 == "put":
    endpoint = '/goods/' + arg2
    payload = {
      'id': 'apple_002', 
      'name': 'りんご', 
      'owner': 'さとう',
      'explanation': 'りんごは、数ある果物の中でも人々に広く親しまれているものの一つです。その鮮やかな赤や緑の色合いは、見る者の目を引きつけ、果肉のジューシーで甘酸っぱい味は多くの人々の舌を楽しませてきました。りんごにはビタミンCや食物繊維が豊富に含まれており、健康に対するメリットも多いとされています。特に、食物繊維は腸内環境の改善に役立つとされています。また、様々な料理やデザート、ジュースとしての利用方法も幅広く、その利便性と美味しさから多くの家庭の食卓に欠かせない存在となっています。異なる品種や栽培方法によって、りんごの味や食感はさまざま。甘さを追求したものから、爽やかな酸味を持つものまで、好みに合わせて選ぶ楽しさも魅力の一つです。', 
      'price': '100', 
      'image': '20230928T073511479_Apple.jpeg', 
      'category': 'food', 
    }
    headers = {'Authorization': authorization, 'Content-Type': 'application/json'}
    response = requests.put(domain + endpoint, headers=headers, json=payload)

  elif arg1 == "delete":
    endpoint = '/goods/' + arg2
    headers = {'Authorization': authorization}
    response = requests.delete(domain + endpoint, headers=headers)

  elif arg1 == "dummy":
    dummyFileName = 'Healslime.png'
    dummyFileType = 'image/png'

    for _ in range(int(arg2)):

      with open(dummyFileName, 'rb') as file:
        endpoint = '/presigned-url/upload'
        headers = {'Authorization': authorization}
        params = {
          "name": dummyFileName,
          "type": dummyFileType
        }
        preRes = requests.get(domain + endpoint, params=params, headers=headers)

        endpoint = json.loads(preRes.text)["url"]
        requests.put(endpoint, files={'file': file})

        imageName = re.search(r"/([^/]+)\?", endpoint).group(1)

        endpoint = '/goods/'
        payload = {
          'id': generate_random_string(10), 
          'name': generate_random_string(10),
          'owner': generate_random_string(10),
          'explanation': generate_random_string(100),
          'price': str(generate_dummy_integer(10000)),
          'image': imageName,
          'category': generate_random_string(30),
        }
        headers = {'Content-Type': 'application/json'}
        response = requests.post(domain + endpoint, headers=headers, json=payload)

  elif arg1 == "localstack":
    response = requests.get('http://localhost:4566/health')

  # disp res.
  print(response.status_code)
  print(response.text)

# utility.
def generate_random_string(length):
    letters_and_digits = string.ascii_letters + string.digits
    result_str = ''.join(random.choice(letters_and_digits) for _ in range(length))
    return result_str

def generate_dummy_integer(max_value=100):
    return random.randint(1, max_value)

# run.
def run():
  try:
    # list of funcs.
    funcs = {
      "ddb": ddb,
      "req": req,
      "s3": s3,
      "cfn": cfn,
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