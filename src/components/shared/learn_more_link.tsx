import * as React from 'react';
import {Launch} from "@material-ui/icons";

interface Props {
  href: string;
  text?: string;
}

/** Functional Component for an external link */
// tslint:disable-next-line:enforce-name-casing
export function LearnMoreLink(props: Props) {
  return (
    <a href={props.href} target="_blank">
      {props.text || 'Learn More'}
      <Launch fontSize='small' classes={{fontSizeSmall: 'smallIcon'}} />
    </a>
  );
}
