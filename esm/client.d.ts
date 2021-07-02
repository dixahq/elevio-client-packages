import { WindowElev, OnEventTypes } from './elevio';
declare global {
    interface Window {
        _elev: WindowElev;
    }
}
declare type LoadOptions = {
    urlOverride?: string;
};
declare const ElevioExports: {
    /**
     * Initial setup of Elevio, set's the account id and downloads the elevio script.
     * If autoInitialize is set then, Elevio will initialize.
     */
    load: (accountId: string, options?: LoadOptions) => Promise<WindowElev>;
    /**
     * Disabled Elevio completely, if it was enabled.
     */
    disable: typeof disable;
    /**
     * Enable Elevio if it was disabled.
     */
    enable: typeof enable;
    /**
     * Add a custom module that can open a webpage in the widget, link-out to a website or trigger an event.
     * @param moduleDetails details of module to add.
     */
    addModule: (moduleDetails: import("./elevio").ModuleDetails) => void;
    /**
     * Returns an instance of a button component that can attach itself to a target and trigger an action on click.
     * @param target The DOM node that the button will attach itself to.
     * @param options Options to setup the button.
     */
    buttonComponent: (target: Element, options: import("./elevio").ElevioButtonOptions) => import("./elevio").ElevioElement;
    /**
     * Closes the widget, if open.
     */
    close: () => void;
    /**
     * Close any open popup on the page.
     */
    closeAllPopups: () => void;
    /**
     * Close the popup for given article ID.
     * @param articleId The article ID for the popup that should be closed.
     */
    closePopup: (articleId: string) => void;
    /**
     * Returns a custom element DOM node for the given type that you can embed anywhere on your site.
     */
    component: (options: import("./elevio").ComponentOptions) => Element;
    /**
     * Disables the given modules so they cannot be accessed by the user, even if enabled in the dashboard.
     */
    disableModules: (moduleIds: string[]) => void;
    /**
     * Enables the given modules so they can be accessed by the user.
     * NOTE:
     * Note that this only reverses disableModules. Modules disabled in the dashboard cannot be enabled by this API.
     */
    enableModules: (moduleIds: (string | number)[]) => void;
    /**
     * Hides the given modules so they cannot be seen in the menu by the user, even if enabled.
     */
    hideModules: (moduleIds: (string | number)[]) => void;
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
    initialize: () => void;
    /** Returns whether or not Elevio is supported in this browser. If it is not, Elevio will not load. */
    isSupportedBrowser: () => boolean;
    /** Logs out the current user, reversing any calls to `setUser()`. */
    logoutUser: () => void;
    /**
     * Listen to events emitted by Elevio.
     * Note that this is the only method that can be called before the load event is emitted.
     * See {@link https://api-docs.elevio.help/en/articles/26-on | On} for details about all the different events.
     */
    on: <T extends Readonly<keyof OnEventTypes>>(elevioEvent: T, cb: OnEventTypes[T]) => void;
    /** Open the widget to the last page the user was on. */
    open: () => void;
    /** Open the widget to the article with given ID. */
    openArticle: (articleId: string) => void;
    /** Open the widget to the category with given ID. The ID of the index category is ’index’. */
    openCategory: (categoryId: string) => void;
    /** Open the widget to the home page. */
    openHome: () => void;
    /** Open the widget to the module with given ID. */
    openModule: (moduleId: string) => void;
    /** Open the popup for given article ID. */
    openPopup: (articleId: string) => void;
    /**
     * Returns an instance of a popup component that displays an article next to a target DOM node.
     * See {@link https://api-docs.elevio.help/en/articles/46-popupcomponent | Popup component} for more info.
     */
    popupComponent: (target: Element, options: {
        articleId: string;
    }) => import("./elevio").ElevioElement;
    /** Remove a custom module. */
    removeModule: (uniqueModuleId: string) => void;
    /**
     * Overrides keywords set in the dashboard from {@link https://app.elev.io/pages | page} settings.
     * Can be used to determine which articles are displayed in suggestions.
     */
    setKeywords: (keywords?: string[] | undefined) => void;
    /**
     * Overrides the language that Elevio uses for localization.
     * The language must be both supported and enabled in your dashboard.
     * By default, Elevio uses the user’s system language.
     * Also see {@link https://api-docs.elevio.help/en/articles/42 | setTranslations}.
     * See {@link https://api-docs.elevio.help/en/articles/25-setlanguage | setLanguage} for a list of language codes.
     */
    setLanguage: (languageCode?: string | undefined) => void;
    /**
     * Overrides the page URL, which by default is the browser’s current URL.
     * The URL is used to determine {@link https://app.elev.io/pages | page settings}.
     * You should only use this in rare cases, since Elevio automatically detects browser URL changes.
     */
    setPage: (url?: string | undefined) => void;
    /**
     * Overrides settings from dashboard, and exposes some new settings.
     * @param settings see {@link https://api-docs.elevio.help/en/articles/41-setsettings | Settings}
     */
    setSettings: (setting: Partial<import("./elevio").Nullable<import("./elevio").SettingsOptions>>) => void;
    /**
     * Overrides the translations that Elevio uses for localization.
     * Also see {@see setLanguage}.
     * See {@link https://api-docs.elevio.help/en/articles/42-settranslations | set translations} for a description of the objects shape.
     */
    setTranslations: (translations?: Object | undefined) => void;
    /**
     * Identify the current user. {@link https://api-docs.elevio.help/en/articles/4 | Read more about why.}
     * @param user the user object
     */
    setUser: (user?: Partial<import("./elevio").Nullable<import("./elevio").User>> | undefined) => void;
    /**
     * Shows the given modules so they can be seen in the menu by the user.
     * Reverses calls to hideModules.
     */
    showModules: (moduleIds: (string | number)[]) => void;
    /** Toggle the popup for given article ID. Opens the popup if closed, and vice versa. */
    togglePopup: (aritcleId: string) => void;
    /**
     * Disables helpers so they cannot be seen or used by the user.
     * If helperIds are not provided, all helpers will be disabled.
     * See {@link https://api-docs.elevio.help/en/articles/81-disablehelpers | disableHelpers} for more info.
     * */
    disableHelpers: (helperIds?: number[] | undefined) => void;
    /**
     * Enables helpers so that they can be seen and used by the user.
     * If helperIds are not provided, all helpers will be enabled.
     * See {@link https://api-docs.elevio.help/en/articles/82-enablehelpers | enableHelpers} for more info.
     * */
    enableHelpers: (helperIds?: number[] | undefined) => void;
    /**
     * Identify user that has been set. {@link https://api-docs.elevio.help/en/articles/24 | Set user}
     */
    getUser: () => import("./elevio").Nullable<import("./elevio").User>;
    /**
     * This will reinitialize elevio with the new account id set.
     */
    setAccountId: (accountId: string) => void;
};
export default ElevioExports;
declare function disable(): void;
declare function enable(): void;
