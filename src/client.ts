'use client';

import { WindowElev, OnEventTypes, OnEventKey } from './elevio';

declare global {
  interface Window {
    _elev: WindowElev;
  }
}

if (typeof window !== 'undefined') {
  // @ts-ignore
  window._elev = {
    q: [],
    on: function <T extends OnEventKey>(elevioEvent: T, cb: OnEventTypes[T]) {
      window._elev.q.push([elevioEvent, cb]);
    },
  };
}

let loadPromise: Promise<WindowElev> | undefined;
let load = (
  accountId: string,
  options: LoadOptions = {}
): Promise<WindowElev> => {
  // You can only call this once!
  // So just return the promise if they have already called it.
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<WindowElev>((resolve) => {
    window._elev.account_id = accountId;
    window._elev.on<'load'>('load', (_elev) => {
      setupFunctions();
      resolve(_elev);
    });

    const url = (options.urlOverride || MAIN_URL) + accountId;
    createScriptWithUrl(url);
  });

  return loadPromise;
};

// const QS_LOCALHOST = "elevio-version=localhost";
// const location = window.location.href;
const MAIN_URL =
  'https://cdn.elev.io/sdk/bootloader/v4/elevio-bootloader.js?cid=';

function createScriptWithUrl(url: string) {
  const elem = document.createElement('script');

  // TODO: what if no script tags?
  const elemExisting = document.getElementsByTagName('script')[0];
  elem.type = 'text/javascript';
  elem.async = true;
  elem.src = url;

  (elemExisting.parentNode as HTMLScriptElement).insertBefore(
    elem,
    elemExisting
  );
}

type LoadOptions = {
  urlOverride?: string;
};

// This holds all the exported functions, an Object is used, so that we can use no-op functions
// until Elevio has loaded and then we can point to the actual functions.
const ElevioExports = {
  /**
   * Initial setup of Elevio, set's the account id and downloads the elevio script.
   * If autoInitialize is set then, Elevio will initialize.
   */
  load: load,

  /**
   * Disabled Elevio completely, if it was enabled.
   */
  disable: () => {},

  /**
   * Enable Elevio if it was disabled.
   */
  enable: noop as typeof enable,

  /**
   * Add a custom module that can open a webpage in the widget, link-out to a website or trigger an event.
   * @param moduleDetails details of module to add.
   */
  addModule: noop as typeof window._elev.addModule,

  /**
   * Returns an instance of a button component that can attach itself to a target and trigger an action on click.
   * @param target The DOM node that the button will attach itself to.
   * @param options Options to setup the button.
   */
  buttonComponent: noop as typeof window._elev.buttonComponent,

  /**
   * Closes the widget, if open.
   */
  close: noop as typeof window._elev.close,

  /**
   * Close any open popup on the page.
   */
  closeAllPopups: noop as typeof window._elev.closeAllPopups,

  /**
   * Close the popup for given article ID.
   * @param articleId The article ID for the popup that should be closed.
   */
  closePopup: noop as typeof window._elev.closePopup,

  /**
   * Returns a custom element DOM node for the given type that you can embed anywhere on your site.
   */
  component: noop as typeof window._elev.component,

  /**
   * Disables the given modules so they cannot be accessed by the user, even if enabled in the dashboard.
   */
  disableModules: noop as typeof window._elev.disableModules,

  /**
   * Enables the given modules so they can be accessed by the user.
   * NOTE:
   * Note that this only reverses disableModules. Modules disabled in the dashboard cannot be enabled by this API.
   */
  enableModules: noop as typeof window._elev.enableModules,

  /**
   * Hides the given modules so they cannot be seen in the menu by the user, even if enabled.
   */
  hideModules: noop as typeof window._elev.hideModules,

  /**
     * By default, Elevio auto-initializes itself on page load. In rare cases you may want to initialize Elevio yourself.
     * @example
     * ```js
     window._elev.on('load', function(_elev) {
      _elev.setSettings({
        autoInitialize: false,
      });
      setTimeout(function() {
        _elev.initialize();
      }, 10000);
    });
     ```
     */
  initialize: noop as typeof window._elev.initialize,

  /** Returns whether or not Elevio is supported in this browser. If it is not, Elevio will not load. */
  isSupportedBrowser: noop as typeof window._elev.isSupportedBrowser,

  /** Logs out the current user, reversing any calls to `setUser()`. */
  logoutUser: noop as typeof window._elev.logoutUser,

  /**
   * Listen to events emitted by Elevio.
   * Note that this is the only method that can be called before the load event is emitted.
   * See {@link https://api-docs.elevio.help/en/articles/26-on | On} for details about all the different events.
   */
  on: typeof window !== 'undefined' ? window._elev.on : noop,

  /** Open the widget to the last page the user was on. */
  open: noop as typeof window._elev.open,

  /** Open the widget to the article with given ID. */
  openArticle: noop as typeof window._elev.openArticle,

  /** Open the widget to the category with given ID. The ID of the index category is ’index’. */
  openCategory: noop as typeof window._elev.openCategory,

  /** Open the widget to the home page. */
  openHome: noop as typeof window._elev.openHome,

  /** Open the widget to the module with given ID. */
  openModule: noop as typeof window._elev.openModule,

  /** Open the popup for given article ID. */
  openPopup: noop as typeof window._elev.openPopup,

  /**
   * Returns an instance of a popup component that displays an article next to a target DOM node.
   * See {@link https://api-docs.elevio.help/en/articles/46-popupcomponent | Popup component} for more info.
   */
  popupComponent: noop as typeof window._elev.popupComponent,

  /** Remove a custom module. */
  removeModule: noop as typeof window._elev.removeModule,

  /**
   * Overrides keywords set in the dashboard from {@link https://app.elev.io/pages | page} settings.
   * Can be used to determine which articles are displayed in suggestions.
   */
  setKeywords: noop as typeof window._elev.setKeywords,

  /**
   * Overrides the language that Elevio uses for localization.
   * The language must be both supported and enabled in your dashboard.
   * By default, Elevio uses the user’s system language.
   * Also see {@link https://api-docs.elevio.help/en/articles/42 | setTranslations}.
   * See {@link https://api-docs.elevio.help/en/articles/25-setlanguage | setLanguage} for a list of language codes.
   */
  setLanguage: noop as typeof window._elev.setLanguage,

  /**
   * Overrides the page URL, which by default is the browser’s current URL.
   * The URL is used to determine {@link https://app.elev.io/pages | page settings}.
   * You should only use this in rare cases, since Elevio automatically detects browser URL changes.
   */
  setPage: noop as typeof window._elev.setPage,

  /**
   * Overrides settings from dashboard, and exposes some new settings.
   * @param settings see {@link https://api-docs.elevio.help/en/articles/41-setsettings | Settings}
   */
  setSettings: noop as typeof window._elev.setSettings,

  /**
   * Overrides the translations that Elevio uses for localization.
   * Also see {@see setLanguage}.
   * See {@link https://api-docs.elevio.help/en/articles/42-settranslations | set translations} for a description of the objects shape.
   */
  setTranslations: noop as typeof window._elev.setTranslations,

  /**
   * Identify the current user. {@link https://api-docs.elevio.help/en/articles/4 | Read more about why.}
   * @param user the user object
   */
  setUser: noop as typeof window._elev.setUser,

  /**
   * Shows the given modules so they can be seen in the menu by the user.
   * Reverses calls to hideModules.
   */
  showModules: noop as typeof window._elev.showModules,

  /** Toggle the popup for given article ID. Opens the popup if closed, and vice versa. */
  togglePopup: noop as typeof window._elev.togglePopup,

  /**
   * Disables helpers so they cannot be seen or used by the user.
   * If helperIds are not provided, all helpers will be disabled.
   * See {@link https://api-docs.elevio.help/en/articles/81-disablehelpers | disableHelpers} for more info.
   * */
  disableHelpers: noop as typeof window._elev.disableHelpers,

  /**
   * Enables helpers so that they can be seen and used by the user.
   * If helperIds are not provided, all helpers will be enabled.
   * See {@link https://api-docs.elevio.help/en/articles/82-enablehelpers | enableHelpers} for more info.
   * */
  enableHelpers: noop as typeof window._elev.enableHelpers,

  /**
   * Identify user that has been set. {@link https://api-docs.elevio.help/en/articles/24 | Set user}
   */
  getUser: noop as typeof window._elev.getUser,

  /**
   * This will reinitialize elevio with the new account id set.
   */
  setAccountId: noop as typeof window._elev.setAccountId,
};

