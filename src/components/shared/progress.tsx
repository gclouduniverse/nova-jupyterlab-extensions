import * as React from 'react';
import { CircularProgress, withStyles } from '@material-ui/core';

import { COLORS } from '../../styles';

// tslint:disable:enforce-name-casing
const StyledProgress = withStyles({
  root: {
    color: COLORS.link,
  },
})(CircularProgress);

/** Styled Progress indicator */
export function Progress() {
  return <StyledProgress size="18px" />;
}
