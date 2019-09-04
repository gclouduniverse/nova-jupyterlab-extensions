import * as React from 'react';
import {Info} from "@material-ui/icons";
import {withStyles} from '@material-ui/core';
import {classes, stylesheet} from 'typestyle';

import {css, COLORS} from '../../styles';
import {Progress} from './progress';

interface Props {
  asError?: boolean;
  asActivity?: boolean;
  text: string;
}

const BlueInfo = withStyles({
  root: {
    color: COLORS.link,
    fontSize: '16px',
  }
})(Info);

const RedError = withStyles({
  root: {
    color: COLORS.red,
    fontSize: '16px',
  }
})(Info);

const localStyles = stylesheet({
  error: {
    backgroundColor: 'var(--md-red-50, #ffebee)',
    color: 'var(--md-red-700, #d32f2f)',
  },
  info: {
    backgroundColor: 'var(--md-blue-50, #bbdefb)',
    color: 'var(--md-blue-700, #1976d2)',
  },
  message: {
    alignItems: 'center',
    borderRadius: '3px',
    padding: '7px',
  },
  text: {
    paddingLeft: '5px',
  }
});

/** Shared message component. */
export function Message(props: Props) {
  return (
    <div className={classes(css.row, localStyles.message,
      props.asError ? localStyles.error : localStyles.info)}>
      {props.asActivity ? <Progress /> :
        props.asError ? <RedError /> : <BlueInfo />}
      <span className={localStyles.text}>{props.text}</span>
    </div>
  );
}
