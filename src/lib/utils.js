/**
 * Utility functions
 */

// log messages during development
export function devmode(arg, ...more) {
  // to enable, add 'devmode' or 'debug' to url hash
  if (/devmode|debug/i.test(window.location.hash)) {
    if (isFunction(arg)) console.log(arg());
    if (arg) console.log(arg, ...more);
    return true;
  }
  return false;
}

export function toggleDevmode(e) {
  let [, ...parts] = window.location.hash.split(/devmode|debug|#/g);
  // if no parts, just add '#devmode'
  if (!parts.length) {
    window.location.hash = '#devmode';
    window.location.reload();
    return;
  }
  let cleanHash = parts.filter(Boolean).join('#');
  const end = cleanHash.endsWith('/') ? '/' : '';
  parts = cleanHash.split('/#').filter(Boolean);
  cleanHash = parts.join('/#');
  parts = cleanHash.split('#').filter(Boolean);
  cleanHash = parts.join('#').replace(/[/#]+$/, end);
  if (devmode()) {
    window.location.hash = cleanHash;
  } else {
    window.location.hash = cleanHash + '#devmode';
  }
  window.location.reload();
}

// heavy-handed approach to merge classNames without duplicates
export function resolveClassNames(/* classNames1, classNames2, etc */) {
  let classes = [];
  for (let arg of arguments) {
    if (!arg) continue;
    classes.push([].concat(arg).join(' '));
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
        console.warn(`'props' must be an Object`, propsArg);
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
        for (let [styleProp, styleValue] of Object.entries(propsArg.style)) {
          // remove style properties with `null` value
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

const objectString = (o) => Object.prototype.toString.call(o);

const oObject = objectString({});
const oMap = objectString(new Map());

export function isPlainObject(it){
  return objectString(it) === oObject;
}

export function isMap(it) {
  return objectString(it) === oMap;
}

export function isFunction(it) {
  return typeof it == 'function'
}

// let funcOrCount = 0;

export function funcOr(it = null, args = []) {
  // devmode('funcOr', ++funcOrCount);
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

// export function firstString(a, b, c, etc) {
//   for (let arg of arguments) {
//     if (typeof arg == 'string') return arg
//   }
// }
