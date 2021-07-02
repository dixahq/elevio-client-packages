var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import Elevio from './client';
import equal from 'fast-deep-equal';
import PropTypes from 'prop-types';
export { Elevio };
// This just keeps track of if the settings has been enabled via the server or settings
// that way when we render the component we know if we need to enable it or not
// NOTE: if the client does _elev.setStettings it won't be picked up by this.
var serverEnabled = undefined;
// TODO:
// * Convert all existing options into props.
//       # Modules + Popups ?
var mountedCount = 0;
var ElevioReact = /** @class */ (function (_super) {
    __extends(ElevioReact, _super);
    function ElevioReact(props) {
        var _this = _super.call(this, props) || this;
        _this.onLoad = function (_elev) {
            _this.props.onLoad && _this.props.onLoad(_elev);
        };
        _this.onReady = function () {
            if (typeof serverEnabled === 'undefined') {
                // @ts-ignore
                serverEnabled = _elev.getSetting('enabled');
            }
            _this.props.onReady && _this.props.onReady();
        };
        _this.onWidgetOpened = function () {
            _this.props.onWidgetOpened && _this.props.onWidgetOpened();
        };
        _this.onWidgetClosed = function () {
            _this.props.onWidgetClosed && _this.props.onWidgetClosed();
        };
        _this.onModuleOpened = function (moduleId) {
            _this.props.onModuleOpened && _this.props.onModuleOpened(moduleId);
        };
        _this.onPopupOpened = function (articleId) {
            _this.props.onPopupOpened && _this.props.onPopupOpened(articleId);
        };
        _this.onPopupClosed = function (articleId) {
            _this.props.onPopupClosed && _this.props.onPopupClosed(articleId);
        };
        _this.onSearchQuery = function (results) {
            _this.props.onSearchQuery && _this.props.onSearchQuery(results);
        };
        _this.onSearchArticleClicked = function (result) {
            _this.props.onSearchArticleClicked &&
                _this.props.onSearchArticleClicked(result);
        };
        _this.onCategoryArticleClicked = function (result) {
            _this.props.onCategoryArticleClicked &&
                _this.props.onCategoryArticleClicked(result);
        };
        _this.onWidgetArticleView = function (articleId) {
            _this.props.onWidgetArticleView && _this.props.onWidgetArticleView(articleId);
        };
        Elevio.on('ready', _this.onReady);
        Elevio.on('widget:opened', _this.onWidgetOpened);
        Elevio.on('widget:closed', _this.onWidgetClosed);
        Elevio.on('module:opened', _this.onModuleOpened);
        Elevio.on('popup:opened', _this.onPopupOpened);
        Elevio.on('popup:closed', _this.onPopupClosed);
        Elevio.on('search:query', _this.onSearchQuery);
        Elevio.on('search:article:clicked', _this.onSearchArticleClicked);
        Elevio.on('category:article:clicked', _this.onCategoryArticleClicked);
        Elevio.on('widget:article:view', _this.onWidgetArticleView);
        return _this;
    }
    ElevioReact.prototype.componentDidMount = function () {
        var _this = this;
        mountedCount++;
        if (mountedCount > 1) {
            console.warn("Multiple instances of the elevio component being rendered, this will lead to unexpected results. Please only use one.");
        }
        var accountId = this.props.accountId;
        var urlOverride = (this.props.developerOptions &&
            this.props.developerOptions.urlOverride) ||
            undefined;
        Elevio.load(accountId, {
            urlOverride: urlOverride,
        }).then(function (_elev) {
            // Wait until Elevio has loaded before setting settings.
            if (_this.props.keywords) {
                Elevio.setKeywords(_this.props.keywords);
            }
            if (_this.props.language) {
                Elevio.setLanguage(_this.props.language);
            }
            if (_this.props.user) {
                Elevio.setUser(_this.props.user);
            }
            if (_this.props.settings) {
                Elevio.setSettings(_this.props.settings);
            }
            if (_this.props.pageUrl) {
                Elevio.setPage(_this.props.pageUrl);
            }
            if (_this.props.translations) {
                Elevio.setTranslations(_this.props.translations);
            }
            if (serverEnabled) {
                Elevio.enable();
            }
            _this.onLoad(_elev);
        });
    };
    ElevioReact.prototype.componentWillUnmount = function () {
        Elevio.disable();
        mountedCount--;
    };
    ElevioReact.prototype.componentDidUpdate = function (prevProps) {
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
            }
            else {
                Elevio.logoutUser();
            }
        }
        if (this.props.accountId !== prevProps.accountId) {
            Elevio.setAccountId(this.props.accountId);
        }
        if (this.props.settings &&
            !equal(this.props.settings, prevProps.settings)) {
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
    };
    ElevioReact.prototype.render = function () {
        return null;
    };
    ElevioReact.propTypes = {
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
    };
    return ElevioReact;
}(React.Component));
export default ElevioReact;
