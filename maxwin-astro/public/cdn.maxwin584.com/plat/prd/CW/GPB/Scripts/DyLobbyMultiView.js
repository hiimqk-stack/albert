var gamesData = {
    CategoryId: [],
    GroupId: 0,
    GroupTypeId: 0,
    Page: 0,
    TakeCount: 10,
    LobbyUrl: ''
}

var DyLobbyMultiView = DyLobbyMultiView || (function () {
    return {
        init: function (args) {
            $.extend(this, args);
            gamesData.LobbyUrl = args.lobbyUrl;
            if (args.fromSinglePage) {
                if (typeof _hasCustomMeta == 'undefined') {
                    changeMetaTags(args.gameName + " | " + DyLobbyMultiView.partnerName);
                }
            } else {
                if (typeof _metaInfo === 'object') {
                    changeMetaTags(_metaInfo, args.gameName);
                    changeOgXMetaTitleDesc(_metaInfo, args.gameName);
                } else if (typeof _hasCustomMeta == 'undefined') {
                    changeMetaTags(args.gameName + " | " + DyLobbyMultiView.trns.DyLobbyGames + " | " + DyLobbyMultiView.partnerName);
                }
            }
        }
    }
}());
var searchTxt = '';
var dlSearchTimeOut = '';
var allowLazyLoad = false;
var addGameClickLock = true;
var allowSliderGamesLazyLoad = true;
var allowClick = true;
var allowChangeGameView = true;
var gvItem = '';
var allowAggLaunch = true;
var allowGvClose = true;
var gamesByGroupData = {
    input: []
};

function openModalPopup(content, classname) {
    searchTxt = '';
    gamesData.Page = 0;
    gamesData.SearchText = '';
    gamesData.CategoryId = [];
    let defaultGroup = $(content).find('.js_dl_groups.default')[0];
    if (defaultGroup == undefined) {
        defaultGroup = $(content).find('.js_dl_groups')[0]
    }
    gamesData.CategoryId.push($(content).find('.js_dl_categories')[0].dataset.id);
    gamesData.GroupId = defaultGroup.dataset.id;
    gamesData.GroupTypeId = defaultGroup.dataset.typeId;
    gamesData.TakeCount = defaultGroup.dataset.takeCount;
    GetGames('js_add_games_lobby');

    var modal = '<div class="lca-gv-modal ' + classname + '" id="js_gv_modal"><div class="lca-gv-modal-content bg-tert">' +
        '<div class="lca-gv-modal-header" > <h2 class="lca-gv-modal-title">' + DyLobbyMultiView.trns.AddGame + '</h2>' +
        '<button class="lca-gv-modal-close" id="js_modal_close"></button ></div > ' + content +
        '<div></div>';
    $(modal).hide().appendTo($('body')).fadeIn();
    let defaultGroupInBody = $('body').find('.js_dl_groups.default')[0];
    if (defaultGroupInBody == undefined) {
        defaultGroupInBody = $('body').find('.js_dl_groups')[0];
    }
    defaultGroupInBody.classList.add('active')
    $('body').find('.js_dl_categories')[0].classList.add('active');
    if (document.getElementById('js_add_game_groups_nav').offsetWidth < document.getElementById('js_add_game_groups_nav').scrollWidth) {
        document.getElementById('js_groups_nav_right_btn').classList.remove('lca-disabled');
        document.getElementById('js_add_game_groups_nav').removeEventListener('wheel', addGameGroupsNavScroll)
        document.getElementById('js_add_game_groups_nav').addEventListener('wheel', addGameGroupsNavScroll)
    }
}

function drawGames(contId, games, append) {
    var html = '';
    if (games.length > 0) {
        $('#' + contId).addClass('lca-games-grid lca-games-grid-col-4');
        for (var i = 0; i < games.length; i++) {
            var langHtml = '';
            for (var l = 0; l < games[i].LanguageIds.length; l++) {
                langHtml += '<div class="lca-card-flag ' + games[i].LanguageIds[l].toLowerCase() + '" style="background-image: url(' + DyLobbyMultiView.cdnUrl + 'Img/sprites/flags_sprite.png)"></div>';
            }
            let cdn = games[i].UseRmCdn ? DyLobbyMultiView.RmCdnUrl : DyLobbyMultiView.cdnUrl;
            html += '<div class="lca-gv-card">' +
                '<div class="lca-gv-card-body"> ' +
                '<img class="w-100 lca-gv-card-img animated" src="' + cdn + games[i].Image + '" alt="' + games[i].Description + '">' +
                '</div> ' +
                '<div class="lca-gv-card-hover animate js_add_game_to_gv" data-href="' + games[i].URL + '" data-game-id ="' + games[i].Id + '">' +
                '<div class="lca-gv-card-hover-header">' +
                '<div class="lca-gv-card-name">' + games[i].Description + '</div>' +
                '<div class="lca-gv-card-badge-wrapper">' + CreateBadges(games[i].BadgeTypeIds) + '</div>' +
                '</div>' +
                '<span class="lca-gv-card-add-game"><i class="dynamic_icon">&#58160</i></span>' +
                '<div class="lca-gv-card-hover-footer d-flex">';
            if (games[i].MinMaxLimits[0] == '0' && games[i].MinMaxLimits[1] == '0') {
                html += '<div class="lca-gv-card-price d-flex" ><span class="no-rtl-needed"></span><span class="currency_icon"></span></div>';
            } else {
                html += '<div class="lca-gv-card-price d-flex" ><span class="no-rtl-needed">' + games[i].MinMaxLimits[0] + ' - ' + games[i].MinMaxLimits[1] + '</span><span class="currency_icon ' + DyLobbyMultiView.currencyCode + '"></span></div>';
            }
            html += '<div class="lca-gv-card-flag-wrapper">' + langHtml + '</div> ' +
                '</div >' +
                '</div >' +
                '</div>';
        }
    } else {
        $('#' + contId).removeClass('lca-games-grid');
        if (gamesData.GroupTypeId == DyLobbyMultiView.favoriteGroupType) {
            html += '<div class="casino_nav_fav_game_not_found "><img src="' + DyLobbyMultiView.cdnUrl + 'Img/icons/redesign/favorite_big_star.svg"/><span>' + DyLobbyMultiView.trns.YouHaveNoFavoriteGames + '</span></div>';
        } else if (gamesData.SearchText != '') {
            html += '<div class="lca-filter-no-result text-center"><span class="search__icon"></span><p>' + DyLobbyMultiView.trns.NoSearchResults + '</p></div>';
        } else if (gamesData.GroupTypeId == DyLobbyMultiView.lastPlayedGroupType) {
            html += '<div class="casino_nav_fav_game_not_found "><p class="last-played-icon dynamic_icon">&#57944</p><span>' + DyLobbyMultiView.trns.YouHaveNoLastPlayedGames + '</span></div>';
        } else {
            html += '<div class="lca-no-game"><span class="ic_no-game"></span><p>' + DyLobbyMultiView.trns.NoSuchGameFound + '</p></div>';
        }

    }

    if (append) {
        $('#' + contId).append(dlAnimate(html));
    } else {
        $('#' + contId).html(dlAnimate(html));
    }
}

