"""Tornado request handler classes for extension."""
from notebook.base.handlers import APIHandler, app_log

from google.auth.exceptions import GoogleAuthError
from google.auth.transport.requests import Request
import google.auth
import os

SCOPE = ('https://www.googleapis.com/auth/cloud-platform',)
FRAMEWORK_ENV_VAR = 'ENV_VERSION_FILE_PATH'

class AuthProvider:
  """Provider for GCP authentication credential."""

  _instance = None

  def __init__(self):
    self._auth, self._project = google.auth.default(scopes=SCOPE)

  def refresh(self):
    if not self._auth.valid:
      app_log.info('Refreshing Google Cloud Credential')
      self._auth.refresh(Request())

  def to_dict(self):
    return {'token': self._auth.token, 'project': self._project}

  @classmethod
  def get(cls):
    if not cls._instance:
      auth = AuthProvider()
      cls._instance = auth
    cls._instance.refresh()
    return cls._instance


class AuthHandler(APIHandler):
  """Handler to obtain and return a Google Auth Token and Project ID"""

  def get(self):
    """Returns the Authorization: Bearer token from the server's Credential."""
    try:
      self.finish(AuthProvider.get().to_dict())
    except GoogleAuthError:
      msg = 'Unable to obtain Google Cloud Authorization'
      app_log.exception(msg)
      self.set_status(403, msg)

class RuntimeEnvHandler(APIHandler):
  """Handler to obtain runtime environment"""

  def get(self):
    version = 'unknown'
    try:
      env_version = os.environ[FRAMEWORK_ENV_VAR]
      with open(env_version) as f:
        version = f.read().rstrip()
      self.finish(version)
    except KeyError:
      app_log.warning(
        'Environment variable {} is not set'.format(FRAMEWORK_ENV_VAR))
    except OSError:
      app_log.warning('Unable to read framework version from {}'.format(
        os.environ[FRAMEWORK_ENV_VAR]
      ))
