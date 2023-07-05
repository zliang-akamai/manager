import React from 'react';
import { TableBody } from 'src/components/TableBody';
import { TableHead } from 'src/components/TableHead';
import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow';
import { Table } from './Table';
import type { TableProps } from './Table';
import type { Meta, StoryObj } from '@storybook/react';

export const Default: StoryObj<TableProps> = {
  render: (args) => <Table {...args} />,
};

const meta: Meta<TableProps> = {
  title: 'Components/table/Table',
  component: Table,
  args: {
    children: (
      <>
        <TableHead>
          <TableRow>
            <TableCell>Label</TableCell>
            <TableCell>Plan</TableCell>
            <TableCell>Region</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>test-0</TableCell>
            <TableCell>Linode 2 GB</TableCell>
            <TableCell>Atlanta, GA</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>test-1</TableCell>
            <TableCell>Linode 4 GB</TableCell>
            <TableCell>Dallas, TX</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>test-2</TableCell>
            <TableCell>Linode 8 GB</TableCell>
            <TableCell>Newark, NJ</TableCell>
          </TableRow>
        </TableBody>
      </>
    ),
    noBorder: false,
    padding: 'normal',
    size: 'medium',
    spacingBottom: 0,
    spacingTop: 0,
  },
};
export default meta;
