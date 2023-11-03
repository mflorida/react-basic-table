# React Basic Table

Sometimes you don't need a huge table component libary. Sometimes you just need
a little help setting up rendering options for your data table.

1) Define array of column options:
    - specify data key
    - specify column header text
    - optionally use a header cell renderer
    - optionally use a body cell renderer
    - sortable?
    - filterable? whole table? by column?
    
2) Pass the column options as a `columns` prop to the `<BasicTable/>` component
    
3) Define optional config object as a `config` prop for customizing the table itself and its
child elements (`thead`, `tbody`, `tfoot`, `tr`, `th`, `td`)

4) Don't forget your data! (either array of objects or 2-D array)

That usually covers a lot of basic use cases. But if you _really_ want extra
functionality, the Basic Table API allows easy customization by passing special values
or functions to props of the `<BasicTable/>` component.

The config should look something like this:

```jsx
const columnsConfig = [
  {
    key: 'username',
    header: 'Username',
    cell: (rowData) => {
      return (
        <Link to={`/users/${rowData.username}`}>
          {userName}
        </Link>
      )
    },
    //sort: true,  // not yet implemented
    //filter: true // not yet implemented
  },
  {
    // most basic usage - data key and header label
    key: 'firstName',
    header: 'First Name'
  },
  {
    key: 'lastName',
    header: 'Last Name'
  },
  {
    // null key means there is no directly 
    // corresponding property in the data object
    key: null,
    header: () => <><Icon type={'postage'}/>Full Address</>,
    cell: ({ street, city, state, zip }) => `${street}, ${city}, ${state} ${zip}`
  },
  {
    key: 'lastLogin',
    header: 'Last Login',
    th: { style: { textAlign: 'center ' } },
    td: { style: { textAlign: 'center', fontFamily: 'monospace' } },
    cell: ({ lastLogin }) => (new Date(lastLogin)).toLocaleString()
  }
]
```


Each column config object can use the following properties:

- `key {string|null}`: the name of the property in the row data to return the value from
  (null if the cell should be rendered with a custom renderer)
  
- `header {string|Function}`: text to show in the column header 
  (may optionally use a function for custom rendering)
  
- `cell? {Function}`: function to use for rendering cell contents. 
  if omitted, the value from the data will be passed as-is

- `th? {object|Function}`: optional object or function with attributes for `thead > th` elements in this column

- `td? {object|Function}`: optional object or function with attributes for `tbody > td` elements in this column

- `footer? {string|Function}`: text to show in the column footer
  (may optionally use a function for custom rendering)

[//]: # "- `sort? {boolean|Function}`: should this column be sortable?"
[//]: #   "(optionally use a custom function for sorting)"

[//]: # "- `filter? {boolean|Function}`: should this column be filterable (using text input element)?"
[//]: #   "(optionally use a custom function for filtering)"

[//]: # "- `footerStyle? {object}`: optional object with custom styles for footer cell"


- - -


The `<BasicTable/>` component can receive an object prop named `config` to customize the 
`<table>` element itself and its structural child elements:

- `table? {object}`: optional attributes for main `<table>` element
- `thead? {object}`: optional attributes for `<thead>` element
- `thead.tr? {object}`: optional props for `<tr>` elements in `<thead>`
- `thead.th? {object}`: optional props for `<th>` elements in `<thead>`
- `tbody? {object}`: optional attributes for `<tbody>` element
- `tbody.tr? {object}`: optional props for `<tr>` elements in `<tbody>`
- `tbody.td? {object}`: optional props for `<td>` elements in `<tbody>`
- `tfoot? {object}`: optional attributes for `<thead>` element
- `tfoot.tr? {object}`: optional props for `<tr>` elements in `<tfoot>`
- `tfoot.td? {object}`: optional props for `<td>` elements in `<tfoot>`