export default ElevioExports;

function noop(args: any): any {
  if (typeof window === 'undefined') return;
  console.warn(
    'Elevio not loaded yet, please wait until Elevio.load has completed.'
  );
}

function setupFunctions() {
  const _elev = window._elev;

  ElevioExports.addModule = _elev.addModule;
  ElevioExports.buttonComponent = _elev.buttonComponent;
  ElevioExports.close = _elev.close;
  ElevioExports.closeAllPopups = _elev.closeAllPopups;
  ElevioExports.closePopup = _elev.closePopup;
  ElevioExports.component = _elev.component;
  ElevioExports.disableModules = _elev.disableModules;
  ElevioExports.enableModules = _elev.enableModules;
  ElevioExports.hideModules = _elev.hideModules;
  ElevioExports.initialize = _elev.initialize;
  ElevioExports.isSupportedBrowser = _elev.isSupportedBrowser;
  ElevioExports.logoutUser = _elev.logoutUser;
  ElevioExports.on = _elev.on;
  ElevioExports.open = _elev.open;
  ElevioExports.openArticle = _elev.openArticle;
  ElevioExports.openCategory = _elev.openCategory;
  ElevioExports.openHome = _elev.openHome;
  ElevioExports.openModule = _elev.openModule;
  ElevioExports.openPopup = _elev.openPopup;
  ElevioExports.popupComponent = _elev.popupComponent;
  ElevioExports.removeModule = _elev.removeModule;
  ElevioExports.setKeywords = _elev.setKeywords;
  ElevioExports.setLanguage = _elev.setLanguage;
  ElevioExports.setPage = _elev.setPage;
  ElevioExports.setSettings = _elev.setSettings;
  ElevioExports.setTranslations = _elev.setTranslations;
  ElevioExports.setUser = _elev.setUser;
  ElevioExports.showModules = _elev.showModules;
  ElevioExports.togglePopup = _elev.togglePopup;
  ElevioExports.disableHelpers = _elev.disableHelpers;
  ElevioExports.enableHelpers = _elev.enableHelpers;
  ElevioExports.getUser = _elev.getUser;
  ElevioExports.setAccountId = _elev.setAccountId;

  // Extra convenience functions
  ElevioExports.enable = enable;
  ElevioExports.disable = disable;
}

function disable() {
  window._elev.setSettings({
    enabled: false,
  });
}

function enable() {
  window._elev.setSettings({
    enabled: true,
  });
}
