'use client';

import { Nullable, User, SettingsOptions, OnEventTypes } from './elevio';
import * as React from 'react';
import Elevio from './client';
import equal from 'fast-deep-equal';
import * as PropTypes from 'prop-types';

export { Elevio };

// This just keeps track of if the settings has been enabled via the server or settings
// that way when we render the component we know if we need to enable it or not
// NOTE: if the client does _elev.setSettings it won't be picked up by this.
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
  onLoad?: OnEventTypes['load'];

  /** Called after the Elevio app has been initialised. */
  onReady?: OnEventTypes['ready'];

  /** Called after the widget is opened. */
  onWidgetOpened?: OnEventTypes['widget:opened'];

  /** Called after the widget is closed. */
  onWidgetClosed?: OnEventTypes['widget:closed'];

  onModuleLoaded?: OnEventTypes['module:loaded'];

  /** Called after a module is opened. The callback has the module ID as it’s first argument. */
  onModuleOpened?: OnEventTypes['module:opened'];

  /** Called after a popup is opened. The callback has the article ID as it’s first argument. */
  onPopupOpened?: OnEventTypes['popup:opened'];

  /** Called after a popup is closed. The callback has the article ID as it’s first argument. */
  onPopupClosed?: OnEventTypes['popup:closed'];

  /**
   * Called when results for a search query are shown to user.
   * The callback has an object as it’s first argument, with `query` and `results` properties.
   */
  onSearchQuery?: OnEventTypes['search:query'];

  /**
   * Called when results for a search query is clicked by a user.
   * The callback returns an object with the articleId, categoryId and the source.
   * The source is what is defined in the {@link https://api-docs.elevio.help/en/articles/48 | elevio search element } or defaults to 'custom-element' if not defined.
   * If the link is click inside the assistant then the source is 'assistant'.
   */
  onSearchArticleClicked?: OnEventTypes['search:article:clicked'];

  /**
   * Called when an article is clicked in the category display.
   * The callback returns an object with the articleId, categoryId and the source.
   * The source is what is defined in the elevio category custom element or defaults to 'custom-element' if not defined.
   * If the link is click inside the assistant then the source is 'assistant'.
   */
  onCategoryArticleClicked?: OnEventTypes['category:article:clicked'];

  /**
   * Called after an article is viewed in the widget.
   * The callback has the article ID as it’s first argument.
   */
  onWidgetArticleView?: OnEventTypes['widget:article:view'];

  /**
   * Called when a helper is clicked.
   * The callback returns an object containing `actionId` (the article or module that the helper
   * opens), `type` ('elevioInline' for popup article, 'elevioArticle' for article that opens in
   * Assistant, 'elevioModule' for module that opens in Assistant) and `target` (the Element that the
   * helper is attached to).
   */
  onHelperClicked?: OnEventTypes['helper:clicked'];

  onSuggestionsArticleClicked?: OnEventTypes['suggestions:article:clicked'];
  onRelatedArticleClicked?: OnEventTypes['related:article:clicked'];
  onArticleInterlinkClicked?: OnEventTypes['article:interlink:clicked'];
  onArticleFeedbackReaction?: OnEventTypes['article:feedback:reaction'];
  onArticleFeedbackText?: OnEventTypes['article:feedback:text'];
  onArticleKBlinkClicked?: OnEventTypes['article:kblink:clicked'];
  onPageView?: OnEventTypes['page:view'];
  onArticleDataLoaded?: OnEventTypes['article:data:loaded'];
  onArticleDataError?: OnEventTypes['article:data:error'];
  onCategoryDataLoaded?: OnEventTypes['category:data:loaded'];
  onArticleFeedbackLoading?: OnEventTypes['article:feedback:loading'];
  onArticleFeedbackLoaded?: OnEventTypes['article:feedback:loaded'];
  onArticleFeedbackError?: OnEventTypes['article:feedback:error'];
  onArticleRelatedLoaded?: OnEventTypes['article:related:loaded'];
  onSuggestionsDataLoaded?: OnEventTypes['suggestions:data:loaded'];
  onSuggestionsDataError?: OnEventTypes['suggestions:data:error'];
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
    onModuleLoaded: PropTypes.func,
    onModuleOpened: PropTypes.func,
    onPopupOpened: PropTypes.func,
    onPopupClosed: PropTypes.func,
    onHelperClicked: PropTypes.func,
    onSearchQuery: PropTypes.func,
    onSearchArticleClicked: PropTypes.func,
    onCategoryArticleClicked: PropTypes.func,
    onWidgetArticleView: PropTypes.func,
    onSuggestionsArticleClicked: PropTypes.func,
    onRelatedArticleClicked: PropTypes.func,
    onArticleInterlinkClicked: PropTypes.func,
    onArticleFeedbackReaction: PropTypes.func,
    onArticleFeedbackText: PropTypes.func,
    onArticleKBlinkClicked: PropTypes.func,
    onPageView: PropTypes.func,
    onArticleDataLoaded: PropTypes.func,
    onArticleDataError: PropTypes.func,
    onCategoryDataLoaded: PropTypes.func,
    onArticleFeedbackLoading: PropTypes.func,
    onArticleFeedbackLoaded: PropTypes.func,
    onArticleFeedbackError: PropTypes.func,
    onArticleRelatedLoaded: PropTypes.func,
    onSuggestionsDataLoaded: PropTypes.func,
    onSuggestionsDataError: PropTypes.func,
  };

  constructor(props: Props) {
    super(props);
    Elevio.on('ready', this.onReady);
    Elevio.on('widget:opened', this.onWidgetOpened);
    Elevio.on('widget:closed', this.onWidgetClosed);
    Elevio.on('module:loaded', this.onModuleLoaded);
    Elevio.on('module:opened', this.onModuleOpened);
    Elevio.on('popup:opened', this.onPopupOpened);
    Elevio.on('popup:closed', this.onPopupClosed);
    Elevio.on('search:query', this.onSearchQuery);
    Elevio.on('search:article:clicked', this.onSearchArticleClicked);
    Elevio.on('category:article:clicked', this.onCategoryArticleClicked);
    Elevio.on('widget:article:view', this.onWidgetArticleView);
    Elevio.on('helper:clicked', this.onHelperClicked);

    Elevio.on('suggestions:article:clicked', this.onSuggestionsArticleClicked);
    Elevio.on('related:article:clicked', this.onRelatedArticleClicked);
    Elevio.on('article:interlink:clicked', this.onArticleInterlinkClicked);
    Elevio.on('article:feedback:reaction', this.onArticleFeedbackReaction);
    Elevio.on('article:feedback:text', this.onArticleFeedbackText);
    Elevio.on('article:kblink:clicked', this.onArticleKBlinkClicked);
    Elevio.on('page:view', this.onPageView);
    Elevio.on('article:data:loaded', this.onArticleDataLoaded);
    Elevio.on('article:data:error', this.onArticleDataError);
    Elevio.on('category:data:loaded', this.onCategoryDataLoaded);
    Elevio.on('article:feedback:loading', this.onArticleFeedbackLoading);
    Elevio.on('article:feedback:loaded', this.onArticleFeedbackLoaded);
    Elevio.on('article:feedback:error', this.onArticleFeedbackError);
    Elevio.on('article:related:loaded', this.onArticleRelatedLoaded);
    Elevio.on('suggestions:data:loaded', this.onSuggestionsDataLoaded);
    Elevio.on('suggestions:data:error', this.onSuggestionsDataError);
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
      if (this.props.keywords) Elevio.setKeywords(this.props.keywords);
      if (this.props.language) Elevio.setLanguage(this.props.language);
      if (this.props.user) Elevio.setUser(this.props.user);
      if (this.props.settings) Elevio.setSettings(this.props.settings);
      if (this.props.pageUrl) Elevio.setPage(this.props.pageUrl);
      if (this.props.translations)
        Elevio.setTranslations(this.props.translations);
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

  onReady: OnEventTypes['ready'] = () => {
    if (typeof serverEnabled === 'undefined') {
      // @ts-ignore
      serverEnabled = _elev.getSetting('enabled');
    }
    this.props.onReady && this.props.onReady();
  };
  onLoad: OnEventTypes['load'] = (result) =>
    this.props.onLoad && this.props.onLoad(result);
  onWidgetOpened: OnEventTypes['widget:opened'] = () =>
    this.props.onWidgetOpened && this.props.onWidgetOpened();
  onWidgetClosed: OnEventTypes['widget:closed'] = () =>
    this.props.onWidgetClosed && this.props.onWidgetClosed();
  onModuleLoaded: OnEventTypes['module:loaded'] = (result) =>
    this.props.onModuleLoaded && this.props.onModuleLoaded(result);
  onModuleOpened: OnEventTypes['module:opened'] = (result) =>
    this.props.onModuleOpened && this.props.onModuleOpened(result);
  onPopupOpened: OnEventTypes['popup:opened'] = (result) =>
    this.props.onPopupOpened && this.props.onPopupOpened(result);
  onPopupClosed: OnEventTypes['popup:closed'] = (result) =>
    this.props.onPopupClosed && this.props.onPopupClosed(result);
  onSearchQuery: OnEventTypes['search:query'] = (result) => {
    this.props.onSearchQuery && this.props.onSearchQuery(result);
  };
  onSearchArticleClicked: OnEventTypes['search:article:clicked'] = (result) =>
    this.props.onSearchArticleClicked &&
    this.props.onSearchArticleClicked(result);
  onCategoryArticleClicked: OnEventTypes['category:article:clicked'] = (
    result
  ) =>
    this.props.onCategoryArticleClicked &&
    this.props.onCategoryArticleClicked(result);
  onWidgetArticleView: OnEventTypes['widget:article:view'] = (result) =>
    this.props.onWidgetArticleView && this.props.onWidgetArticleView(result);
  onHelperClicked: OnEventTypes['helper:clicked'] = (result) =>
    this.props.onHelperClicked && this.props.onHelperClicked(result);

  onSuggestionsArticleClicked: OnEventTypes['suggestions:article:clicked'] = (
    result
  ) =>
    this.props.onSuggestionsArticleClicked &&
    this.props.onSuggestionsArticleClicked(result);
  onRelatedArticleClicked: OnEventTypes['related:article:clicked'] = (result) =>
    this.props.onRelatedArticleClicked &&
    this.props.onRelatedArticleClicked(result);
  onArticleInterlinkClicked: OnEventTypes['article:interlink:clicked'] = (
    result
  ) =>
    this.props.onArticleInterlinkClicked &&
    this.props.onArticleInterlinkClicked(result);
  onArticleFeedbackReaction: OnEventTypes['article:feedback:reaction'] = (
    result
  ) =>
    this.props.onArticleFeedbackReaction &&
    this.props.onArticleFeedbackReaction(result);
  onArticleFeedbackText: OnEventTypes['article:feedback:text'] = (result) =>
    this.props.onArticleFeedbackText &&
    this.props.onArticleFeedbackText(result);
  onArticleKBlinkClicked: OnEventTypes['article:kblink:clicked'] = (result) =>
    this.props.onArticleKBlinkClicked &&
    this.props.onArticleKBlinkClicked(result);
  onPageView: OnEventTypes['page:view'] = (result) =>
    this.props.onPageView && this.props.onPageView(result);
  onArticleDataLoaded: OnEventTypes['article:data:loaded'] = (result) =>
    this.props.onArticleDataLoaded && this.props.onArticleDataLoaded(result);
  onArticleDataError: OnEventTypes['article:data:error'] = (result) =>
    this.props.onArticleDataError && this.props.onArticleDataError(result);
  onCategoryDataLoaded: OnEventTypes['category:data:loaded'] = (result) =>
    this.props.onCategoryDataLoaded && this.props.onCategoryDataLoaded(result);
  onArticleFeedbackLoading: OnEventTypes['article:feedback:loading'] = (
    result
  ) =>
    this.props.onArticleFeedbackLoading &&
    this.props.onArticleFeedbackLoading(result);
  onArticleFeedbackLoaded: OnEventTypes['article:feedback:loaded'] = (result) =>
    this.props.onArticleFeedbackLoaded &&
    this.props.onArticleFeedbackLoaded(result);
  onArticleFeedbackError: OnEventTypes['article:feedback:error'] = (result) =>
    this.props.onArticleFeedbackError &&
    this.props.onArticleFeedbackError(result);
  onArticleRelatedLoaded: OnEventTypes['article:related:loaded'] = (result) =>
    this.props.onArticleRelatedLoaded &&
    this.props.onArticleRelatedLoaded(result);
  onSuggestionsDataLoaded: OnEventTypes['suggestions:data:loaded'] = (result) =>
    this.props.onSuggestionsDataLoaded &&
    this.props.onSuggestionsDataLoaded(result);
  onSuggestionsDataError: OnEventTypes['suggestions:data:error'] = (result) =>
    this.props.onSuggestionsDataError &&
    this.props.onSuggestionsDataError(result);

  render() {
    return null;
  }
}

export default ElevioReact;
