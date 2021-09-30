import {
  Nullable,
  User,
  SettingsOptions,
  WindowElev,
  RenderType,
} from './elevio';
import * as React from 'react';
import Elevio from './client';
import equal from 'fast-deep-equal';
import PropTypes from 'prop-types';

export { Elevio };

// This just keeps track of if the settings has been enabled via the server or settings
// that way when we render the component we know if we need to enable it or not
// NOTE: if the client does _elev.setStettings it won't be picked up by this.
let serverEnabled: boolean | undefined = undefined;

/** All the things you can pass to Elevio */
type Props = {
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
    results: Array<{ category_id: string; id: string; title: string }>;
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

  /**
   * Called when a helper is clicked.
   * The callback returns an object containing `actionId` (the article or module that the helper
   * opens), `type` ('elevioInline' for popup article, 'elevioArticle' for article that opens in
   * Assistant, 'elevioModule' for module that opens in Assistant) and `target` (the Element that the
   * helper is attached to).
   */
  onHelperClicked?: (result: {
    actionId: string;
    type: RenderType;
    target: HTMLElement;
  }) => void;
};

// TODO:
// * Convert all existing options into props.
//       # Modules + Popups ?

let mountedCount = 0;

class ElevioReact extends React.Component<Props> {
  static propTypes = {
    accountId: PropTypes.string.isRequired,
    options: PropTypes.object,
    keywords: PropTypes.arrayOf(PropTypes.string),
    language: PropTypes.string,
    user: PropTypes.object,
    settings: PropTypes.object,
    pageUrl: PropTypes.string,
    translations: PropTypes.object,
    onLoad: PropTypes.func,
    onReady: PropTypes.func,
    onWidgetOpened: PropTypes.func,
    onWidgetClosed: PropTypes.func,
    onModuleOpened: PropTypes.func,
    onPopupOpened: PropTypes.func,
    onPopupClosed: PropTypes.func,
    onSearchQuery: PropTypes.func,
    onSearchArticleClicked: PropTypes.func,
    onCategoryArticleClicked: PropTypes.func,
    onWidgetArticleView: PropTypes.func,
    onHelperClicked: PropTypes.func,
  };

  constructor(props: Props) {
    super(props);
    Elevio.on('ready', this.onReady);
    Elevio.on('widget:opened', this.onWidgetOpened);
    Elevio.on('widget:closed', this.onWidgetClosed);
    Elevio.on('module:opened', this.onModuleOpened);
    Elevio.on('popup:opened', this.onPopupOpened);
    Elevio.on('popup:closed', this.onPopupClosed);
    Elevio.on('search:query', this.onSearchQuery);
    Elevio.on('search:article:clicked', this.onSearchArticleClicked);
    Elevio.on('category:article:clicked', this.onCategoryArticleClicked);
    Elevio.on('widget:article:view', this.onWidgetArticleView);
    Elevio.on('helper:clicked', this.onHelperClicked);
  }

  componentDidMount() {
    mountedCount++;
    if (mountedCount > 1) {
      console.warn(
        `Multiple instances of the elevio component being rendered, this will lead to unexpected results. Please only use one.`
      );
    }

    const { accountId } = this.props;

    const urlOverride =
      (this.props.developerOptions &&
        this.props.developerOptions.urlOverride) ||
      undefined;

    Elevio.load(accountId, {
      urlOverride,
    }).then((_elev) => {
      // Wait until Elevio has loaded before setting settings.

      if (this.props.keywords) {
        Elevio.setKeywords(this.props.keywords);
      }

      if (this.props.language) {
        Elevio.setLanguage(this.props.language);
      }

      if (this.props.user) {
        Elevio.setUser(this.props.user);
      }

      if (this.props.settings) {
        Elevio.setSettings(this.props.settings);
      }

      if (this.props.pageUrl) {
        Elevio.setPage(this.props.pageUrl);
      }

      if (this.props.translations) {
        Elevio.setTranslations(this.props.translations);
      }

      if (serverEnabled) {
        Elevio.enable();
      }
      this.onLoad(_elev);
    });
  }

  componentWillUnmount() {
    Elevio.disable();
    mountedCount--;
  }

  componentDidUpdate(prevProps: Props) {
    if (!equal(this.props.keywords, prevProps.keywords)) {
      Elevio.setKeywords(this.props.keywords);
    }

    if (this.props.language !== prevProps.language) {
      Elevio.setLanguage(this.props.language);
    }

    // Check the user
    if (!equal(this.props.user, prevProps.user)) {
      // Either update if user has change, or log them out.
      if (this.props.user) {
        Elevio.setUser(this.props.user);
      } else {
        Elevio.logoutUser();
      }
    }

    if (this.props.accountId !== prevProps.accountId) {
      Elevio.setAccountId(this.props.accountId);
    }

    if (
      this.props.settings &&
      !equal(this.props.settings, prevProps.settings)
    ) {
      if (this.props.settings.enabled) {
        serverEnabled = this.props.settings.enabled;
      }
      Elevio.setSettings(this.props.settings);
    }

    if (this.props.pageUrl !== prevProps.pageUrl) {
      Elevio.setPage(this.props.pageUrl);
    }

    if (!equal(this.props.translations, prevProps.translations)) {
      Elevio.setTranslations(this.props.translations);
    }
  }

  onLoad = (_elev: WindowElev) => {
    this.props.onLoad && this.props.onLoad(_elev);
  };

  onReady = () => {
    if (typeof serverEnabled === 'undefined') {
      // @ts-ignore
      serverEnabled = _elev.getSetting('enabled');
    }
    this.props.onReady && this.props.onReady();
  };

  onWidgetOpened = () => {
    this.props.onWidgetOpened && this.props.onWidgetOpened();
  };

  onWidgetClosed = () => {
    this.props.onWidgetClosed && this.props.onWidgetClosed();
  };

  onModuleOpened = (moduleId: string) => {
    this.props.onModuleOpened && this.props.onModuleOpened(moduleId);
  };

  onPopupOpened = (articleId: string) => {
    this.props.onPopupOpened && this.props.onPopupOpened(articleId);
  };

  onPopupClosed = (articleId: string) => {
    this.props.onPopupClosed && this.props.onPopupClosed(articleId);
  };

  onSearchQuery = (results: {
    query: string;
    results: Array<{ category_id: string; id: string; title: string }>;
  }) => {
    this.props.onSearchQuery && this.props.onSearchQuery(results);
  };

  onSearchArticleClicked = (result: {
    articleId: string;
    categoryId: string;
    source: string;
  }) => {
    this.props.onSearchArticleClicked &&
      this.props.onSearchArticleClicked(result);
  };

  onCategoryArticleClicked = (result: {
    articleId: string;
    categoryId: string;
    source: string;
  }) => {
    this.props.onCategoryArticleClicked &&
      this.props.onCategoryArticleClicked(result);
  };

  onWidgetArticleView = (articleId: string) => {
    this.props.onWidgetArticleView && this.props.onWidgetArticleView(articleId);
  };

  onHelperClicked = (result: {
    actionId: string;
    type: RenderType;
    target: HTMLElement;
  }) => {
    this.props.onHelperClicked && this.props.onHelperClicked(result);
  };

  render() {
    return null;
  }
}

export default ElevioReact;
