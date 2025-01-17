import * as React from 'react';

import RenderGuard from 'src/components/RenderGuard';
import Grid, { GridProps } from 'src/components/core/Grid';

/* tslint:disable-next-line */
export type Props = GridProps;

const WrappedGrid = React.forwardRef<HTMLDivElement, GridProps>(
  (props, ref) => {
    const updatedProps: GridProps = {
      ...props,
      /** re: https://github.com/mui-org/material-ui/pull/10768 */
      ...(props.container && !props.spacing && { spacing: 2 }),
    };

    return (
      <Grid ref={ref} {...updatedProps}>
        {props.children}
      </Grid>
    );
  }
);

export default RenderGuard<GridProps>(WrappedGrid);
