/**
 * Utility functions
 */

// heavy-handed approach to merge classNames without duplicates
export function resolveClassNames(/* classNames1, classNames2, etc */) {
  let classes = [];
  for (let arg of arguments) {
    classes.push([].concat(arg).join(' ').trim());
  }
  return [...(new Set(classes.join(' ').split(/\s+/)))].join(' ');
}

// merge props with special consideration
// for `className`, `style`, `children`, and `render` props
export function mergeProps(a, b, etc) {

  const props = { style: {} };
  const classes = [];

  for (let arg of arguments) {

    // falsey? move on. (should be an object)
    if (!arg) continue;

    let propsArg = arg;

    // don't completely choke if there's an error
    try {

      // if currently iterating props is a function...
      // ...run it (if using a function, it should return an object)
      if (isFunction(arg)) {
        propsArg = arg();
      }

      if (!isPlainObject(propsArg)) {
        console.warn(`'propsArg' must be an Object`, propsArg);
        continue;
      }

      // initial merge
      Object.assign(props, propsArg);

      // have className will push
      if (propsArg.className) {
        classes.push(propsArg.className);
      }

      // pile the styles
      if (propsArg.style) {
        // remove style properties with `null` value
        for (let [styleProp, styleValue] of Object.entries(propsArg.style)) {
          if (styleValue === null) {
            delete propsArg.style[styleProp]
          }
        }
        // add styles
        Object.assign(props.style, propsArg.style);
      }
    }
    catch(e) {
      console.warn('mergProps()', e);
    }

  }

  props.className = resolveClassNames(classes);

  // remove `children` and `render` from new props object
  // (they will still be on the original objects)
  delete props.children;
  delete props.render;

  // return merged props object
  return props;

}

export function isPlainObject(it){
  return Object.prototype.toString.call(it) === '[object Object]'
}

export function isFunction(it) {
  return typeof it == 'function'
}

let funcOrCount = 0;

export function funcOr(it = null, args = []) {
  console.log('funcOr', ++funcOrCount);
  return (
    isFunction(it)
    ? it.apply(null, [].concat(args))
    : it
  )
}

export function firstDefined(a, b, c, etc) {
  let undef;
  for (let arg of arguments) {
    if (arg !== undef) return arg
  }
  return undef;
}

export function firstString(a, b, c, etc) {
  for (let arg of arguments) {
    if (typeof arg == 'string') return arg
  }
}
