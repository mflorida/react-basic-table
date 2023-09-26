/**
 * Utility functions
 */

// log messages during development
export function devmode(arg, ...more) {
  // to enable, add 'devmode' or 'debug' to url hash
  if (/devmode|debug/i.test(window.location.hash)) {
    if (isFunction(arg)) {
      arg();
    } else if (arg) {
      console.log(arg, ...more);
    }
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

// merge props with special consideration for
// `className`, `style`, `children`, and `render` props
export function mergeProps(a, b, etc) {
  const output = {};
  const classes = [];

  for (let current of arguments) {
    // falsey? move on. (should be an object)
    if (!current) continue;

    // don't completely choke if there's an error
    try {
      // if 'current' item is a function...
      // ...run it (it *must* return an object)
      if (isFunction(current)) {
        current = current();
      }

      if (!isPlainObject(current)) {
        console.warn(`'props' must be an Object`, current);
        continue;
      }

      // destructure to pull out 'special' props
      // ('children' and 'render' are destructured to be ignored)
      const {
        className = '',
        style = null,
        children,
        render,
        ...other
      } = current;

      // have className will push
      if (className) {
        classes.push(className);
      }

      // handle style object
      if (style && isPlainObject(style)) {
        output.style = output.style || {};
        for (const [styleProp, styleValue] of Object.entries(style)) {
          // remove style properties with `null` value
          if (styleValue === null) {
            delete output.style[styleProp];
            continue;
          }
          // add non-null styles
          output.style[styleProp] = styleValue;
        }
      }

      // merge remaining props
      Object.assign(output, other);

    } catch (e) {
      console.warn('mergProps()', e);
    }
  }

  if (classes.length) {
    output.className = resolveClassNames(classes);
  }

  // return merged props object
  return output;
}

const objectString = (o) => Object.prototype.toString.call(o);

const oObject = objectString({});
const oMap = objectString(new Map());

export function isPlainObject(it) {
  return objectString(it) === oObject;
}

export function isMap(it) {
  return objectString(it) === oMap;
}

export function isFunction(it) {
  return typeof it == 'function';
}

export function funcOr(it = null, args = []) {
  return (
    isFunction(it)
      ? it.apply(null, [].concat(args))
      : it
  );
}

export function firstDefined(a, b, c, etc) {
  let undef;
  for (let arg of arguments) {
    if (arg !== undef) return arg;
  }
  return undef;
}