function setCatInfo(catInfo) {
    var catDivs = $('.js_dl_categories');
    if (DyLobbyMultiView.showGamesCount) {
        catDivs.children('.js_dl_cat_count').html('');
    }
    catDivs.parent().addClass('hidden');
    var openPrvBtn = document.getElementById('js_open_prvs_btn');
    for (let j = 0; j < catDivs.length; j++) {
        if (openPrvBtn) {
            if (catDivs[0].offsetTop < catDivs[j].offsetTop) {
                openPrvBtn.classList.remove('lca-disabled');
            }
        }
        for (let c = 0; c < catInfo.length; c++) {
            if ($(catDivs[j]).attr('data-id') == catInfo[c].Id) {
                if (DyLobbyMultiView.showGamesCount) {
                    $(catDivs[j]).children('.js_dl_cat_count').html(' <span class="lca-line">|</span> ' + catInfo[c].GamesCount);
                }
                $(catDivs[j]).parent().removeClass('hidden');
            }
        }
    }
    var tabViewSrcElem = document.getElementById('js_add_game_provs_nav_tab_view');
    var openPrvsBtn = document.getElementById('js_open_prvs_btn');

    if (tabViewSrcElem) {
        setScrollBtnsClass(tabViewSrcElem, tabViewSrcElem.scrollLeft, 'js_provs_nav_left_btn', 'js_provs_nav_right_btn', 'js_provs_nav_shadow');
        tabViewSrcElem.removeEventListener('wheel', addGameProvsNavScroll)
        tabViewSrcElem.addEventListener('wheel', addGameProvsNavScroll)
    } else if (openPrvsBtn) {
        let twoOrMoreRaws = false;
        for (let j = 0; j < catDivs.length; j++) {
            if (catDivs[0].offsetTop < catDivs[j].offsetTop) {
                twoOrMoreRaws = true;
                openPrvsBtn.classList.remove('lca-disabled');
                if (catDivs[j].classList.contains('active')) {
                    openPrvsBtn.classList.add('open');
                    document.getElementById('js_provs_nav_shadow').classList.remove('closed');
                }
            } else if (!twoOrMoreRaws) {
                openPrvsBtn.classList.add('lca-disabled');
            }
        }
    }
}

function drawGamesAndSetCatInfo(contId, games, catInfo, append, _callback) {
    setCatInfo(catInfo);
    if (_callback) {
        _callback(contId, games, append);
    }

    document.getElementById('js_add_games_lobby_cont').removeEventListener('scroll', loadGamesOnScroll);

    document.getElementById('js_add_games_lobby_cont').addEventListener('scroll', loadGamesOnScroll);
}

function loadGamesOnScroll() {

    if ($('#js_add_games_lobby_cont')[0].scrollHeight - $('#js_add_games_lobby_cont').scrollTop() <= $('#js_add_games_lobby_cont').outerHeight() + 100) {
        if (allowLazyLoad) {
            allowLazyLoad = false;
            gamesData.Page++;
            GetGames('js_add_games_lobby', true);
        }
    }
}

function loadLPSliderGamesOnScroll() {
    var self = this;
    if (self.scrollHeight - $(self).scrollTop() <= $(self).outerHeight() + 30) {
        if (allowSliderGamesLazyLoad && self.dataset.hasNext.toLowerCase() == 'true') {
            allowSliderGamesLazyLoad = false;
            var page = Number(self.dataset.page);
            gamesByGroupData.input[0] = {
                GroupId: self.dataset.id,
                GroupTypeId: self.dataset.typeId,
                TakeCount: 16,
                Page: page + 1
            }
            GetGamesByGroup(self);
        }
    }
}

function GetGamesByGroup(cont) {
    $.ajax({
        type: "POST",
        data: gamesByGroupData,
        url: "/DynamicLobbyHelper/GetGamesByGroup",
        success: function (result) {
            for (var i = 0; i < result.length; i++) {
                cont.dataset.page = gamesByGroupData.input[0].Page;
                cont.dataset.hasNext = result[i].HasNext;
                drawSliderGames(cont, result[i].GamesOutput);
                allowSliderGamesLazyLoad = true;
            }
        }
    });
}

function GetGames(contId, append, allowSetCatActiveClass) {
    $.ajax({
        type: "POST",
        data: gamesData,
        url: "/DynamicLobbyHelper/GetDesktopGames",
        success: function (result) {
            let notEmptyActiveCats = [];
            let catInfo = result.CategoryInfo;
            for (var c = 0; c < catInfo.length; c++) {
                if (gamesData.CategoryId.includes(catInfo[c].Id.toString())) {
                    notEmptyActiveCats.push(catInfo[c].Id.toString());
                }
            }

            if (notEmptyActiveCats.length > 0) {
                gamesData.CategoryId = notEmptyActiveCats;
                drawGamesAndSetCatInfo(contId, result.GamesOutput, result.CategoryInfo, append, drawGames);
                allowLazyLoad = result.HasNext;
                if (allowSetCatActiveClass) {
                    $('.js_dl_categories').removeClass('active');
                    for (var i = 0; i < $('.js_dl_categories').length; i++) {
                        for (var j = 0; j < gamesData.CategoryId.length; j++) {
                            if ($('.js_dl_categories')[i].dataset.id == gamesData.CategoryId[j]) {
                                $('.js_dl_categories')[i].classList.add('active');
                            }
                        }
                    }
                    let scrPrNavElem = document.getElementById('js_add_game_provs_nav_tab_view');
                    if (scrPrNavElem) {
                        $('#js_add_game_provs_nav_tab_view').animate({ scrollLeft: $('.js_dl_categories.active')[0].offsetLeft - 40 }, 0);
                        setScrollBtnsClass(scrPrNavElem, scrPrNavElem.scrollLeft, 'js_provs_nav_left_btn', 'js_provs_nav_right_btn', 'js_provs_nav_shadow');
                    }
                }
            } else {
                gamesData.CategoryId = ['0'];
                GetGames('js_add_games_lobby', false, true);
                let scrPrNavElem = document.getElementById('js_add_game_provs_nav_tab_view');
                if (scrPrNavElem) {
                    $('#js_add_game_provs_nav_tab_view').animate({ scrollLeft: 0 }, 0);
                    setScrollBtnsClass(scrPrNavElem, scrPrNavElem.scrollLeft, 'js_provs_nav_left_btn', 'js_provs_nav_right_btn', 'js_provs_nav_shadow');
                }
            }
        }
    });
}

