import * as React from 'react';
import * as csstips from 'csstips';
import { Launch } from '@material-ui/icons';
import { withStyles } from '@material-ui/core';
import { classes, stylesheet } from 'typestyle';

import { css } from '../../styles';

interface Props {
  href: string;
  text?: string;
}

const localStyles = stylesheet({
  link: {
    alignItems: 'center',
    display: 'inline-flex',
    flexDirection: 'row',
    ...csstips.padding(0, '2px'),
  },
  icon: {
    paddingLeft: '2px',
  },
});

// tslint:disable-next-line:enforce-name-casing
const SmallLaunchIcon = withStyles({
  root: {
    fontSize: '16px',
    paddingLeft: '2px',
  },
})(Launch);

/** Functional Component for an external link */
// tslint:disable-next-line:enforce-name-casing
export function LearnMoreLink(props: Props) {
  return (
    <a
      className={classes(css.link, localStyles.link)}
      href={props.href}
      target="_blank"
    >
      <span>{props.text || 'Learn More'}</span>
      <SmallLaunchIcon />
    </a>
  );
}
