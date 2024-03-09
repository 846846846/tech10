import os
import requests
import string
import json
import random
import re

class Req:
  def __init__(self):
    self.domain = "http://localhost:3001/local/api/v1"
    # self.domain = "https://r2a4d8x5za.execute-api.ap-northeast-1.amazonaws.com/dev/api/v1"

  # private.
  def _generate_dummy_integer(self, max_value=100):
    return random.randint(1, max_value)

  def _generate_random_string(self, length):
    letters_and_digits = string.ascii_letters + string.digits
    result_str = ''.join(random.choice(letters_and_digits) for _ in range(length))
    return result_str

  def _getBearer(self):
    url = self.domain + '/public' + '/users/signin'
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

  # meta.
  def _health(self, op1):
    url = self.domain + '/public/health'
    print(url)
    return requests.get(url)

  def _upload(self, op1):
    url = self.domain + '/private/presigned-url/upload'
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    params = {
      "name": "xxx.jpeg",
      "type": "image/jpeg"
    }
    print(url)
    return requests.get(url, params=params, headers=headers)

  def _download(self, op1):
    url = self.domain + '/private/presigned-url/download'
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    params = {
      "name": "satou/20240106T091825519_Healslime.png",
    }
    print(url)
    return requests.get(url, params=params, headers=headers)

  # users 
  def _signup(self, op1):
    url = self.domain + '/public/users/signup'
    headers = {'Content-Type': 'application/json'}
    payload = {
      'name': 'Owner1', 
      'email': 'ayas88888+Owner1@gmail.com', 
      'password': 'Bf12Asf123',
      'role': {'seller': True, 'buyer': False},
    }
    print(url)
    return requests.post(url, headers=headers, json=payload)

  def _confirmSignUp(self, op1):
    url = self.domain + '/public/users/confirmSignUp'
    headers = {'Content-Type': 'application/json'}
    payload = {
      'name': 'Owner1', 
      'confirmationCode': '809654', 
    }
    print(url)
    return requests.post(url, headers=headers, json=payload)

  def _signin(self, op1):
    url = self.domain + '/public' + '/users/signin'
    headers = {'Content-Type': 'application/json'}
    payload = {
      'name': 'Owner1',
      'password': 'Bf12Asf123', 
    }
    print(url)
    return requests.post(url, headers=headers, json=payload)

  def _userReg(self, op1):
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
      url = self.domain + '/public/users/signup'
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

      url = self.domain + '/public/users/confirmSignUp'
      print(url)
      payload = {
        'name': user['name'], 
        'confirmationCode': user['password'],
      }
      headers = {'Content-Type': 'application/json'}
      response = requests.post(url, headers=headers, json=payload)
      print(response.status_code)
      print(response.text)

  # products.
  def _p_post(self, op1):
    dummyFileName = './assets/Healslime.png'
    dummyFileType = 'image/png'

    for _ in range(int(op1)):

      with open(dummyFileName, 'rb') as file:
        # 1. PresignedURLを取得.
        endpoint = '/private/presigned-url/upload'
        headers = {'Authorization': 'Bearer ' + self._getBearer()}
        params = {
          "name": os.path.basename(dummyFileName),
          'type': dummyFileType
        }
        print('S: get presignedUrl => ' + self.domain + endpoint)
        preRes = requests.get(self.domain + endpoint, params=params, headers=headers)
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
          'name': self._generate_random_string(10),
          'owner': owner,
          'explanation': self._generate_random_string(100),
          'price': str(self._generate_dummy_integer(10000)),
          'image':  [owner + '/' + imageName],
          'category': self._generate_random_string(30),
        }
        headers['Content-Type'] = 'application/json'
        print('S: post products data => ' + self.domain + endpoint)
        response = requests.post(self.domain + endpoint, headers=headers, json=payload)
        print('E: post products data => ' + str(response.status_code))

  def _p_get(self, op1):
    url = self.domain + '/private/products/' + op1
    print(url)
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    return requests.get(url, headers=headers)

  def _p_put(self, op1):
    url = self.domain + '/private/products/' + op1
    headers = {'Authorization': 'Bearer ' + self._getBearer(), 'Content-Type': 'application/json'}
    owner = 'Owner1'  # 固定
    payload = {
      'name': 'テスト', 
      'owner': owner,
      'explanation': 'テスト', 
      'price': 9999, 
      'image':  [owner + '/' + self._generate_random_string(30), owner + '/' + self._generate_random_string(30)], 
      'category': 'test', 
    }
    print(url)
    return requests.put(url, headers=headers, json=payload)

  def _p_delete(self, op1):
    url = self.domain + '/private/products/' + op1
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    print(url)
    return requests.delete(url, headers=headers)

  # orders.
  def _o_post(self, op1):
    url = self.domain + '/private/orders/' + op1
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    payload = {
      'productId': self._generate_random_string(10),
      'price': str(self._generate_dummy_integer(10000)),
      'quantity': str(self._generate_dummy_integer(10000)),
    }
    print(url)
    return requests.post(url, headers=headers, json=payload)

  def _o_get(self, op1):
    url = self.domain + '/private/orders/' + op1
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    print(url)
    return requests.get(url, headers=headers)

  def _o_put(self, op1):
    url = self.domain + '/private/orders/' + op1
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    payload = {
      'productId': self._generate_random_string(10),
      'price': str(self._generate_dummy_integer(10000)),
      'quantity': str(self._generate_dummy_integer(10000)),
    }
    print(url)
    return requests.put(url, headers=headers, json=payload)

  def _o_delete(self, op1):
    url = self.domain + '/private/orders/' + op1
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    print(url)
    return requests.delete(url, headers=headers)

  # public.
  def exec(self, arg1, arg2 = ""):
    cmdList = {
      "health": self._health,
      "upload": self._upload,
      "download": self._download,
      "signup": self._signup,
      "confirmSignUp": self._confirmSignUp,
      "signin": self._signin,
      "userReg": self._userReg,
      "p_post": self._p_post,
      "p_get": self._p_get,
      "p_put": self._p_put,
      "p_delete": self._p_delete,
      "o_post": self._o_post,
      "o_get": self._o_get,
      "o_put": self._o_put,
      "o_delete": self._o_delete,
    }
    response = cmdList.get(arg1, self._health)(arg2)
    if response != None:
      print(response.status_code)
      print(response.text)