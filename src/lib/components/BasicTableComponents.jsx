import React from 'react';
import {
  devmode,
  firstDefined,
  funcOr,
  isFunction,
  mergeProps, resolveClassNames,
} from '../utils';

// Main component that's used to render everything.
function BaseComponent(props) {
  const {
    as = null,
    tag = as,
    config = {},
    cfg = config,
    className = '',
    children,
    ..._props
  } = props;

  cfg.tag = cfg.tag || tag;
  cfg.className = resolveClassNames(cfg.className, className);

  let Component = null;

  if (cfg.tag) {
    try {
      Component = React.createElement(cfg.tag, {
        className: cfg.className,
        ..._props
      }, children);
    }
    catch (e) {
      console.warn(e);
    }
  }

  return Component
}

// <thead>
export function Header({ children, ..._props }) {
  return (
    <BaseComponent config={{ tag: 'thead', className: 'basic-thead' }} {..._props}>
      {children}
    </BaseComponent>
  )
}

// <thead><tr>
export function HeaderRow({ children, ..._props }) {
  return (
    <BaseComponent config={{ tag: 'tr', className: 'basic-thead-row' }} {..._props}>
      {children}
    </BaseComponent>
  )
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
  )
}
Header.Cell = HeaderCell;

// <tbody>
export function Body({ children, ..._props }) {
  return (
    <BaseComponent config={{ tag: 'tbody', className: 'basic-tbody' }} {..._props}>
      {children}
    </BaseComponent>
  )
}

// <tbody><tr>
export function BodyRow({ children, ..._props }) {
  return (
    <BaseComponent config={{ tag: 'tr', className: 'basic-tbody-row' }} {..._props}>
      {children}
    </BaseComponent>
  )
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
  )
}
Body.Cell = BodyCell;

// <tfoot>
export function Footer({ children, ..._props }) {
  return (
    <BaseComponent config={{ tag: 'tfoot', className: 'basic-tfoot' }} {..._props}>
      {children}
    </BaseComponent>
  )
}

// <tfoot><tr>
export function FooterRow({ children, ..._props }) {
  return (
    <BaseComponent config={{ tag: 'tr', className: 'basic-tfoot-row' }} {..._props}>
      {children}
    </BaseComponent>
  )
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
  )
}
Footer.Cell = FooterCell;


// <table>
export function Table(props) {
  console.log(props);

  const {
    data = [],
    columns = [],
    config = {},
    header,
    footer,
    children = null
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

  tableConfig.__.className = ['basic-table', tableConfig.__.className].join(' ').trim();
  devmode(tableConfig)

  const { thead, tbody, tfoot } = tableConfig;

  return (
    <div className={'basic-table-wrapper'}>
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
                    <Header.Cell key={colIndex} {...mergeProps(funcOr(thead.th), funcOr(col.th))}>
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
              isFunction(header) ? header({thead, columns}) : (header || null)
            )}

            <Body {...tbody.__}>
              {data.map((rowData, rowIndex) => {
                const rowKey = String(rowData.rowKey || rowData.key || rowData.id || rowIndex);
                return (
                  <Body.Row data-key={rowKey} key={rowKey} {...funcOr(tbody.tr, [rowData, rowIndex])}>
                    {columns.map((col, colIndex) => {
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
                        <Body.Cell key={cellKey} {...cellProps}>
                          {funcOr(cellRender, [rowData, rowIndex])}
                        </Body.Cell>
                      ) : (
                        <BodyCell key={cellKey} {...cellProps}>
                          {col.key || col.field ? rowData[col.key || col.field] : null}
                        </BodyCell>
                      )
                    })}
                  </Body.Row>
                )
              })}
            </Body>

            {footer === true ? (
              <Footer key={'tfoot'} {...funcOr(tfoot.__)}>
                <Footer.Row {...funcOr(tfoot.tr)}>
                  {columns.map((col, colIndex) => (
                    <Footer.Cell key={colIndex} {...mergeProps(funcOr(tfoot.td), funcOr(tfoot.th))}>
                      {funcOr(col.footer)}
                    </Footer.Cell>
                  ))}
                </Footer.Row>
              </Footer>
            ) : (
              isFunction(footer) ? footer({tfoot, columns}) : (footer || null)
            )}
          </>
        )}
      </table>
    </div>
  )
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

}

export default BasicTable;