function drawSliderGames(cont, games) {
    var html = '';
    for (var i = 0; i < games.length; i++) {
        var langHtml = '';
        for (var l = 0; l < games[i].LanguageIds.length; l++) {
            langHtml += '<div class="lca-card-flag ' + games[i].LanguageIds[l].toLowerCase() + '"style="background-image: url(' + DyLobbyMultiView.cdnUrl + 'Img/sprites/flags_sprite.png)"></div>';
        }
        let cdn = games[i].UseRmCdn ? DyLobbyMultiView.RmCdnUrl : DyLobbyMultiView.cdnUrl;

        html += `<div class="lca-gv-card">
                <div class="lca-gv-card-body"><img class="w-100 lca-gv-card-img animated" src="${cdn + games[i].Image}" alt="${games[i].Description}"></div>
                <div class="lb_card_topitems absolute flex_center_between">${games[i].Badges}</div>
                <div class="lca-gv-card-hover animate js_add_game_from_left_part" data-href="${games[i].URL}" data-game-id="${games[i].Id}">
                <div class="lca-gv-card-hover-header"><div class="lca-gv-card-name">${games[i].Description}</div></div>
                <span class="lca-gv-card-add-game"><i class="dynamic_icon">&#58160</i><span class="lca-card-play-text">${DyLobbyMultiView.trns.Play}</span></span>
                <div class="lca-gv-card-hover-footer d-flex">`;
        if (games[i].MinMaxLimits[0] == '0' && games[i].MinMaxLimits[1] == '0') {
            html += '<div class="lca-gv-card-price d-flex"><span class="no-rtl-needed"></span><span class="currency_icon"></span></div>';
        } else {
            html += '<div class="lca-gv-card-price d-flex"><span class="no-rtl-needed">' + games[i].MinMaxLimits[0] + ' - ' + games[i].MinMaxLimits[1] + '</span><span class="currency_icon ' + DyLobbyMultiView.currencyCode + '"></span></div>';
        }
        html += '<div class="lca-gv-card-flag-wrapper">' + langHtml + '</div></div></div></div>';
    }
    $(cont).append(html);
}

function searchGames(input) {
    var val = input.value.replace(/\s\s+/g, ' ');
    if (!isSearchInutTextValid(input, val) || searchTxt == val || (val != '' && val.charAt(0) == ' ')) {
        return;
    }
    searchTxt = val;
    clearTimeout(dlSearchTimeOut);
    dlSearchTimeOut = setTimeout(function () {
        document.getElementById('js_add_games_lobby_cont').scrollTo({ top: 0, behavior: 'smooth' });
        gamesData.SearchText = searchTxt;
        gamesData.Page = 0;
        GetGames('js_add_games_lobby');
    }, 400);
}

function isSearchInutTextValid(input, text) {
    const regex = new RegExp("^[A-Za-z0-9 '&!-]*$");
    if (regex.test(text)) {
        if (document.getElementById('js_search_msg')) {
            document.getElementById('js_search_msg').remove();
        }
        return true;
    } else {
        if (!document.getElementById('js_search_msg')) {
            var elem = document.createElement('span');
            elem.id = 'js_search_msg';
            elem.innerHTML = DyLobbyMultiView.trns.UseLatinLettersInSearch;
            input.parentNode.appendChild(elem);
        }
        return false;
    }
}

function createGameView(count) {
    var html = '';
    $.ajax({
        url: "/DynamicLobbyHelper/GetGVAvailableGroupsAndGames",
        type: "POST",
        data: "gamesTakeCount=4&place=1&lobbyUrl=" + DyLobbyMultiView.lobbyUrl,
        success: function (result) {
            for (var i = 0; i < count; i++) {
                html += '<div class="lca-gv-container-item js_game_view_item"><div class="lca-gv-game-card js_game_view_item_inner">' + result + '</div></div>';
            }
            $('#js_game_view_cont').append(dlAnimate(html));
            allowChangeGameView = true;
        }
    });
}

function createGameCardContent(cont) {
    $.ajax({
        url: "/DynamicLobbyHelper/GetGVAvailableGroupsAndGames",
        type: "POST",
        data: "gamesTakeCount=4&place=1&lobbyUrl=" + DyLobbyMultiView.lobbyUrl,
        success: function (result) {
            $(cont).html(dlAnimate(result));
            allowGvClose = true;
        }
    });
}

