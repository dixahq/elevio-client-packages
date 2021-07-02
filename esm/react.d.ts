import { Nullable, User, SettingsOptions, WindowElev } from './elevio';
import * as React from 'react';
import Elevio from './client';
import PropTypes from 'prop-types';
export { Elevio };
/** All the things you can pass to Elevio */
declare type Props = {
    /** Your account id, found here {@link https://app.elev.io/installation | Installation} */
    accountId: string;
    developerOptions?: {
        urlOverride?: string;
    };
    /**
     * Overrides keywords set in the dashboard from {@link https://app.elev.io/pages | page} settings.
     * Can be used to determine which articles are displayed in suggestions.
     */
    keywords?: Array<string>;
    /**
     * Overrides the language that Elevio uses for localization.
     * The language must be both supported and enabled in your dashboard.
     * By default, Elevio uses the user’s system language.
     * Also see {@link https://api-docs.elevio.help/en/articles/42 | setTranslations}.
     * See {@link https://api-docs.elevio.help/en/articles/25-setlanguage | setLanguage} for a list of language codes.
     */
    language?: string;
    /**
     * Identify the current user. {@link https://api-docs.elevio.help/en/articles/4 | Read more about why.}
     * @param user the user object
     */
    user?: Partial<Nullable<User>>;
    /**
     * Overrides settings from dashboard, and exposes some new settings.
     * @param settings see {@link https://api-docs.elevio.help/en/articles/41-setsettings | Settings}
     */
    settings?: Partial<Nullable<SettingsOptions>>;
    /**
     * Overrides the page URL, which by default is the browser’s current URL.
     * The URL is used to determine {@link https://app.elev.io/pages | page settings}.
     * You should only use this in rare cases, since Elevio automatically detects browser URL changes.
     */
    pageUrl?: string;
    /**
     * Overrides the translations that Elevio uses for localization.
     * Also see {@see setLanguage}.
     * See {@link https://api-docs.elevio.help/en/articles/42-settranslations | set translations} for a description of the objects shape.
     */
    translations?: Object;
    /**
     * Called after the Elevio script has loaded, but before the Elevio app has been initialised.
     * You should modify initial settings here. As a convenience, the callback has window._elev as it’s first argument.
     */
    onLoad?: (apiInstance: WindowElev) => void;
    /** Called after the Elevio app has been initialised. */
    onReady?: () => void;
    /** Called after the widget is opened. */
    onWidgetOpened?: () => void;
    /** Called after the widget is closed. */
    onWidgetClosed?: () => void;
    /** Called after a module is opened. The callback has the module ID as it’s first argument. */
    onModuleOpened?: (moduleId: string) => void;
    /** Called after a popup is opened. The callback has the article ID as it’s first argument. */
    onPopupOpened?: (articleId: string) => void;
    /** Called after a popup is closed. The callback has the article ID as it’s first argument. */
    onPopupClosed?: (articleId: string) => void;
    /**
     * Called when results for a search query are shown to user.
     * The callback has an object as it’s first argument, with `query` and `results` properties.
     */
    onSearchQuery?: (results: {
        query: string;
        results: Array<{
            category_id: string;
            id: string;
            title: string;
        }>;
    }) => void;
    /**
     * Called when results for a search query is clicked by a user.
     * The callback returns an object with the articleId, categoryId and the source.
     * The source is what is defined in the {@link https://api-docs.elevio.help/en/articles/48 | elevio search element } or defaults to 'custom-element' if not defined.
     * If the link is click inside the assistant then the source is 'assistant'.
     */
    onSearchArticleClicked?: (result: {
        articleId: string;
        categoryId: string;
        source: string;
    }) => void;
    /**
     * Called when an article is clicked in the category display.
     * The callback returns an object with the articleId, categoryId and the source.
     * The source is what is defined in the elevio category custom element or defaults to 'custom-element' if not defined.
     * If the link is click inside the assistant then the source is 'assistant'.
     */
    onCategoryArticleClicked?: (result: {
        articleId: string;
        categoryId: string;
        source: string;
    }) => void;
    /**
     * Called after an article is viewed in the widget.
     * The callback has the article ID as it’s first argument.
     */
    onWidgetArticleView?: (articleId: string) => void;
};
declare class ElevioReact extends React.Component<Props> {
    static propTypes: {
        accountId: PropTypes.Validator<string>;
        options: PropTypes.Requireable<object>;
        keywords: PropTypes.Requireable<(string | null | undefined)[]>;
        language: PropTypes.Requireable<string>;
        user: PropTypes.Requireable<object>;
        settings: PropTypes.Requireable<object>;
        pageUrl: PropTypes.Requireable<string>;
        translations: PropTypes.Requireable<object>;
        onLoad: PropTypes.Requireable<(...args: any[]) => any>;
        onReady: PropTypes.Requireable<(...args: any[]) => any>;
        onWidgetOpened: PropTypes.Requireable<(...args: any[]) => any>;
        onWidgetClosed: PropTypes.Requireable<(...args: any[]) => any>;
        onModuleOpened: PropTypes.Requireable<(...args: any[]) => any>;
        onPopupOpened: PropTypes.Requireable<(...args: any[]) => any>;
        onPopupClosed: PropTypes.Requireable<(...args: any[]) => any>;
        onSearchQuery: PropTypes.Requireable<(...args: any[]) => any>;
        onSearchArticleClicked: PropTypes.Requireable<(...args: any[]) => any>;
        onCategoryArticleClicked: PropTypes.Requireable<(...args: any[]) => any>;
        onWidgetArticleView: PropTypes.Requireable<(...args: any[]) => any>;
    };
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: Props): void;
    onLoad: (_elev: WindowElev) => void;
    onReady: () => void;
    onWidgetOpened: () => void;
    onWidgetClosed: () => void;
    onModuleOpened: (moduleId: string) => void;
    onPopupOpened: (articleId: string) => void;
    onPopupClosed: (articleId: string) => void;
    onSearchQuery: (results: {
        query: string;
        results: Array<{
            category_id: string;
            id: string;
            title: string;
        }>;
    }) => void;
    onSearchArticleClicked: (result: {
        articleId: string;
        categoryId: string;
        source: string;
    }) => void;
    onCategoryArticleClicked: (result: {
        articleId: string;
        categoryId: string;
        source: string;
    }) => void;
    onWidgetArticleView: (articleId: string) => void;
    render(): null;
}
export default ElevioReact;
