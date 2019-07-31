from notebook.utils import url_path_join

from jupyterlab_nova.handlers import AuthHandler

__version__ = '0.3.1'

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
    endpoint = url_path_join(base_url, 'gcp', 'v1', 'auth')
    handlers = [(url_path_join(base_url, 'gcp', 'v1', 'auth'), AuthHandler)]
    web_app.add_handlers('.*$', handlers)
