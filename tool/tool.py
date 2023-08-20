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


# http req.
def req(arg1, arg2):
  # domain = "http://localhost:3001/dev"
  domain = "https://llt3b0cr2h.execute-api.ap-northeast-1.amazonaws.com/dev/"
  response = ""
  if arg1 == "":
    endpoint = '/health'
    response = requests.get(domain + endpoint)

  elif arg1 == "getAll":
    endpoint = '/api/v1/memos/' + arg2
    response = requests.get(domain + endpoint)

  elif arg1 == "get":
    endpoint = '/api/v1/memos/' + arg2
    response = requests.get(domain + endpoint)

  elif arg1 == "post":
    endpoint = '/api/v1/memos/'
    payload = {
      'title': 'ノート1', 
      'mainText': 'これは最初のノートの本文です。ノート作成アプリのテストデータとして使用します。'
    }
    headers = {'Content-Type': 'application/json'}
    response = requests.post(domain + endpoint, headers=headers, json=payload)

  elif arg1 == "dummy":
    for _ in range(int(arg2)):
      endpoint = '/api/v1/memos/'
      payload = {
        'title': generate_random_string(10), 
        'mainText': generate_random_string(50)
      }
      headers = {'Content-Type': 'application/json'}
      response = requests.post(domain + endpoint, headers=headers, json=payload)

  elif arg1 == "put":
    endpoint = '/api/v1/memos/' + arg2
    payload = {
      'title': 'ノート2', 
      'mainText': 'これは二つ目のノートの本文です。日々の学習やアイデアを記録するためのサンプルです。'
    }
    headers = {'Content-Type': 'application/json'}
    response = requests.put(domain + endpoint, headers=headers, json=payload)

  elif arg1 == "delete":
    endpoint = '/api/v1/memos/' + arg2
    response = requests.delete(domain + endpoint)

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