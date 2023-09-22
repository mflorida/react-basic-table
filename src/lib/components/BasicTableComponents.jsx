import React from 'react';

import {
  mergeProps,
  funcOr,
  firstDefined,
  isFunction
} from '../utils';

// Main component that's used to render everything.
// Using this helps cut down on boilerplate.
function BasicComponent(props) {

  const {
    as = {},
    className = '',
    children,
    cfg,
    ..._props
  } = props;

  as.tag = as.tag || null;
  as.className = [as.className || '', className].join(' ').trim();

  let Component = null;

  if (as.tag) {
    try {
      Component = React.createElement(as.tag, {
        className: as.className,
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
export function Header({ children, ...props }) {
  return (
    <BasicComponent as={{ tag: 'thead', className: 'basic-table-header' }} {...props}>
      {children}
    </BasicComponent>
  )
}

// <thead><tr>
export function HeaderRow({ children, ...props }) {
  return (
    <BasicComponent as={{ tag: 'tr', className: 'basic-table-header-row' }} {...props}>
      {children}
    </BasicComponent>
  )
}
Header.Row = HeaderRow;

// <thead><tr><th|td>
export function HeaderCell(props) {
  const {
    as = 'th',
    children,
    ..._props
  } = props;
  return (
    <BasicComponent as={{ tag: as, className: 'basic-table-header-cell' }} {..._props}>
      {children}
    </BasicComponent>
  )
}

// <tbody>
export function Body({ children, ..._props }) {
  return (
    <BasicComponent as={{ tag: 'tbody', className: 'basic-table-body' }} {..._props}>
      {children}
    </BasicComponent>
  )
}

// <tbody><tr>
export function BodyRow({ children, ..._props }) {
  return (
    <BasicComponent as={{ tag: 'tr', className: 'basic-table-body-row' }} {..._props}>
      {children}
    </BasicComponent>
  )
}
Body.Row = BodyRow;

// <tbody><tr><td>
export function BodyCell({ children, ..._props }) {
  return (
    <BasicComponent as={{ tag: 'td', className: 'basic-table-body-cell' }} {..._props}>
      {children}
    </BasicComponent>
  )
}
Body.Cell = BodyCell;

// <tfoot>
export function Footer({ children, ..._props }) {
  return (
    <BasicComponent as={{ tag: 'tfoot', className: 'basic-table-footer' }} {..._props}>
      {children}
    </BasicComponent>
  )
}

// <tfoot><tr>
export function FooterRow({ children, _props }) {
  return (
    <BasicComponent as={{ tag: 'tr', className: 'basic-table-footer-row' }} {..._props}>
      {children}
    </BasicComponent>
  )
}
Footer.Row = FooterRow;

// <tfoot><tr><th|td>
export function FooterCell(props) {
  const {
    as = 'th',
    children,
    ..._props
  } = props;
  return (
    <BasicComponent as={{ tag: as, className: 'basic-table-footer-cell' }} {..._props}>
      {children}
    </BasicComponent>
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

  const { thead, tbody, tfoot } = tableConfig;

  console.log(tableConfig);

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
              <Header key={'thead'} {...funcOr(thead.__)}>
                <HeaderRow {...funcOr(thead.tr)}>
                  {columns.map((col, colIndex) => (
                    <HeaderCell key={colIndex} {...mergeProps(funcOr(thead.th), funcOr(col.th))}>
                      {funcOr(col.header || col.th?.render || col.th?.children)}
                    </HeaderCell>
                  ))}
                </HeaderRow>
              </Header>
            ) : (
              isFunction(header) ? header({thead, columns}) : (header || null)
            )}

            <Body key={'tbody'} {...tbody.__}>
              {data.map((rowData, rowIndex) => {
                const rowKey = rowData.key || rowIndex;
                return (
                  <BodyRow data-key={rowKey} key={rowKey} {...funcOr(tbody.tr, [rowData, rowIndex])}>
                    {columns.map((col, colIndex) => {
                      const cellKey = rowKey ? (rowKey + colIndex) : colIndex;
                      const cellRender = firstDefined(col.render, col.cell, col.td?.render, col.td?.children, null);
                      const cellProps = mergeProps(funcOr(tbody.td, [rowData, rowIndex]), funcOr(col.td, [rowData, rowIndex]));
                      return cellRender != null ? (
                        <BodyCell key={cellKey} {...cellProps}>
                          {funcOr(cellRender, [rowData, rowIndex])}
                        </BodyCell>
                      ) : (
                        <BodyCell key={cellKey} {...cellProps}>
                          {col.key ? rowData[col.key] : null}
                        </BodyCell>
                      )
                    })}
                  </BodyRow>
                )
              })}
            </Body>

            {footer === true ? (
              <Footer key={'tfoot'} {...funcOr(tfoot.__)}>
                <FooterRow {...funcOr(tfoot.tr)}>
                  {columns.map((col, colIndex) => (
                    <FooterCell key={colIndex} {...mergeProps(funcOr(tfoot.td), funcOr(tfoot.th))}>
                      {funcOr(col.footer)}
                    </FooterCell>
                  ))}
                </FooterRow>
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

Table.Header = Header;
Table.Body = Body;
Table.Footer = Footer;

export const BasicTable = {

  Table,

  Header,
  HeaderRow,
  HeaderCell,

  Body,
  BodyRow,
  Row: BodyRow,
  BodyCell,
  Cell: BodyCell,

  Footer,
  FooterRow,
  FooterCell

}

export default BasicTable;
