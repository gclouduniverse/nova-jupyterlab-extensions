# nova

Jupyter Notebook submission to GCP


## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install nova
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install   # install npm package dependencies
npm run build 
jupyter labextension install  # install the current directory as an extension
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

