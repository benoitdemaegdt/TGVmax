"""
Config
"""
import os

class Config():
  """
  Config for the app
  """
  ADMIN_EMAIL: str = os.getenv('ADMIN_EMAIL')
  ALERT_EMAIL: str = os.getenv('EMAIL')
  PASSWORD: str = os.getenv('PASSWORD')
