from notebook.utils import url_path_join

from jupyterlab_gcpscheduler.handlers import AuthHandler, RuntimeEnvHandler

__version__ = '0.3.1'

def _jupyter_server_extension_paths():
    return [{
        'module': 'jupyterlab_gcpscheduler'
    }]

def load_jupyter_server_extension(nb_server_app):
    """
    Called when the extension is loaded.

    Args:
        nb_server_app (NotebookWebApplication): handle to the Notebook webserver instance.
    """
    host_pattern = '.*$'
    web_app = nb_server_app.web_app
    gcpV1Endpoint = url_path_join(web_app.settings['base_url'],'gcp','v1')
    authHandlers = [(url_path_join(gcpV1Endpoint, 'auth'), AuthHandler)]
    web_app.add_handlers(host_pattern, authHandlers)
    runtimeEnvHandler = [(url_path_join(gcpV1Endpoint, 'runtime'), RuntimeEnvHandler)]
    web_app.add_handlers(host_pattern, runtimeEnvHandler)
