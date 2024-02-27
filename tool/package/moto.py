import subprocess
import boto3
from moto import mock_cognitoidp

# moto server.
class MOTO:
  def __init__(self):
    self.moto_server_url = "http://localhost:5000"

  # priate.
  def _cup(self, op1):
    @mock_cognitoidp
    def create_user_pool():

      # Cognito Identity Provider サービスクライアントの作成
      client = boto3.client('cognito-idp', region_name='ap-northeast-1', endpoint_url=self.moto_server_url)
      
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

  def _sup(self, op1):
    @mock_cognitoidp
    def show_user_pool():
      # Cognito Identity Provider サービスクライアントの作成
      client = boto3.client('cognito-idp', region_name='ap-northeast-1', endpoint_url=self.moto_server_url)

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

  def _dup(self, op1):
    @mock_cognitoidp
    def delete_user_pool():
      # Cognito Identity Provider サービスクライアントの作成
      client = boto3.client('cognito-idp', region_name='ap-northeast-1', endpoint_url=self.moto_server_url)

      # ユーザープールの一覧を取得
      pools_response  = client.list_user_pools(MaxResults=10)
      for pool in pools_response['UserPools']:
          user_pool_id = pool['Id']
          print(f"User Pool ID: {user_pool_id}")
          
          # ユーザープールを削除
          client.delete_user_pool(UserPoolId=user_pool_id)

    delete_user_pool()

  def _lu(self, op1):
    @mock_cognitoidp
    def list_users():
      # Cognito Identity Provider サービスクライアントの作成
      client = boto3.client('cognito-idp', region_name='ap-northeast-1', endpoint_url=self.moto_server_url)

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

  def _na(self, op1):
    print('na')

  # public.
  def exec(self, arg1, arg2 = ""):
    cmdList = {
      "cup": self._cup,
      "sup": self._sup,
      "dup": self._dup,
      "lu": self._lu,
    }
    cmdList.get(arg1, self._na)(arg2)
