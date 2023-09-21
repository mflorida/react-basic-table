import React from 'react';

import {
  resolveClassNames,
  mergeProps,
  funcOr,
  firstDefined,
  isFunction
} from './lib/utils';


export default function BasicTable(props) {

  const {
    data = [],
    columns = [],
    config = {},
    header,
    footer
  } = props;


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
                {funcOr(col.header || col.th?.render || col.th?.children)}
              </th>
            ))}
          </tr>
          </thead>
        ) : (
          isFunction(header) ? header({thead, columns}) : (header || null)
        )}

        <tbody {...tbody.__}>
        {data.map((rowData, rowIndex) => (
          <tr key={rowIndex} {...funcOr(tbody.tr, [rowData, rowIndex])}>
            {columns.map((col, colIndex) => {
              const cellRender = firstDefined(col.render, col.cell, col.td?.render, col.td?.children);
              const cellProps = mergeProps(funcOr(tbody.td, [rowData, rowIndex]), funcOr(col.td, [rowData, rowIndex]));
              return cellRender != null ? (
                <td key={colIndex} {...cellProps}>
                  {funcOr(cellRender, [rowData, rowIndex])}
                </td>
              ) : (
                <td key={colIndex} {...cellProps}>
                  {col.key ? rowData[col.key] : null}
                </td>
              )
            })}
          </tr>
        ))}
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
