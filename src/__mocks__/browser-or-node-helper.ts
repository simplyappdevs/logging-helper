/**
 * Mock interface
 */
export interface BonMockInterface {
  __setValue: (isBrowser: boolean, isNode: boolean, isJsDom: boolean) => void;
  isBrowser: () => boolean;
  isNode: () => boolean;
  isJsDom: () => boolean;
}

/**
 * Sets mock values
 * @param isMockBrowser True to mock running in browser, false otherwise
 * @param isMockNode True to mock running in Node, false otherwsie
 * @param isMockJsDom True to mock running in JsDom, false otherwise
 */
const __setValue = (isMockBrowser: boolean, isMockNode: boolean, isMockJsDom: boolean) => {
  isBrowser = isMockBrowser;
  isNode = isMockNode;
  isJsDom = isMockJsDom;
};

// keep value for JS DOM
let isJsDom: boolean = false;
let isNode: boolean = false;
let isBrowser: boolean = false;

// module
const bonMock: BonMockInterface = {
  __setValue: __setValue,
  isNode: () => {return isNode;},
  isBrowser: () => {return isBrowser;},
  isJsDom: () => {return isJsDom;}
};

// export
export default bonMock;