function createGameBtnBlock(data, wrId) {
    var html = '';
    var likeClass = '';
    var favClass = '';
    if (data.IsLiked) {
        likeClass = 'active';
    }
    if (data.IsFavorite) {
        favClass = 'active';
    }
    html = '<div class="lca-gv-game-btn-block  d-flex justify-content-between align-items-center"> <h1 class="lca-gv-game-title">' + data.Name + '</h1>' +
        '<div class="lca-gv-game-btns d-flex align-items-center">' +
        '<span class="hand_icon js_mv_game_like ' + likeClass + '" title="' + DyLobbyMultiView.trns.Like + '"><span class="like-count js_game_likes_count">' + data.LikesCount + '</span></span>' +
        '<span class="star_icon js_mv_game_fav ' + favClass + '" title="' + DyLobbyMultiView.trns.AddToFavorites + '"></span>' +
        '<span class="sync_icon js_reload_game" title="' + DyLobbyMultiView.trns.Reload + '"></span>' +
        '<span class="fullscreen_icon js_to_full_screen" title="' + DyLobbyMultiView.trns.FullScreen + '"></span>' +
        '<span class="copy_icon js_to_new_window" title="' + DyLobbyMultiView.trns.OpenInNewWindow + '"></span>' +
        '<span class="close_icon js_gv_close" title="' + DyLobbyMultiView.trns.Close + '"></span>' +
        '</div></div>';
    if (data.ProviderId == 13) {
        html += '<div id="' + wrId + '" class="js_iframe_wrapper lca-iframe-wrapper"></div><script id="jsndvjvnsd" type="text/javascript" src="' + data.LaunchData.ScriptUrl + '"></script>';
    } else {
        html += '<iframe src="' + data.LuanchUrl + '" allowFullScreen></iframe>';
    }
    return html;
}

function gameViewToOne() {
    var gvItems = $('.js_game_view_item');
    var gvItemsCount = $('.js_game_view_item').length;
    var gvItemsWithGames = $('.js_game_view_item[data-has-game="true"]');
    if (gvItemsWithGames.length > 1) {
        showWarnMessage(DyLobbyMultiView.trns.ToSwitchGameMode)
        allowChangeGameView = true;
        return false;
    } else {
        for (var i = 0; i < gvItems.length; i++) {
            if (gvItems[i].dataset.hasGame != 'true' && gvItemsCount > 1) {
                gvItems[i].remove();
                gvItemsCount = $('.js_game_view_item').length;
            }
        }
        $('.js_game_view_item').addClass('one-item');
        if ($('.js_game_view_item')[0].dataset.advancedview && $('.js_game_view_item')[0].dataset.advancedview.toLocaleLowerCase() == 'true') {
            $('#js_gv_main').addClass('lca-advanced-view');
        } else {
            $('#js_gv_main').removeClass('lca-advanced-view');
        }
        allowChangeGameView = true;
        DyLobbyMultiView.allowChangeHeight = true;
        return true;
    }
}

function gameViewToTwo() {
    removeIframesHeights()
    DyLobbyMultiView.allowChangeHeight = false;
    $('#js_gv_main').removeClass('lca-advanced-view');
    $('.js_game_view_item').removeClass('one-item');
    $('#js_gv').removeClass('lca-gv-scroll');
    var gvItemsCount = $('.js_game_view_item').length;
    if (gvItemsCount == 1) {
        createGameView(1);
        return true;
    } else if (gvItemsCount == 4) {
        var gvItems = $('.js_game_view_item');
        var gvItemsCount = $('.js_game_view_item').length;
        var gvItemsWithGames = $('.js_game_view_item[data-has-game="true"]');
        if (gvItemsWithGames.length > 2) {
            showWarnMessage(DyLobbyMultiView.trns.ToSwitchGameMode)
            allowChangeGameView = true;
            return false;
        } else {
            for (var j = 0; j < gvItems.length; j++) {
                if (gvItems[j].dataset.hasGame != 'true' && gvItemsCount > 2) {
                    gvItems[j].remove();
                    gvItemsCount = $('.js_game_view_item').length;
                }
            }
            allowChangeGameView = true;
            return true;
        }
    }
}

function gameViewToFour() {
    removeIframesHeights()
    DyLobbyMultiView.allowChangeHeight = false;
    $('#js_gv_main').removeClass('lca-advanced-view');
    $('.js_game_view_item').removeClass('one-item');
    $('#js_gv').removeClass('lca-gv-scroll');
    var openedGamesCount = $('.js_game_view_item').length;
    createGameView(4 - openedGamesCount);
    return true;
}

function removeIframesHeights() {
    let gvCont = document.getElementById('js_game_view_cont');
    let iframeElems = gvCont.getElementsByTagName('iframe');
    for (let c = 0; c < iframeElems.length; c++) {
        iframeElems[c].style.removeProperty('height');
    }
}

function addGameGroupsNavScroll(e) {
    var scrNavElem = document.getElementById('js_add_game_groups_nav');
    var scrLeft = scrNavElem.scrollLeft;
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    scrNavElem.scrollLeft -= (delta * 40);
    setScrollBtnsClass(scrNavElem, scrLeft, 'js_groups_nav_left_btn', 'js_groups_nav_right_btn', 'js_groups_nav_shadow');
    e.preventDefault();
}

function addGameProvsNavScroll(e) {
    var scrNavElem = document.getElementById('js_add_game_provs_nav_tab_view');
    var scrLeft = scrNavElem.scrollLeft;
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    scrNavElem.scrollLeft -= (delta * 40);
    setScrollBtnsClass(scrNavElem, scrLeft, 'js_provs_nav_left_btn', 'js_provs_nav_right_btn', 'js_provs_nav_shadow');
    e.preventDefault();
}

function closeGVModal() {
    $('#js_gv_modal').fadeOut();
    setTimeout(function () { $('#js_gv_modal').remove(); }, 450)
}

function closeWarnMessage() {
    $('#gv_warn_popup').fadeOut();
    setTimeout(function () { $('#gv_warn_popup').remove(); }, 450)
}

function showWarnMessage(text) {
    var modal = '<div class="lca-gv-modal" id="gv_warn_popup"><div class="lca-gv-modal-content bg-tert lca-gv-warn"> ' +
        '<p class="lca-gv-warn-text"> ' + text + '</p >' +
        '<div class="lca-gv-warn-btn-wrapper">' +
        '<button type="button" class="lca-gv-warn-btn h-bg-primary" id="js_close_gv_warn_popup">OK</button > ' +
        '</div></div></div> ';
    $(modal).hide().appendTo($('body')).fadeIn();
}

function closeOpenNewWindowWarnMessage() {
    $('body').removeClass('ofh');
    $('#gv_onw_warn_popup').fadeOut();
    setTimeout(function () { $('#gv_onw_warn_popup').remove(); }, 450)
}

