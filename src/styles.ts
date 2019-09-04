/**
 * Global styles configured with typestyle.
 * JupyterLab CSS Variables can be found at
 * https://github.com/jupyterlab/jupyterlab/blob/master/packages/theme-light-extension/style/variables.css
 */
import * as csstips from 'csstips';
import { cssRaw, stylesheet } from 'typestyle';
import { CSSProperties } from 'typestyle/lib/types';

// Imports Roboto 400 and 500 weight
cssRaw(
  `@import url('https://fonts.googleapis.com/css?family=Roboto:400,500');`
);
const ROBOTO_FONT = '"Roboto", "Helvetica Neue", sans-serif';

/** Theme colors. */
export const COLORS = {
  base: 'var(--jp-ui-font-color1, #3c4043)',
  border: 'var(--jp-border-color0, #bdc1c6)',
  green: 'var(--jp-success-color1, #1e8e3e)',
  input: '#f5f5f5',
  link: 'var(--jp-content-link-color, #3367d6)',
  red: 'var(--jp-error-color1, #d93025)',
  white: 'var(--jp-layout-color1, white)',
};

/** Base extension font style */
export const BASE_FONT: CSSProperties = {
  color: COLORS.base,
  fontFamily: ROBOTO_FONT,
  fontSize: 'var(--jp-ui-font-size1, 13px)',
};

/** Global styles that are useful across components */
export const css = stylesheet({
  actionBar: {
    paddingTop: '16px',
    paddingRight: '2px',
    ...csstips.horizontal,
    ...csstips.endJustified,
  },
  activity: {
    color: COLORS.link,
  },
  column: csstips.vertical,
  row: csstips.horizontal,
  bold: {
    fontWeight: 500,
  },
  button: {
    backgroundColor: COLORS.white,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: COLORS.border,
    fontFamily: ROBOTO_FONT,
    fontWeight: 500,
    cursor: 'pointer',
    ...csstips.padding('4px', '16px'),
  },
  inputContainer: {
    paddingBottom: '10px',
    ...csstips.vertical,
  },
  input: {
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderWidth: '1px',
    fontSize: '12px',
    marginTop: '4px',
    ...csstips.padding('5px', '4px'),
    $nest: {
      '&.error': {
        borderColor: 'red',
      },
    },
  },
  link: {
    color: COLORS.link,
    textDecoration: 'underline',
    $nest: {
      '&:active': {
        color: COLORS.link,
      },
      '&:hover': {
        color: COLORS.link,
      },
      '&:visited': {
        color: COLORS.link,
      },
    },
  },
  submitButton: {
    backgroundColor: '#1a73e8',
    color: COLORS.white,
    marginLeft: '16px',
    $nest: {
      '&:disabled': {
        backgroundColor: '#bfbfbf',
      },
      '&:hover': {
        cursor: 'pointer',
      },
      '&:disabled:hover': { cursor: 'default' },
    },
  },
  noTopMargin: { marginTop: 0 },
  errorMessage: {
    color: 'red',
  },
  submitButtonDisabled: {
    backgroundColor: 'var(--md-grey-300, #e0e0e0)',
    color: 'var(--md-grey-500, #9e9e9e)',
    cursor: 'not-allowed',
    marginLeft: '16px',
  },
});
