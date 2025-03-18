'use client';

import { TableStateProps, useTableState } from '@react-stately/table';
import { useRef } from 'react';
import { AriaTableProps, useTable } from '@react-aria/table';
import TableRowGroup from './TableRowGroup';
import TableHeaderRow from './TableHeaderRow';
import TableColumnHeader from './TableColumnHeader';
import { GridNode } from '@react-types/grid';
import TableRow from './TableRow';
import TableCell from './TableCell';
import TableSelectAllCell from './TableSelectAllCell';
import TableCheckboxCell from './TableCheckboxCell';
import { Key } from 'react-stately';

interface ITable<T extends object> {
   className: string;
   'aria-label'?: string;
   selectionMode?: 'none' | 'single' | 'multiple';
   selectionBehavior?: 'toggle' | 'replace';
   onSelectionChange?: (keys: Set<string>) => void;
   sortDescriptor?: { column?: Key; direction: 'ascending' | 'descending' };
   onSortChange?: (descriptor: { column?: Key }) => void;
}

type TableProps<T extends object> = ITable<T> & Omit<AriaTableProps<T>, keyof ITable<T>> & TableStateProps<T>;

type childNodes = Iterable<GridNode<unknown>> | undefined;

export default function Table<T extends object>(props: TableProps<T>) {
   const { selectionMode, selectionBehavior } = props;
   const state = useTableState({
      ...props,
      showSelectionCheckboxes:
         selectionMode === 'multiple' && selectionBehavior !== 'replace',
   });

   const ref = useRef(null);
   const { collection } = state;
   const { gridProps } = useTable(
      { ...props, 'aria-label': props['aria-label'] ?? 'table' },
      state,
      ref,
   );

   return (
      <table
         {...gridProps}
         ref={ref}
         className={` border-collapse ${props.className}`}
      >
         <TableRowGroup type="thead">
            {collection.headerRows.map(headerRow => (
               <TableHeaderRow
                  key={headerRow.key}
                  item={headerRow}
                  state={state}
               >
                  {Array.from((headerRow.childNodes as childNodes) ?? []).map(
                     column =>
                        column.props?.isSelectionCell && false ? (
                           <TableSelectAllCell
                              key={column.key}
                              column={column}
                              state={state}
                           />
                        ) : (
                           <TableColumnHeader
                              key={column.key}
                              column={column}
                              state={state}
                           />
                        ),
                  )}
               </TableHeaderRow>
            ))}
         </TableRowGroup>
         <TableRowGroup type="tbody">
            {Array.from((collection.body.childNodes as childNodes) ?? []).map(
               row => (
                  <TableRow key={row.key} item={row} state={state}>
                     {Array.from((row.childNodes as childNodes) ?? []).map(
                        cell =>
                           cell.props?.isSelectionCell ? (
                              <TableCheckboxCell
                                 key={cell.key}
                                 cell={cell}
                                 state={state}
                              />
                           ) : (
                              <TableCell
                                 key={cell.key}
                                 cell={cell}
                                 state={state}
                              />
                           ),
                     )}
                  </TableRow>
               ),
            )}
         </TableRowGroup>
      </table>
   );
}
