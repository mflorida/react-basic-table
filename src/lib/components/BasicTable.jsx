import React from 'react';
import {
  devmode,
  firstDefined,
  funcOr,
  isFunction,
  isMap,
  mergeProps,
  resolveClassNames,
} from '../utils';

export default function BasicTable(props) {
  const {
    data = [],
    config = {},
    header,
    footer
  } = props;

  let columns = props.columns;

  // Allow use of Map for column config
  if (isMap(columns)) {
    columns = Array.from(columns).map(([key, column]) => {
      // Normalize column config properties
      column.key = column.key || column.field || key;
      column.label = column.label || key;
      column.header = column.header || key;
      return column;
    });
  }

  const tableConfig = {
    __: {},
    thead: {
      __: {},
      tr: {},
      th: {},
      td: {}
    },
    tbody: {
      __: {},
      tr: {},
      td: {}
    },
    tfoot: {
      __: {},
      tr: {},
      td: {}
    }
  }

  // config.__ = firstDefined(config.__, {});
  // config.__.className = resolveClassNames([config.__.className, 'basic-table']);

  // apply `config` object from props
  // over default `tableConfig` config above
  Object.assign(tableConfig, { __: { className: '' } }, config);

  tableConfig.__.className = resolveClassNames(['basic-table', tableConfig.__.className]);

  const { thead, tbody, tfoot } = tableConfig;

  return (
    <div className={'basic-table-wrapper'}>
      <table {...funcOr(tableConfig.__)}>
        {header === true ? (
          <thead {...funcOr(thead.__)}>
          <tr {...funcOr(thead.tr)}>
            {columns.map((col, colIndex) => (
              <th key={colIndex} {...mergeProps(funcOr(thead.th), funcOr(col.th))}>
                {funcOr(firstDefined(
                  col.header,
                  col.title,
                  col.label,
                  col.th?.cell,
                  col.th?.render,
                  col.th?.children,
                  null
                ))}
              </th>
            ))}
          </tr>
          </thead>
        ) : (
          isFunction(header) ? header({thead, columns}) : (header || null)
        )}

        <tbody {...tbody.__}>
        {data.map((rowData, rowIndex) => {
          const rowKey = String(rowData.rowKey || rowData.key || rowData.id || rowIndex);
          return (
              <tr data-key={rowKey} key={rowKey} {...funcOr(tbody.tr, [rowData, rowIndex])}>
                {columns.map((col, colIndex) => {
                  const colKey = firstDefined(col.key, col.field, null);
                  devmode(() => console.log(colKey));
                  const cellKey = rowKey ? (rowKey + '-' + colIndex) : colIndex;
                  const cellRender = firstDefined(
                    col.cell,
                    col.render,
                    col.td?.cell,
                    col.td?.render,
                    col.td?.children,
                    null
                  );
                  const cellProps = mergeProps(
                    funcOr(tbody.td, [rowData, rowIndex]),
                    funcOr(col.td, [rowData, rowIndex])
                  );
                  return cellRender != null ? (
                    <td key={cellKey} {...cellProps}>
                      {funcOr(cellRender, [rowData, rowIndex])}
                    </td>
                  ) : (
                    <td key={cellKey} {...cellProps}>
                      {colKey ? rowData[colKey] : null}
                    </td>
                  );
                })}
              </tr>
            );
          }
        )}
        </tbody>

        {footer === true ? (
          <tfoot {...funcOr(tfoot.__)}>
          <tr {...funcOr(tfoot.tr)}>
            {columns.map((col, colIndex) => {
              return (
                <td key={colIndex} {...mergeProps(funcOr(tfoot.td), funcOr(col.footer))}>
                  {funcOr(col.footer)}
                </td>
              )
            })}
          </tr>
          </tfoot>
        ) : (
          isFunction(footer) ? footer({tfoot, columns}) : (footer || null)
        )}
      </table>
    </div>
  )
}