function showOpenNewWindowWarnMessage(text) {
    var modal = '<div class="lca-gv-modal" id="gv_onw_warn_popup"><div class="lca-gv-modal-content bg-tert lca-gv-warn"> ' +
        '<p class="lca-gv-warn-text"> ' + text + '</p >' +
        '<div class="lca-gv-warn-btn-wrapper">' +
        '<button type="button" class="lca-gv-warn-btn h-bg-secondary lca-gv-back-btn" id="js_to_new_window_cancel">' + DyLobbyMultiView.trns.GoBack + '</button > ' +
        '<button type="button" class="lca-gv-warn-btn h-bg-primary" id="js_to_new_window_confirm">' + DyLobbyMultiView.trns.Open + '</button > ' +
        '</div > </div></div> ';
    $(modal).hide().appendTo($('body')).fadeIn();
}

function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        document.removeEventListener('fullscreenchange', fullScreenChangeHandler);
        document.addEventListener('fullscreenchange', fullScreenChangeHandler);
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        document.removeEventListener('webkitfullscreenchange', fullScreenChangeHandler);
        document.addEventListener('webkitfullscreenchange', fullScreenChangeHandler);
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        document.removeEventListener('MSFullscreenChange', fullScreenChangeHandler);
        document.addEventListener('MSFullscreenChange', fullScreenChangeHandler);
        elem.msRequestFullscreen();
    }
    elem.classList.add('lca_full_screan');
    let iframe = elem.getElementsByTagName('iframe')[0];
    iframe.removeAttribute('style');
}

function fullScreenChangeHandler() {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        $('.js_game_view_item_inner').removeClass('lca_full_screan');
    }
}

function launchGame(gameUrl, cont) {

    $.ajax({
        url: "/Play/LaunchGame",
        type: "POST",
        data: 'gameUrl=' + gameUrl + '&isReal=' + DyLobbyMultiView.isRealMode + '&lobbyUrl=' + DyLobbyMultiView.lobbyUrl,
        success: function (result) {
            if (result && result.Success) {
                let wrId = 'game_wrapper_' + Date.now();
                if (DyLobbyMultiView.lobbyUrl != undefined) {
                    ChangeToAddedGameUrl(gameUrl + '-' + DyLobbyMultiView.lobbyUrl);
                } else {
                    ChangeToAddedGameUrl(gameUrl);
                }
                if (typeof _metaInfo === 'object') {
                    changeOgXMetaTitleDesc(_metaInfo, result.Game.Name);
                    changeMetaTags(_metaInfo, result.Game.Name);
                } else if (typeof _hasCustomMeta == 'undefined') {
                    changeMetaTags(result.Game.Name + " | " + DyLobbyMultiView.trns.DyLobbyGames + " | " + DyLobbyMultiView.partnerName);
                }
                $(cont).html(createGameBtnBlock(result.Game, wrId));
                if (result.Game.ProviderId == 13) {
                    waitForElem('#' + wrId).then(LaunchAggGame(result.Game, wrId));
                }
                
                if (result.Game.OpenInAdvancedView) {
                    $('#js_gv_main').addClass('lca-advanced-view');
                    $('#js_gv_main .js_game_view_item')[0].dataset.advancedview = 'true';
                } else {
                    $('#js_gv_main').removeClass('lca-advanced-view');
                    $('#js_gv_main .js_game_view_item')[0].dataset.advancedview = 'false';
                }
                    
                if (result.Game.DefaultRatio == 1) {
                    $('#js_gv_main').addClass('ratio_widescreen');
                } else {
                    $('#js_gv_main').removeClass('ratio_widescreen');
                }
                $(cont).parents('.js_game_view_item')[0].dataset.gameName = result.Game.Name;
                $('.js_game_view_item_inner').removeClass('place_to_add');
            } else {
                showWarnMessage(result.Message);
            }
        }
    });

}

function launchGameInNewWindow(gameUrl) {
    return $.ajax({
        url: "/Play/LaunchGame",
        type: "POST",
        data: 'gameUrl=' + gameUrl + '&isReal=' + DyLobbyMultiView.isRealMode + '&lobbyUrl=' + DyLobbyMultiView.lobbyUrl,
    });
}
function openLogin() {
    if (DyLobbyMultiView.hasStaticLoginPage) {
        document.location.href = '/Login/Login';
    } else {
        showPopup('/Login/Login', 'loginContent', {
            position: null,
            dialogClass: 'tl_popup_dialog js_popup_dialog flex_popup_content',
            responsive: false,
        });
    }
}

function setScrollBtnsClass(scrElem, scrLeft, leftBtn, rightBtn, shadowBtn) {

    let offWidth = scrElem.offsetWidth;
    let scrWidth = scrElem.scrollWidth;
    let firstCondition = scrLeft + offWidth >= scrWidth;
    let secondCondition = scrLeft > 0;
    if (DyLobbyMultiView.languageDirection == 'rtl') {
        firstCondition = scrLeft > 0;
        secondCondition = scrLeft + scrWidth - offWidth > 1;
    }

    if (firstCondition) {
        document.getElementById(rightBtn).classList.add('lca-disabled');
        document.getElementById(shadowBtn).classList.remove('shadow-right');
    } else {
        document.getElementById(rightBtn).classList.remove('lca-disabled');
        document.getElementById(shadowBtn).classList.add('shadow-right');
    }
    if (secondCondition) {
        document.getElementById(leftBtn).classList.remove('lca-disabled');
        document.getElementById(shadowBtn).classList.add('shadow-left');
    } else {
        document.getElementById(leftBtn).classList.add('lca-disabled');
        document.getElementById(shadowBtn).classList.remove('shadow-left');
    }

}

function CreateBadges(badgeTypeId) {
    let badges = '';
    if (badgeTypeId) {
        for (var b = 0; b < badgeTypeId.length; b++) {
            switch (badgeTypeId[b]) {
                case 1:
                    badges += '<div class="lca-card-badge type-1">Top</div>';
                    break;
                case 2:
                    badges += '<div class="lca-card-badge type-2">HOT</div>';
                    break;
                case 3:
                    badges += '<div class="lca-card-badge type-3">JackPot</div>';
                    break;
                case 4:
                    badges += '<div class="lca-card-badge type-4">New</div>';
                    break;
                case 5:
                    badges += '<div class="lca-card-badge type-5">Soon</div>';
                    break;
                case 6:
                    badges += '<div class="lca-card-badge type-6">Premium</div>';
                    break;
            }
        }
    }
    return badges;
}

