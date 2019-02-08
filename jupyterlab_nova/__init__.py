import re, json, copy

import tornado.gen as gen

from notebook.utils import url_path_join, url_escape
from notebook.base.handlers import APIHandler

__version__ = '0.1.0'



class NovaHandler(APIHandler):
    """
    A proxy for the GitHub API v3.

    The purpose of this proxy is to provide authentication to the API requests
    which allows for a higher rate limit. Without this, the rate limit on
    unauthenticated calls is so limited as to be practically useless.
    """
    @gen.coroutine
    def post(self, path=''):
        """
        Proxy API requests to GitHub, adding authentication parameter(s) if
        they have been set.
        """
        print("*****")
        data = json.loads(self.request.body.decode('utf-8'))
        f = open("/tmp/demo", "w")
        f.write(str(data))
        return "****"


def _jupyter_server_extension_paths():
    return [{
        'module': 'jupyterlab_nova'
    }]

def load_jupyter_server_extension(nb_server_app):
    """
    Called when the extension is loaded.

    Args:
        nb_server_app (NotebookWebApplication): handle to the Notebook webserver instance.
    """
    web_app = nb_server_app.web_app
    base_url = web_app.settings['base_url']
    endpoint = url_path_join(base_url, 'nova')
    handlers = [(endpoint, NovaHandler)]
    web_app.add_handlers('.*$', handlers)
