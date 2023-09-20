# debug用スクリプト
import os
import sys
import subprocess
import requests
import json
import random
import string

# DynamoDB.
def ddb(arg1, arg2):

  # read table name
  with open('./ddb-schema/table.json') as f:
      params = json.load(f)
      table_name = params['TableName']

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
    "ct": BSE + CTB + CIJ + "table.json",
    "ut": BSE + UTB + CIJ + "gsi1.json",
    "st": BSE + DSB + TNA + table_name,
    "dt": BSE + DTB + TNA + table_name,
    "bwi": BSE + BWI + RIS + "items.json",
    "qry": BSE + QRY + CIJ + "query.json",

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
def cf(arg1, arg2):

  # cmd parts.
  BSE = "aws cloudformation "

  ## command.
  VT = "validate-template "
  CS = "create-stack --stack-name "
  US = "update-stack --stack-name "
  DES = "describe-stacks --stack-name "
  DS = "delete-stack --stack-name "

  ## variable.
  SN = "tech10-front-dev "
  YML = "--template-body file://../app/front/cf.yaml"


  DMY = ""

  # alias to cmd.
  a2c = {
    # arg1.
    "vt": BSE + VT + YML,
    "cs": BSE + CS + SN + YML,
    "us": BSE + US + SN + YML,
    "des": BSE + DES + SN,
    "ds": BSE + DS + SN,

    # n/a.
    "": DMY,
  }
  cmd = a2c[arg1] + a2c[arg2]

  print(cmd)
  subprocess.run(cmd)

# http req.
def req(arg1, arg2):

  # domain = "http://localhost:3001/dev/api/v1"
  domain = "https://5adqe2wdk2.execute-api.ap-northeast-1.amazonaws.com/dev/api/v1"
  authorization = 'dummy'

  response = ""
  if arg1 == "":
    endpoint = '/health'
    response = requests.get(domain + endpoint)

  elif arg1 == "preSigned":
    endpoint = '/generate-presigned-url'
    headers = {'Authorization': authorization}
    response = requests.get(domain + endpoint, headers=headers)

  elif arg1 == "getAll":
    endpoint = '/goods/' + arg2
    headers = {'Authorization': authorization}
    response = requests.get(domain + endpoint, headers=headers)

  elif arg1 == "get":
    endpoint = '/goods/' + arg2
    headers = {'Authorization': authorization}
    response = requests.get(domain + endpoint, headers=headers)

  elif arg1 == "post":
    endpoint = '/goods/'
    payload = {
      'id': '1', 
      'name': 'りんご', 
      'explanation': 'おいしいりんごだよ。', 
      'price': '100', 
      'image': 's3://{ownerid}/apple.png', 
      'category': 'food', 
    }
    headers = {'Authorization': authorization, 'Content-Type': 'application/json'}
    response = requests.post(domain + endpoint, headers=headers, json=payload)

  elif arg1 == "post2":
    endpoint = '/goods/'
    payload = {
      'id': '2', 
      'name': 'みかん', 
      'explanation': 'くさったみかん。', 
      'price': '10', 
      'image': 's3://{ownerid}/orange.png', 
      'category': 'food', 
    }
    headers = {'Authorization': authorization, 'Content-Type': 'application/json'}
    response = requests.post(domain + endpoint, headers=headers, json=payload)


  elif arg1 == "dummyPost":
    for _ in range(int(arg2)):
      endpoint = '/goods/'
      payload = {
        'id': generate_random_string(10), 
        'name': generate_random_string(10), 
        'explanation': generate_random_string(50), 
        'price': generate_random_string(10), 
        'image': generate_random_string(50), 
        'category': generate_random_string(10), 
      }
      headers = {'Authorization': authorization, 'Content-Type': 'application/json'}
      response = requests.post(domain + endpoint, headers=headers, json=payload)

  elif arg1 == "put":
    endpoint = '/goods/' + arg2
    payload = {
      'id': '1', 
      'name': 'みかん', 
      'explanation': 'くさったみかん。', 
      'price': '10', 
      'image': 's3://{ownerid}/orange.png', 
      'category': 'food', 
    }
    headers = {'Authorization': authorization, 'Content-Type': 'application/json'}
    response = requests.put(domain + endpoint, headers=headers, json=payload)

  elif arg1 == "delete":
    endpoint = '/goods/' + arg2
    headers = {'Authorization': authorization}
    response = requests.delete(domain + endpoint, headers=headers)

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

# run.
def run():
  try:
    # list of funcs.
    funcs = {
      "ddb": ddb,
      "req": req,
      "s3": s3,
      "cf": cf,
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