function ChangeToAddedGameUrl(gameUrl) {
    let currentUrl = document.location.href.toLocaleLowerCase();
    let urlToSet = currentUrl
    if (currentUrl.includes('/real')) {
        urlToSet = currentUrl.split('real')[0] + 'real/' + gameUrl;
    } else {
        urlToSet = currentUrl.split('fun')[0] + 'fun/' + gameUrl;
    }
    history.replaceState({ id: '' }, '', urlToSet);
}

function handleSgResponse(response) {
    console.log(response)
}

function LaunchAggGame(game, wrId) {
    let intvl = setInterval(() => {
        if (typeof window.sg != 'undefined' && allowAggLaunch) {
            allowAggLaunch = false;
            let game_url = game.LaunchData.Url.replace(/&quot;/g, '"');
            gameLaunchOptions = { "target_element": wrId };
            gameLaunchOptions['launch_options'] = JSON.parse(game_url);
            clearInterval(intvl);
            window.sg.launch(gameLaunchOptions, handleSgResponse, handleSgResponse);
            allowAggLaunch = true;
        }
    }, 100)
}

function waitForElem(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

$(document).on('click', '#js_add_game', function () {
    if (addGameClickLock) {
        addGameClickLock = false;
        $(this).parents('.js_game_view_item_inner').addClass('place_to_add');
        $.ajax({
            url: "/Play/OpenAddGamePopup",
            type: "POST",
            data: "lobbyUrl=" + DyLobbyMultiView.lobbyUrl,
            success: function (result) {
                openModalPopup(result, 'addgame');
                addGameClickLock = true;
            }
        });
    }
});

$(document).on('click', '.js_gv_close', function () {
    if (allowGvClose) {
        allowGvClose = false;
        if (DyLobbyMultiView.fromSinglePage) {
            document.location.href = '/';
        } else {
            if (DyLobbyMultiView.referrerUrl != '' && DyLobbyMultiView.referrerUrl.toLowerCase().includes('lobby')) {
                document.location.href = DyLobbyMultiView.referrerUrl;
            } else {
                if (DyLobbyMultiView.lobbyViewType == '2') {
                    document.location.href = `/${DyLobbyMultiView.language}/lobby/${DyLobbyMultiView.lobbyUrl}`;
                } else {
                    document.location.href = `/${DyLobbyMultiView.language}/lobby/${DyLobbyMultiView.lobbyUrl}/main`;
                }
            }
        }
    }
});

$(document).on('click', '#js_groups_nav_right_btn', function () {
    var scrNavElem = document.getElementById('js_add_game_groups_nav');
    var scrLeft = scrNavElem.scrollLeft;
    scrLeft = scrLeft + 600;
    $('#js_add_game_groups_nav').animate({ scrollLeft: scrLeft }, 600);
    setScrollBtnsClass(scrNavElem, scrLeft, 'js_groups_nav_left_btn', 'js_groups_nav_right_btn', 'js_groups_nav_shadow');
});

$(document).on('click', '#js_groups_nav_left_btn', function () {
    var scrNavElem = document.getElementById('js_add_game_groups_nav');
    var scrLeft = scrNavElem.scrollLeft;
    scrLeft = scrLeft - 600;
    $('#js_add_game_groups_nav').animate({ scrollLeft: scrLeft }, 600);
    setScrollBtnsClass(scrNavElem, scrLeft, 'js_groups_nav_left_btn', 'js_groups_nav_right_btn', 'js_groups_nav_shadow');
});

$(document).on('click', '#js_provs_nav_right_btn', function () {
    var scrNavElem = document.getElementById('js_add_game_provs_nav_tab_view');
    var scrLeft = scrNavElem.scrollLeft;
    scrLeft = scrLeft + 600;
    $('#js_add_game_provs_nav_tab_view').animate({ scrollLeft: scrLeft }, 600);
    setScrollBtnsClass(scrNavElem, scrLeft, 'js_provs_nav_left_btn', 'js_provs_nav_right_btn', 'js_provs_nav_shadow');
});

$(document).on('click', '#js_provs_nav_left_btn', function () {
    var scrNavElem = document.getElementById('js_add_game_provs_nav_tab_view');
    var scrLeft = scrNavElem.scrollLeft;
    scrLeft = scrLeft - 600;
    $('#js_add_game_provs_nav_tab_view').animate({ scrollLeft: scrLeft }, 600);
    setScrollBtnsClass(scrNavElem, scrLeft, 'js_provs_nav_left_btn', 'js_provs_nav_right_btn', 'js_provs_nav_shadow');
});

$(document).on('click', '#js_close_gv_warn_popup', function () {
    closeWarnMessage();
});

$(document).on('click', '#js_to_new_window_cancel', function () {
    closeOpenNewWindowWarnMessage();
});

$(document).on('click', '.js_to_new_window', function () {
    showOpenNewWindowWarnMessage(DyLobbyMultiView.trns.ToOpenInNewWindow);
    $('body').addClass('ofh');
    gvItem = $(this);
    return false;
});

$(document).on('click', '#js_to_new_window_confirm', function () {

    let elem = $(gvItem).parent().parent().next()[0];

    if (elem.tagName.toLowerCase() == 'iframe') {
        launchGameInNewWindow($(gvItem).parents('.js_game_view_item')[0].dataset.href).then(response => {
            if (response.Success) {
                let newwindow;
                let href = response.Game.LuanchUrl;
                let w = window.innerWidth * 0.7;
                let h = window.innerHeight;
                let t = window.innerHeight * 0.15 + window.screenY;
                let l = window.innerWidth * 0.15 + window.screenX;
                newwindow = window.open(href, 'name', "height=" + h + ",width=" + w + ",top=" + t + ",left=" + l);
                if (window.focus) {
                    newwindow.focus();
                }
                closeOpenNewWindowWarnMessage();
                document.location.href = `/${DyLobbyMultiView.language}/Lobby/${DyLobbyMultiView.lobbyUrl}/Main`;
            } else {
                showWarnMessage(response.Message);
            }
        });
    } else {
        let newwindow;
        newwindow = window.open(document.location.href, '_blank');
        if (window.focus) {
            newwindow.focus();
        }
        closeOpenNewWindowWarnMessage();
        document.location.href = `/${DyLobbyMultiView.language}/Lobby/${DyLobbyMultiView.lobbyUrl}/Main`;
    }
    return false;
});

$(document).on('click', '.js_to_full_screen', function () {
    openFullscreen($(this).parents('.js_game_view_item_inner')[0]);
});

$(document).on('click', '.js_reload_game', function () {
    let elem = $(this).parent().next()[0];
    var gameUrl = $(this).parents('.js_game_view_item')[0].dataset.href;
    $(elem).remove();
    launchGame(gameUrl, $(this).parents('.js_game_view_item_inner'));
});

$(document).on('click', '.js_add_game_to_gv', function () {
    closeGVModal();
    var gameUrl = this.dataset.href;
    var gameId = this.dataset.gameId;
    setTimeout(function () {
        $('.place_to_add').parents('.js_game_view_item').attr('data-has-game', 'true');
        $('.place_to_add').parents('.js_game_view_item').attr('data-game-id', gameId);
        $('.place_to_add').parents('.js_game_view_item').attr('data-href', gameUrl);
        launchGame(gameUrl, '.place_to_add');
    }, 450);
});

$(document).on('click', '.js_add_game_from_cv', function () {
    var gameUrl = this.dataset.href;
    var gameId = this.dataset.gameId;
    launchGame(gameUrl, $(this).parents('.js_game_view_item_inner'));
    $(this).parents('.js_game_view_item').attr('data-has-game', 'true');
    $(this).parents('.js_game_view_item').attr('data-game-id', gameId);
    $(this).parents('.js_game_view_item').attr('data-href', gameUrl);
});

$(document).on('click', '.js_add_game_from_left_part', function () {
    var gameViewItems = $('.js_game_view_item:not([data-has-game])');
    if ($('.js_game_view_item').length == 1) {
        var gameViewItems = $('.js_game_view_item');
    }
    var gameId = this.dataset.gameId;
    if (gameViewItems.length > 0) {
        var gameUrl = this.dataset.href;
        launchGame(gameUrl, $(gameViewItems[0]).children('.js_game_view_item_inner'));
        $(gameViewItems[0]).attr('data-has-game', 'true');
        $(gameViewItems[0]).attr('data-game-id', gameId);
        $(gameViewItems[0]).attr('data-href', gameUrl);
    } else {
        showWarnMessage(DyLobbyMultiView.trns.ToAddGame);
    }
});

$(document).on('click', '.js_dl_categories', function () {
    if (!$(this).hasClass('active') || $(this).attr('data-id') != 0) {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            if ($('.js_dl_categories.active').length == 0) {
                $($('.js_dl_categories')[0]).addClass('active');
                addCategoryIdToObj(gamesData, '0');
            }
            document.getElementById('js_add_games_lobby_cont').scrollTo({ top: 0, behavior: 'smooth' });
            removeCategoryIdFromObj(gamesData, $(this).attr('data-id'));
            gamesData.Page = 0;
            GetGames('js_add_games_lobby');
        } else {
            if ($(this).attr('data-id') == '0') {
                $('.js_dl_categories').removeClass('active');
                gamesData.CategoryId = [];
                addCategoryIdToObj(gamesData, '0');
            } else {
                $($('.js_dl_categories')[0]).removeClass('active');
                addCategoryIdToObj(gamesData, $(this).attr('data-id'));
                removeCategoryIdFromObj(gamesData, '0');
            }
            document.getElementById('js_add_games_lobby_cont').scrollTo({ top: 0, behavior: 'smooth' });
            $(this).addClass('active');
            gamesData.Page = 0;
            GetGames('js_add_games_lobby');
        }
    }
});

