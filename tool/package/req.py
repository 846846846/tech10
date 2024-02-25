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
  def health(self, op1):
    url = self.domain + '/public/health'
    print(url)
    return requests.get(url)

  def upload(self, op1):
    url = self.domain + '/private/presigned-url/upload'
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    params = {
      "name": "xxx.jpeg",
      "type": "image/jpeg"
    }
    print(url)
    return requests.get(url, params=params, headers=headers)

  def download(self, op1):
    url = self.domain + '/private/presigned-url/download'
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    params = {
      "name": "satou/20240106T091825519_Healslime.png",
    }
    print(url)
    return requests.get(url, params=params, headers=headers)

  # users 
  def signup(self, op1):
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

  def confirmSignUp(self, op1):
    url = self.domain + '/public/users/confirmSignUp'
    headers = {'Content-Type': 'application/json'}
    payload = {
      'name': 'Owner1', 
      'confirmationCode': '809654', 
    }
    print(url)
    return requests.post(url, headers=headers, json=payload)

  def signin(self, op1):
    url = self.domain + '/public' + '/users/signin'
    headers = {'Content-Type': 'application/json'}
    payload = {
      'name': 'Owner1',
      'password': 'Bf12Asf123', 
    }
    print(url)
    return requests.post(url, headers=headers, json=payload)

  def userReg(self, op1):
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
  def p_get(self, op1):
    print(op1)
    url = self.domain + '/private/products/' + op1
    print(url)
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    return requests.get(url, headers=headers)

  def p_post(self, op1):
    dummyFileName = './assets/Healslime.png'
    dummyFileType = 'image/png'

    for _ in range(int(op1)):

      with open(dummyFileName, 'rb') as file:
        # 1. PresignedURLを取得.
        endpoint = '/private/presigned-url/upload'
        headers = {'Authorization': 'Bearer ' + self._getBearer()}
        params = {
          "name": dummyFileName,
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

  def p_put(self, op1):
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

  def p_delete(self, op1):
    url = self.domain + '/private/products/' + op1
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    print(url)
    return requests.delete(url, headers=headers)

  # orders.
  def o_get(self, op1):
    url = self.domain + '/private/orders/' + op1
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    print(url)
    return requests.get(url, headers=headers)

  def o_post(self, op1):
    url = self.domain + '/private/orders/' + op1
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    payload = {
      'productId': self._generate_random_string(10),
      'price': str(self._generate_dummy_integer(10000)),
      'quantity': str(self._generate_dummy_integer(10000)),
    }
    print(url)
    return requests.post(url, headers=headers, json=payload)

  def o_put(self, op1):
    url = self.domain + '/private/orders/' + op1
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    payload = {
      'productId': self._generate_random_string(10),
      'price': str(self._generate_dummy_integer(10000)),
      'quantity': str(self._generate_dummy_integer(10000)),
    }
    print(url)
    return requests.put(url, headers=headers, json=payload)

  def o_delete(self, op1):
    url = self.domain + '/private/orders/' + op1
    headers = {'Authorization': 'Bearer ' + self._getBearer()}
    print(url)
    return requests.delete(url, headers=headers)

  def na(self, op1):
    return 'na'

  def exec(self, cmd, op1 = ""):
    cylinder = {
      "1": self.health,
      "2": self.upload,
      "3": self.download,
      "4": self.signup,
      "5": self.confirmSignUp,
      "6": self.signin,
      "7": self.userReg,
      "8": self.p_get,
      "9": self.p_post,
      "10": self.p_put,
      "11": self.p_delete,
      "12": self.o_get,
      "13": self.o_post,
      "14": self.o_put,
      "15": self.o_delete,
    }
    response = cylinder.get(cmd, self.na)(op1)
    if response != None:
      print(response.status_code)
      print(response.text)