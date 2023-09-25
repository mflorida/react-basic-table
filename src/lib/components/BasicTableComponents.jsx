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

// Main component that's used to render everything.
function BaseComponent(props) {
  const {
    as = null,
    tag = as,
    cfg = {},
    config = cfg,
    className = '',
    children,
    ..._props
  } = props;

  config.tag = config.tag || tag;
  config.className = resolveClassNames(config.className, className);

  let Component = null;

  if (config.tag) {
    try {
      Component = React.createElement(config.tag, {
        className: config.className,
        ..._props
      }, children);
    } catch (e) {
      console.warn(e);
    }
  }

  return Component;
}

// <thead>
export function Header({ children, ..._props }) {
  return (
    <BaseComponent config={{ tag: 'thead', className: 'basic-thead' }} {..._props}>
      {children}
    </BaseComponent>
  );
}

// <thead><tr>
export function HeaderRow({ children, ..._props }) {
  return (
    <BaseComponent config={{ tag: 'tr', className: 'basic-thead-row' }} {..._props}>
      {children}
    </BaseComponent>
  );
}
Header.Row = HeaderRow;

// <thead><tr><th|td>
export function HeaderCell(props) {
  const {
    as = 'th',
    tag = as,
    children,
    ..._props
  } = props;
  return (
    <BaseComponent config={{ tag, className: 'basic-thead-cell' }} {..._props}>
      {children}
    </BaseComponent>
  );
}
Header.Cell = HeaderCell;

// <tbody>
export function Body({ children, ..._props }) {
  return (
    <BaseComponent config={{ tag: 'tbody', className: 'basic-tbody' }} {..._props}>
      {children}
    </BaseComponent>
  );
}

// <tbody><tr>
export function BodyRow({ children, ..._props }) {
  return (
    <BaseComponent config={{ tag: 'tr', className: 'basic-tbody-row' }} {..._props}>
      {children}
    </BaseComponent>
  );
}
Body.Row = BodyRow;

// <tbody><tr><td>
export function BodyCell(props) {
  const {
    as = 'td',
    tag = as,
    children,
    ..._props
  } = props;
  return (
    <BaseComponent config={{ tag, className: 'basic-tbody-cell' }} {..._props}>
      {children}
    </BaseComponent>
  );
}
Body.Cell = BodyCell;

// <tfoot>
export function Footer({ children, ..._props }) {
  return (
    <BaseComponent config={{ tag: 'tfoot', className: 'basic-tfoot' }} {..._props}>
      {children}
    </BaseComponent>
  );
}

// <tfoot><tr>
export function FooterRow({ children, ..._props }) {
  return (
    <BaseComponent config={{ tag: 'tr', className: 'basic-tfoot-row' }} {..._props}>
      {children}
    </BaseComponent>
  );
}
Footer.Row = FooterRow;

// <tfoot><tr><th|td>
export function FooterCell(props) {
  const {
    as = 'th',
    tag = as,
    children,
    ..._props
  } = props;
  return (
    <BaseComponent config={{ tag, className: 'basic-tfoot-cell' }} {..._props}>
      {children}
    </BaseComponent>
  );
}
Footer.Cell = FooterCell;


// <table>
export function Table(props) {
  devmode(props);

  const {
    data = [],
    config = {},
    header,
    footer,
    children = null
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
  };

  // config.__ = firstDefined(config.__, {});
  // config.__.className = resolveClassNames([config.__.className, 'basic-table']);

  // apply `config` object from props
  // over default `tableConfig` config above
  Object.assign(tableConfig, { __: { className: '' } }, config);

  tableConfig.__.className = ['basic-table', tableConfig.__.className].join(' ').trim();
  devmode(tableConfig);

  const {
    tr = {},
    td = {},
    th = {},
    thead = {},
    tbody = {},
    tfoot = {}
  } = tableConfig;

  return (
    <table {...funcOr(tableConfig.__)}>
      {children ? (
        // render the children
        // if using that pattern
        children
      ) : (
        <>
          {header === true ? (
            <Header {...funcOr(thead.__)}>
              <Header.Row {...funcOr(thead.tr)}>
                {columns.map((col, colIndex) => (
                  <Header.Cell key={colIndex} {...mergeProps(
                    funcOr(th),
                    funcOr(thead.th),
                    funcOr(col.th))
                  }>
                    {funcOr(firstDefined(
                      col.header,
                      col.title,
                      col.label,
                      col.th?.cell,
                      col.th?.render,
                      col.th?.children,
                      null
                    ))}
                  </Header.Cell>
                ))}
              </Header.Row>
            </Header>
          ) : (
            isFunction(header) ? header({ thead, columns }) : (header || null)
          )}

          <Body {...tbody.__}>
            {data.map((rowData, rowIndex) => {
              const rowKey = String(rowData.rowKey || rowData.key || rowData.id || rowIndex);
              return (
                <Body.Row data-key={rowKey} key={rowKey} {...mergeProps(
                  funcOr(tr, [rowData, rowIndex]),
                  funcOr(tbody.tr, [rowData, rowIndex])
                )}>
                  {columns.map((col, colIndex) => {
                    const colKey = firstDefined(col.key, col.field, null);
                    devmode(colKey);
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
                      funcOr(td, [rowData, rowIndex]),
                      funcOr(tbody.td, [rowData, rowIndex]),
                      funcOr(col.td, [rowData, rowIndex]),
                    );
                    return cellRender != null ? (
                      <Body.Cell key={cellKey} {...cellProps}>
                        {funcOr(cellRender, [rowData, rowIndex])}
                      </Body.Cell>
                    ) : (
                      <Body.Cell key={cellKey} {...cellProps}>
                        {colKey ? rowData[colKey] : null}
                      </Body.Cell>
                    );
                  })}
                </Body.Row>
              );
            })}
          </Body>

          {footer === true ? (
            <Footer key={'tfoot'} {...funcOr(tfoot.__)}>
              <Footer.Row {...funcOr(tfoot.tr)}>
                {columns.map((col, colIndex) => (
                  <Footer.Cell key={colIndex} {...mergeProps(
                    funcOr(td),
                    funcOr(tfoot.td),
                    funcOr(tfoot.th)
                  )}>
                    {funcOr(col.footer)}
                  </Footer.Cell>
                ))}
              </Footer.Row>
            </Footer>
          ) : (
            isFunction(footer) ? footer({ tfoot, columns }) : (footer || null)
          )}
        </>
      )}
    </table>
  );
}

// Table.Header = Header;
// Table.Body = Body;
// Table.Footer = Footer;

export const BasicTable = {

  Table,
  Row: BodyRow,
  Cell: BodyCell,

  Header,
  // HeaderRow,
  // HeaderCell,

  Body,
  // BodyRow,
  // BodyCell,

  Footer,
  // FooterRow,
  // FooterCell

};

export default BasicTable;
