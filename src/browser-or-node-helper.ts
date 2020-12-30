/**
 * 3rd Party imports
 */
import {isBrowser, isJsDom, isNode} from 'browser-or-node';

/**
 * Helper object to allow us to test browser-or-node module by wrapping it
 */
const bon = {
  isNode: () => {return isNode;},
  isBrowser: () => {return isBrowser;},
  isJsDom: isJsDom
};

// export
export default bon;