$(document).on('click', '.js_dl_groups', function () {
    if (!$(this).hasClass('active')) {
        $('.js_dl_groups').removeClass('active');
        $(this).addClass('active');
        document.getElementById('js_add_games_lobby_cont').scrollTo({ top: 0, behavior: 'smooth' });
        gamesData.GroupId = $(this).attr('data-id');
        gamesData.GroupTypeId = $(this).attr('data-type-id');
        gamesData.TakeCount = $(this).attr('data-take-count');
        gamesData.Page = 0;
        GetGames('js_add_games_lobby', false, true);

    }
});

$(document).on('click', '#js_hdr_play_real', function () {
    var url = window.location.href.toLowerCase();
    url = url.replace('/play/fun/', '/play/real/');
    history.replaceState('', '', url);
    var openedGames = $('.js_game_view_item');
    DyLobbyMultiView.isRealMode = 'true';
    for (var i = 0; i < openedGames.length; i++) {
        if (openedGames[i].getElementsByTagName('iframe').length > 0) {
            launchGame(openedGames[i].dataset.href, $(openedGames[i]).children('.js_game_view_item_inner'));
        }
    }
    $(this).parent().remove();
});

$(document).on('click', '#js_header_btn', function () {
    if ($('#js_gv_header').hasClass('active')) {
        $('#js_gv_header').removeClass('active');
        $('#js_gv_sidebar').removeClass('open');
        $('#js_gv_main').addClass('open');
    } else {
        if ($('#js_gv_sidebar').attr('data-got-data') != 'true') {
            $.ajax({
                url: "/DynamicLobbyHelper/GetGVAvailableGroupsAndGames",
                type: "POST",
                data: "gamesTakeCount=16&place=2&lobbyUrl=" + DyLobbyMultiView.lobbyUrl,
                success: function (result) {
                    $('#js_gv_sidebar').append(result);
                    new Swiper('#js_groups_slider_cont', {
                        loop: false,
                        slidesPerView: 1,
                        preloadImages: false,
                        autoplay: false,
                        effect: 'fade',
                        navigation: {
                            nextEl: '#js_gv_lp_slider_next',
                            prevEl: '#js_gv_lp_slider_prev',
                        }
                    });
                    var sliderItems = document.getElementsByClassName('js_gv_lp_gamelist');
                    for (var i = 0; i < sliderItems.length; i++) {
                        sliderItems[i].addEventListener('scroll', loadLPSliderGamesOnScroll)
                    }
                    $('#js_gv_sidebar').attr('data-got-data', 'true');
                }
            });
        }
        $('#js_gv_header').addClass('active');
        $('#js_gv_sidebar').addClass('open');
        $('#js_gv_main').removeClass('open');
    }
});

