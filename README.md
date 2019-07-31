## Note
For **latest** version of this project please take a look [here](https://github.com/GoogleCloudPlatform/ai-platform-samples/tree/master/notebooks/nova-jupyterlab-extensions)

# Nova

Jupyter Notebook submission to GCP


## Prerequisites

* JupyterLab

## Installation

This should work on Google Cloud Deep Learning VM M19+.

```bash
sudo pip3 install .
sudo service jupyter restart
sudo jupyter labextension install
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
# Create a Python 3 virtualenv and install jupyterlab and the project in edit mode
virtualenv -p python3 venv
source venv/bin/activate
pip install jupyterlab
pip install -e

# Install the npm package and the extension
npm install
jupyter labextension install . --no-build

# Now, run npm start which starts the Typescript compiler in watch mode on the
# extension directory as well as the JupyterLab server
npm start
```

