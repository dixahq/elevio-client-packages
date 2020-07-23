"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elevio = void 0;
var React = __importStar(require("react"));
var client_1 = __importDefault(require("./client"));
exports.Elevio = client_1.default;
var fast_deep_equal_1 = __importDefault(require("fast-deep-equal"));
var prop_types_1 = __importDefault(require("prop-types"));
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
        client_1.default.on('ready', _this.onReady);
        client_1.default.on('widget:opened', _this.onWidgetOpened);
        client_1.default.on('widget:closed', _this.onWidgetClosed);
        client_1.default.on('module:opened', _this.onModuleOpened);
        client_1.default.on('popup:opened', _this.onPopupOpened);
        client_1.default.on('popup:closed', _this.onPopupClosed);
        client_1.default.on('search:query', _this.onSearchQuery);
        client_1.default.on('search:article:clicked', _this.onSearchArticleClicked);
        client_1.default.on('category:article:clicked', _this.onCategoryArticleClicked);
        client_1.default.on('widget:article:view', _this.onWidgetArticleView);
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
        client_1.default.load(accountId, {
            urlOverride: urlOverride,
        }).then(function (_elev) {
            // Wait until Elevio has loaded before setting settings.
            if (_this.props.keywords) {
                client_1.default.setKeywords(_this.props.keywords);
            }
            if (_this.props.language) {
                client_1.default.setLanguage(_this.props.language);
            }
            if (_this.props.user) {
                client_1.default.setUser(_this.props.user);
            }
            if (_this.props.settings) {
                client_1.default.setSettings(_this.props.settings);
            }
            if (_this.props.pageUrl) {
                client_1.default.setPage(_this.props.pageUrl);
            }
            if (_this.props.translations) {
                client_1.default.setTranslations(_this.props.translations);
            }
            if (serverEnabled) {
                client_1.default.enable();
            }
            _this.onLoad(_elev);
        });
    };
    ElevioReact.prototype.componentWillUnmount = function () {
        client_1.default.disable();
        mountedCount--;
    };
    ElevioReact.prototype.componentDidUpdate = function (prevProps) {
        if (!fast_deep_equal_1.default(this.props.keywords, prevProps.keywords)) {
            client_1.default.setKeywords(this.props.keywords);
        }
        if (this.props.language !== prevProps.language) {
            client_1.default.setLanguage(this.props.language);
        }
        // Check the user
        if (!fast_deep_equal_1.default(this.props.user, prevProps.user)) {
            // Either update if user has change, or log them out.
            if (this.props.user) {
                client_1.default.setUser(this.props.user);
            }
            else {
                client_1.default.logoutUser();
            }
        }
        if (this.props.accountId !== prevProps.accountId) {
            client_1.default.setAccountId(this.props.accountId);
        }
        if (this.props.settings &&
            !fast_deep_equal_1.default(this.props.settings, prevProps.settings)) {
            if (this.props.settings.enabled) {
                serverEnabled = this.props.settings.enabled;
            }
            client_1.default.setSettings(this.props.settings);
        }
        if (this.props.pageUrl !== prevProps.pageUrl) {
            client_1.default.setPage(this.props.pageUrl);
        }
        if (!fast_deep_equal_1.default(this.props.translations, prevProps.translations)) {
            client_1.default.setTranslations(this.props.translations);
        }
    };
    ElevioReact.prototype.render = function () {
        return null;
    };
    ElevioReact.propTypes = {
        accountId: prop_types_1.default.string.isRequired,
        options: prop_types_1.default.object,
        keywords: prop_types_1.default.arrayOf(prop_types_1.default.string),
        language: prop_types_1.default.string,
        user: prop_types_1.default.object,
        settings: prop_types_1.default.object,
        pageUrl: prop_types_1.default.string,
        translations: prop_types_1.default.object,
        onLoad: prop_types_1.default.func,
        onReady: prop_types_1.default.func,
        onWidgetOpened: prop_types_1.default.func,
        onWidgetClosed: prop_types_1.default.func,
        onModuleOpened: prop_types_1.default.func,
        onPopupOpened: prop_types_1.default.func,
        onPopupClosed: prop_types_1.default.func,
        onSearchQuery: prop_types_1.default.func,
        onSearchArticleClicked: prop_types_1.default.func,
        onCategoryArticleClicked: prop_types_1.default.func,
        onWidgetArticleView: prop_types_1.default.func,
    };
    return ElevioReact;
}(React.Component));
exports.default = ElevioReact;