$(document).on('click', '#js_modal_close', function () {
    closeGVModal();
    $('.js_game_view_item_inner').removeClass('place_to_add');
});

$(document).on('click', '#js_close_warn_popup', function () {
    $('#gv_warn_popup').fadeOut();
    setTimeout(function () { $('#gv_warn_popup').remove(); }, 450)
});

$(document).on('click', '.js_mv_game_fav', function (e) {
    e.stopPropagation();
    if (DyLobbyMultiView.userId == 0) {
        openLogin();
        return;
    }
    if (allowClick) {
        allowClick = false;
        var gameId = $(this).parents('.js_game_view_item').attr('data-game-id');

        if ($(this).hasClass('active')) {
            $.ajax({
                url: "/DynamicLobbyHelper/DeleteFromFavList",
                type: "POST",
                data: { gameId: gameId },
                datatype: "json",
                success: function (result) {
                    if (result.Code > 0) {
                        showWarnMessage(result.Message);
                    } else {
                        $('div[data-game-id="' + gameId + '"] .js_mv_game_fav').removeClass('active');
                    }
                    allowClick = true;
                }
            });
        } else {
            $.ajax({
                url: "/DynamicLobbyHelper/AddToFavList",
                type: "POST",
                data: { gameId: gameId },
                datatype: "json",
                success: function (result) {
                    if (result.Code > 0) {
                        showWarnMessage(result.Message);
                    } else {
                        $('div[data-game-id="' + gameId + '"] .js_mv_game_fav').addClass('active');
                    }
                    allowClick = true;
                }
            });
        }
    }
});

$(document).on('click', '.js_mv_game_like', function (e) {

    e.stopPropagation();

    if (DyLobbyMultiView.userId == 0) {
        openLogin();
        return;
    }
    if (allowClick) {
        allowClick = false;
        var likeIcon = $(this);
        var gameId = $(this).parents('.js_game_view_item').attr('data-game-id');

        if ($(likeIcon).hasClass('active')) {
            $.ajax({
                url: "/DynamicLobbyHelper/RemoveLike",
                type: "POST",
                data: { gameId: gameId },
                datatype: "json",
                success: function (result) {
                    if (result.Code > 0) {
                        showWarnMessage(result.Message);
                    } else {
                        var likesCount = $(likeIcon).children('.js_game_likes_count').text();
                        $('div[data-game-id="' + gameId + '"] .js_mv_game_like').removeClass('active');
                        $('div[data-game-id="' + gameId + '"] .js_game_likes_count').html(Number(likesCount) - 1);

                    }
                    allowClick = true;
                }
            });
        } else {
            $.ajax({
                url: "/DynamicLobbyHelper/AddLike",
                type: "POST",
                data: { gameId: gameId },
                datatype: "json",
                success: function (result) {
                    if (result.Code > 0) {
                        showWarnMessage(result.Message);
                    } else {
                        var likesCount = $(likeIcon).children('.js_game_likes_count').text();
                        $('div[data-game-id="' + gameId + '"] .js_mv_game_like').addClass('active');
                        $('div[data-game-id="' + gameId + '"] .js_game_likes_count').html(Number(likesCount) + 1);
                    }
                    allowClick = true;
                }
            });
        }
    }
});

$(document).on('click', '#js_open_prvs_btn', function (e) {
    if (this.classList.contains('open')) {
        this.classList.remove('open');
        document.getElementById('js_provs_nav_shadow').classList.add('closed');
        setCookie('_' + DyLobbyMultiView.lobbyUrl + 'ClosedPrvListMV', true, 'Session');
    } else {
        this.classList.add('open');
        document.getElementById('js_provs_nav_shadow').classList.remove('closed');
        setCookie('_' + DyLobbyMultiView.lobbyUrl + 'ClosedPrvListMV', false, 'Session');
    }
});

window.addEventListener('message', (event) => {
    if (event.data.type) {
        switch (event.data.type.toLowerCase()) {
            case 'rgs-height-change':
                if (DyLobbyMultiView.allowChangeHeight && document.fullscreenElement == null) {
                    let gvCont = document.getElementById('js_game_view_cont');
                    let val = event.data.value;
                    if (!isNaN(val)) {
                        val += 'px';
                    }
                    gvCont.getElementsByTagName('iframe')[0].style.height = val;
                    document.getElementById('js_gv').classList.add('lca-gv-scroll');
                }
                break;
            case 'login':
                if (document.querySelector('.loginDialog') !== null) {
                    openLogin();
                } else {
                    var href = document.location.href.toLowerCase();
                    document.location.href = href.replace('/play/fun/', '/play/real/');
                }
                break;
            case 'rgs-scrollto-top':
                window.scrollTo(0, event.data.value);
                break;
            case 'rgs-backtohome':
            case 'rgs-deposit':
                document.location.href = event.data.mainDomain;
                break;
        }
    } if (event.data) {
        if (event.data.command == 'com.egt-bg.exit') {
            window.location.href = DyLobbyMultiView.exitUrl;
        } else if (event.data.name) {
            switch (event.data.name.toLowerCase()) {
                case 'gamequit':
                case 'homebutton':
                    window.location.href = DyLobbyMultiView.exitUrl;
                    break;
                case 'opencashier':
                    window.location.href = DyLobbyMultiView.homeUrl + '?deposit=1';
                    break;
            }
        } else if (event.data.exi_fMessageType_str) {
            switch (event.data.exi_fMessageType_str.toLowerCase()) {
                case 'exi_onhomeuseraction':
                    window.location.href = DyLobbyMultiView.exitUrl;
                    break;
                case 'exi_oncashieruseraction':
                    window.location.href = DyLobbyMultiView.homeUrl + '?deposit=1';
                    break;
            }
        }
    }
});

window.addEventListener('scroll', function () {
    let hdr = document.getElementById('js_gv_header');
    let gmCont = document.getElementById('js_game_view_cont');
    if (hdr != null && gmCont != null) {
        if (DyLobbyMultiView.allowChangeHeight && gmCont.getBoundingClientRect().top <= hdr.offsetHeight) {
            gmCont.classList.add('lca-gv-fixed-game-btn-block');
        } else {
            gmCont.classList.remove('lca-gv-fixed-game-btn-block');
        }
    }
});
