var gamesData = {
    CategoryId: [],
    ThemeId: [],
    TournamentId: [],
    GroupId: 0,
    GroupTypeId: 0,
    Page: 0,
    TakeCount: 10,
    SearchText: '',
    LobbyUrl: '',
    MinLimit: 0,
    MaxLimit: 0,
    IsOpenFilter: false,
}
var Lobbies = Lobbies || (function () {

    return {
        init: function (args) {
            $.extend(this, args);
            gamesData.LobbyUrl = args.lobbyUrl;
            var catUrl = '', providers = '', range = '', text = '';
            var path = document.location.pathname.split('/');
            for (var i = 0; i < path.length; i++) {
                if (path[i].toLowerCase() == 'main') {
                    path.splice(0, i + 1);
                }
            }
            catUrl = path[0] != undefined ? path[0].toLowerCase() : '';
            providers = path[1] != undefined ? path[1].toLowerCase() : '';
            range = path[2] != undefined ? path[2] : '';
            text = path[3] != undefined ? path[3] : '';
            if (range.split('-')[1] == undefined || isNaN(parseInt(range.split('-')[0])) || isNaN(parseInt(range.split('-')[1]))) {
                text = range;
                range = '';
            }

            this.allCat = document.getElementsByClassName('js_lobby_cats')[0];
            this.defaultGroup = document.getElementsByClassName('js_lobby_groups default')[0];
            if (this.defaultGroup == undefined) {
                this.defaultGroup = document.getElementsByClassName('js_lobby_groups')[0];
            }
            if (catUrl == '') {
                this.defaultGroup.classList.add('active');
                this.allCat.classList.add('active');
                gamesData.CategoryId.push(this.allCat.dataset.id);
                gamesData.GroupId = this.defaultGroup.dataset.id;
                gamesData.GroupTypeId = this.defaultGroup.dataset.typeId;
                gamesData.TakeCount = this.defaultGroup.dataset.takeCount;
                changePageUrlWithoutRefreshing('/' + GamesCommon.language + '/lobby/' + args.lobbyUrl + '/main', '', true);
                GetGames('js_games_lobby');
                removeClassIfElemExists('js_lobby_buttons_cont', 'view_clear_all');
                removeClassIfElemExists('js_lobby_buttons_cont', 'filtered');
            } else {
                let group = document.querySelectorAll('[data-url="' + catUrl + '"]')[0];

                if (group) {
                    gamesData.GroupId = group.dataset.id;
                    gamesData.GroupTypeId = group.dataset.typeId;
                    gamesData.TakeCount = group.dataset.takeCount;
                    group.classList.add('active');
                    let slidePos = Number(group.dataset.pos);
                    args.slider.slideTo(slidePos > 0 ? slidePos - 1 : 0, 0);
                    let categories = document.getElementsByClassName('js_lobby_cats');
                    var prvds = providers.split('-');
                    for (var i = 0; i < categories.length; i++) {
                        for (var j = 0; j < prvds.length; j++) {
                            if (categories[i].dataset.url == prvds[j]) {
                                categories[i].classList.add('active');
                                gamesData.CategoryId.push(categories[i].dataset.id);
                            }
                        }
                    }

                    if (text != '') {
                        text = text.replace(/%20/g, ' ');
                        gamesData.SearchText = text;
                        $('#js_dl_search_game').val(text);
                        searchTxt = text;
                    }

                    if (range != '') {
                        gamesData.MinLimit = parseInt(range.split('-')[0]);
                        gamesData.MaxLimit = parseInt(range.split('-')[1]);
                        gamesData.IsOpenFilter = true;
                        addClassIfElemExists('js_lobby_buttons_cont', 'filtered');
                    }
                    document.addEventListener('DOMContentLoaded', function () {
                        let providerGroups = document.getElementById('js_lobby_wrapper');
                        let yOffset = providerGroups.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({
                            top: yOffset,
                            behavior: 'smooth'
                        });
                    });
                } else {
                    group = this.defaultGroup;
                    this.defaultGroup.classList.add('active');
                    this.allCat.classList.add('active');
                    gamesData.CategoryId.push(this.allCat.dataset.id);
                    gamesData.GroupId = this.defaultGroup.dataset.id;
                    gamesData.GroupTypeId = this.defaultGroup.dataset.typeId;
                    gamesData.TakeCount = this.defaultGroup.dataset.takeCount;
                    changePageUrlWithoutRefreshing('/' + GamesCommon.language + '/lobby/' + args.lobbyUrl + '/main', '');
                }
                GetGames('js_games_lobby');

                if (group.dataset.url != Lobbies.defaultGroup.dataset.url || (prvds != undefined && prvds.length >= 1 && prvds[0] != 'all') || text != '' || range != '') {
                    addClassIfElemExists('js_lobby_buttons_cont', 'view_clear_all');
                    addClassIfElemExists('js_lobby_buttons_cont', 'filtered');
                }
            }

            let topWinsCont = document.getElementsByClassName('js_top_winners_item_names active');
            if (topWinsCont != null && topWinsCont.length > 0) {
                GetBigWinsWidget(topWinsCont[0].dataset.lobbyWidgetType, topWinsCont[0].dataset.winsType, topWinsCont[0]);
            }

            var mlkdCont = document.getElementsByClassName('js_dl_mLkd_games');
            if (mlkdCont != null && mlkdCont.length > 0) {
                let mlkdGroupData = {
                    input: []
                };
                let takeCount = Number(mlkdCont[0].dataset.takeCount);
                let data = {
                    GroupId: mlkdCont[0].dataset.id,
                    GroupTypeId: mlkdCont[0].dataset.typeId,
                    TakeCount: takeCount * 2,
                    Page: 0,
                    LobbyUrl: mlkdCont[0].dataset.lobbyurl

                }
                if (args.isMobileBrowser) {
                    mlkdCont[0].dataset.page = 0;
                    mlkdGroupData.input.push(data);
                    GetGamesByGroup(false, mlkdGroupData);
                } else {
                    mlkdCont[0].dataset.page = 1;
                    mlkdGroupData.input.push(data);
                    GetGamesByGroup(false, false, mlkdGroupData);
                }
            }
            let recommendedWidget = document.getElementById('js_recommended_widget');
            if (recommendedWidget != null) {
                getRecommendedGames();
            }

            if (!args.isMobileBrowser) {
                window.addEventListener('resize', checkViewAllButtonVisibility);
            }
        }
    }
}());
let allGamesCount = 0;
let dlSearchTimeOut = '';
let searchTxt = '';
let lobbyMain = document.getElementById('js_lobby_main');
let prvCont = document.getElementById('js_lobby_providers_cont');
let allowSetFixedLobby = true;
let allowRemoveFixedLobby = true;
let allowLazyLoad = false;
function setCatInfo(catInfo) {
    allGamesCount = 0;
    let activePrvCount = -1;
    let activePrvList = [];
    let catDivs = document.querySelectorAll('.js_lobby_cats');
    let viewAllCountElem = document.getElementById('js_lobby_view_all_count');
    let catDivsLength = catDivs.length;
    for (let i = 0; i < catDivsLength; i++) {
        let countElem = catDivs[i].querySelector('.js_lobby_cats_count');
        if (countElem) {
            countElem.innerHTML = '';
        }
        catDivs[i].classList.add('hidden');
    }

    for (let c = 0; c < catInfo.length; c++) {
        if (gamesData.CategoryId.includes(catInfo[c].Id.toString())) {
            allGamesCount += catInfo[c].GamesCount;
        }
        for (let j = 0; j < catDivsLength; j++) {
            if ($(catDivs[j]).attr('data-id') == catInfo[c].Id) {
                let countElem = catDivs[j].querySelector('.js_lobby_cats_count');
                if (countElem) {
                    countElem.innerHTML = '(' + catInfo[c].GamesCount + ')';
                }
                catDivs[j].classList.remove('hidden');
                activePrvCount++;
                activePrvList.push(catDivs[j]);
            }
        }
    }
    if (viewAllCountElem) {
        viewAllCountElem.innerHTML = '(' + activePrvCount + ')';
    }
    checkViewAllButtonVisibility();
}
function checkViewAllButtonVisibility() {
    let currentCats = document.querySelectorAll(".js_lobby_cats:not(.hidden)");
    let showViewAllBtn = false;
    let currentCatsLength = currentCats.length;
    if (Lobbies.languageDirection == 'ltr') {
        showViewAllBtn = Lobbies.isMobileBrowser || currentCats[currentCatsLength - 1].offsetLeft + currentCats[currentCatsLength - 1].offsetWidth > prvCont.offsetWidth + 2 ||
            currentCats[0].offsetTop < currentCats[currentCatsLength - 1].offsetTop;
    } else {
        showViewAllBtn = Lobbies.isMobileBrowser || currentCats[currentCatsLength - 1].offsetLeft < 0 || currentCats[0].offsetTop < currentCats[currentCatsLength - 1].offsetTop;
    }
    if (showViewAllBtn) {
        removeClassIfElemExists('js_lobby_view_all_providers', 'hidden');
    } else {
        addClassIfElemExists('js_lobby_view_all_providers', 'hidden');
    }

    if (Lobbies.isMobileBrowser) {
        if (currentCatsLength > 5) {
            removeClassIfElemExists('js_lobby_view_all_providers_from_cat_raw', 'hidden');
            for (let i = 0; i < currentCatsLength; i++) {
                if (i > 5) {
                    currentCats[i].classList.add('hidden');
                }
            }
        } else {
            addClassIfElemExists('js_lobby_view_all_providers_from_cat_raw', 'hidden');
        }
    }

}
function loadGamesOnScroll() {
    let allowGet = Lobbies.isMobileBrowser ? $(window).scrollTop() + $(window).height() >= $(document).height() - $('#footer').height() - 400 : $(window).scrollTop() + $(window).height() >= $(document).height() - $('#js_footer').height() - 200;

    if (Lobbies.isMobileBrowser) {
        let hdr = document.getElementById('header');
        let isHeaderHidden = document.documentElement.classList.contains("hide_header_navbar");
        let hdrHeight = isHeaderHidden ? 0 : 64;
        if (hdr && !isHeaderHidden) {
            hdrHeight = hdr.offsetTop + hdr.offsetHeight
        }
        if (lobbyMain.getBoundingClientRect().top <= hdrHeight) {
            if (allowSetFixedLobby) {
                allowSetFixedLobby = false;
                allowRemoveFixedLobby = true;
                document.body.classList.add('lobbyFilter_fixed');
            }
        } else {
            if (allowRemoveFixedLobby) {
                allowSetFixedLobby = true;
                allowRemoveFixedLobby = false;
                document.body.classList.remove('lobbyFilter_fixed');
            }
        }
    } else {
        let hdr = document.getElementById('header_fix');
        let hdrHeight = 56;
        if (hdr) {
            hdrHeight = hdr.offsetTop + hdr.offsetHeight
        }
        if (!Lobbies.isFixedHeader) {
            hdrHeight = 0;
        }

        if (lobbyMain.getBoundingClientRect().top <= hdrHeight - 16) {
            if (allowSetFixedLobby) {
                allowSetFixedLobby = false;
                allowRemoveFixedLobby = true;
                if (!Lobbies.closedPrvList) {
                    document.getElementById('js_lobby_providers_cont').classList.remove('collapsed');
                }
                document.body.classList.add('lobbyFilter_fixed');
                checkViewAllButtonVisibility();
            }
        } else {
            if (allowRemoveFixedLobby) {
                allowSetFixedLobby = true;
                allowRemoveFixedLobby = false;
                if (!Lobbies.closedPrvList) {
                    document.getElementById('js_lobby_providers_cont').classList.add('collapsed');
                }
                document.body.classList.remove('lobbyFilter_fixed');
                checkViewAllButtonVisibility();
            }
        }
    }
    if (GamesCommon.gameCardType == 4) {
        if (allowGet && allowLazyLoad) {
            allowLazyLoad = false;
            gamesData.Page++;
            GetGames('js_games_lobby', true);
        }
    }
}
function drawGamesAndSetCatInfo(contId, games, catInfo, append, gridType, _callback) {
    setCatInfo(catInfo);
    if (_callback) {
        _callback(contId, games, append, gridType, Lobbies.lobbyUrl, GamesCommon.lobbyPreviewType);
    }

    window.removeEventListener('scroll', loadGamesOnScroll);

    window.addEventListener('scroll', loadGamesOnScroll);
}
function GetGames(contId, append, allowSetPageUrl) {
    $.ajax({
        type: "POST",
        data: gamesData,
        url: "/DynamicLobbyHelper/GetGamesV1",
        showLoader: false,
        success: function (result) {
            allowLazyLoad = result.HasNext;
            if (GamesCommon.gameCardType != 4) {
                showHideButtonLoader('js_show_more_btn', false);
                handleShowMoreButtonVisibility(allowLazyLoad);
            }
            let notEmptyActiveCats = [];
            let catInfo = result.CategoryInfo;
            for (var c = 0; c < catInfo.length; c++) {
                if (gamesData.CategoryId.includes(catInfo[c].Id.toString())) {
                    notEmptyActiveCats.push(catInfo[c].Id.toString());
                }
            }

            if (notEmptyActiveCats.length > 0) {
                gamesData.CategoryId = notEmptyActiveCats;
                drawGamesAndSetCatInfo(contId, result.GamesOutput, result.CategoryInfo, append, GamesCommon.lobbyGridType, drawGames);
                if (allowSetPageUrl) {
                    setPageUrl();
                }
                if (gamesData.SearchText != '' && result.GamesOutput.length == 0) {
                    getSuggestedGames('js_games_lobby');
                }
            } else {
                gamesData.CategoryId = ['0'];
                GetGames('js_games_lobby', false, true);
            }
        }
    });
}
function getSuggestedGames(contId) {
    let group = document.querySelector('.js_lobby_groups[data-url="mostpopular"]');
    if (group) {
        let data = {
            GroupId: group.dataset.id,
            GroupTypeId: group.dataset.typeId,
            TakeCount: group.dataset.takeCount,
            Page: 0,
            LobbyUrl: Lobbies.lobbyUrl
        }
        let suggestedGroupData = {
            input: []
        };
        suggestedGroupData.input.push(data);
        $.ajax({
            type: "POST",
            data: suggestedGroupData,
            url: "/DynamicLobbyHelper/GetGamesByGroup",
            success: function (result) {
                if (result.length > 0 && result[0].GamesOutput.length > 0) {
                    let html = `<div class="lobbyFilter_empty_title rd_title rd_title__line">` + Lobbies.trns.SuggestedGames + `</div>`;
                    if (Lobbies.isMobileBrowser) {
                        if (GamesCommon.gameCardType == 4) {
                            for (var i = 0; i < result[0].GamesOutput.length; i++) {
                                let gridClass = 'lca-card-wrapper-50';

                                if (GamesCommon.lobbyGridType == 2) {
                                    imgSortIndex++;
                                    if (imgSortIndex % 5 == 0 && imgSortIndex % 10 != 0) {
                                        gridClass = 'lca-card-wrapper-50 lca-card-wrapper-hx2';
                                    } else if (imgSortIndex % 10 == 0) {
                                        gridClass = 'lca-card-wrapper-100';
                                    }
                                }
                                html += drawGamesWrapper(result[0].GamesOutput[i], GamesCommon.lobbyGridType, GamesCommon.lobbyPreviewType, Lobbies.lobbyUrl, gridClass);

                                if (GamesCommon.lobbyPreviewType == '0' || GamesCommon.lobbyPreviewType == '1') {
                                    html += drawGamesCardFooterSpec(result[0].GamesOutput[i]);
                                }
                                html += "</div></div>";
                            }
                        } else {
                            html += createGamesHtmlV1(result[0].GamesOutput, GamesCommon.lobbyGridType, Lobbies.lobbyUrl, GamesCommon.lobbyPreviewType);
                        }
                    } else {
                        allGamesCount = result[0].GamesOutput.length;
                        if (GamesCommon.gameCardType == 4) {
                            html += createGameHtmlSpec(result[0].GamesOutput, GamesCommon.lobbyGridType, Lobbies.lobbyUrl, GamesCommon.lobbyPreviewType);
                        } else {
                            html += createGamesHtmlV1(result[0].GamesOutput, GamesCommon.lobbyGridType, Lobbies.lobbyUrl, GamesCommon.lobbyPreviewType);
                        }
                    }
                    $('#' + contId).append(dlAnimate(html));
                }
            }
        });
    }
}

function getRecommendedGames() {
    $.ajax({
        type: "POST",
        url: "/DynamicLobbyHelper/GetRecommendedGames",
        showLoader: false,
        success: function (result) {
            let gamesLength = result.GamesOutput.length;
            if (gamesLength > 0) {
                $('#js_recommended_games_cont').html(dlAnimate(createRecommendedGamesHtml(result.GamesOutput)));
                if (!Lobbies.isMobileBrowser) {
                    if (Lobbies.isMobileDevice) {
                        if (gamesLength > 2) {
                            $('#js_recommended_games_cont').parent().find('.js_slider_prev').removeClass('hidden');
                            $('#js_recommended_games_cont').parent().find('.js_slider_next').removeClass('hidden');
                        }
                        new Swiper('#js_recommended_widget', {
                            loop: false,
                            slidesPerView: 2,
                            slidesPerGroup: 2,
                            preloadImages: false,
                            autoplay: false,
                            spaceBetween: 12,
                            navigation: {
                                nextEl: '.js_slider_next',
                                prevEl: '.js_slider_prev',
                            }
                        });
                    } else if (gamesLength <= 7) {
                        $('#js_recommended_games_cont').addClass('lca-recommended-no-slider');
                        $('#js_recommended_games_cont').addClass('recommended-items_' + gamesLength);
                    } else {
                        $('#js_recommended_games_cont').parent().find('.js_slider_prev').removeClass('hidden');
                        $('#js_recommended_games_cont').parent().find('.js_slider_next').removeClass('hidden');
                        new Swiper('#js_recommended_widget', {
                            loop: false,
                            slidesPerView: 7,
                            slidesPerGroup: 7,
                            preloadImages: false,
                            autoplay: false,
                            spaceBetween: 12,
                            navigation: {
                                nextEl: '.js_slider_next',
                                prevEl: '.js_slider_prev',
                            },
                            breakpoints: {                                                             
                                1601: {
                                    slidesPerView: 7,
                                    slidesPerGroup: 7,
                                },
                                1451: {
                                    slidesPerView: 6,
                                    slidesPerGroup: 6,
                                },                            
                                1141: {
                                    slidesPerView: 5,
                                    slidesPerGroup: 5,
                                },
                                768: {
                                    slidesPerView: 4,
                                    slidesPerGroup: 4,
                                }

                            },
                        });
                    }
                }
            } else {
                $('#js_recommended_widget').addClass('hidden');
            }
        }
    });
}

function setPageUrl() {

    let catUrl = $('.js_lobby_groups[data-id="' + gamesData.GroupId + '"]')[0].dataset.url;
    let providers = [];
    let lobbyCats = $('.js_lobby_cats');
    let lobbyCatsLength = lobbyCats.length;
    $(lobbyCats).removeClass('active');
    for (var i = 0; i < lobbyCatsLength; i++) {
        for (var j = 0; j < gamesData.CategoryId.length; j++) {
            if (lobbyCats[i].dataset.id == gamesData.CategoryId[j]) {
                providers.push(lobbyCats[i].dataset.url);
                lobbyCats[i].classList.add('active');
            }
        }
    }
    let url = '/' + GamesCommon.language + '/lobby/' + Lobbies.lobbyUrl + '/main/' + catUrl + '/';
    for (let p = 0; p < providers.length; p++) {
        if (p == 0) {
            url += providers[p];
        } else {
            url += '-' + providers[p];
        }
    }

    if (gamesData.SearchText != '') {
        url += '/' + gamesData.SearchText;
    }
    changePageUrlWithoutRefreshing(url, url);

    if (catUrl != Lobbies.defaultGroup.dataset.url || (providers.length >= 1 && providers[0] != 'all') || searchTxt != '') {
        addClassIfElemExists('js_lobby_buttons_cont', 'view_clear_all');
        addClassIfElemExists('js_lobby_buttons_cont', 'filtered');
    } else {
        removeClassIfElemExists('js_lobby_buttons_cont', 'view_clear_all');
        removeClassIfElemExists('js_lobby_buttons_cont', 'filtered');
    }
}
function openFilter(showFullPrList) {
    showHideLoader(true);
    $.ajax({
        type: "GET",
        url: "/DynamicLobbyHelper/GetFilter?showFullPrList=" + showFullPrList,
        success: function (result) {
            $('#js_lobby_main_wrapper').append(dlAnimate(result));
            $('body').addClass('ofh');
            showHideLoader(false);
        }
    });
}
function searchGames(input, searchAfterFilterClose) {
    if (input.value.length > 0) {
        document.getElementById('js_clear_search_val').style.display = 'block';
    } else {
        document.getElementById('js_clear_search_val').style.display = 'none';
    }
    var val = input.value.replace(/\s\s+/g, ' ');

    if (!isSearchInutTextValid(input, val) || (searchTxt == val && !searchAfterFilterClose) || (val != '' && val.charAt(0) == ' ')) {
        return;
    }

    searchTxt = val;
    clearTimeout(dlSearchTimeOut);
    dlSearchTimeOut = setTimeout(function () {
        allowLazyLoad = false;
        let allGroup = document.querySelector('.js_lobby_groups[data-url="all"]');
        removeClassIfElemExists('js_lobby_buttons_cont', 'filtered');
        if (allGroup) {
            $('.js_lobby_groups').removeClass('active');
            allGroup.classList.add('active');
            gamesData.GroupId = allGroup.dataset.id;
            gamesData.GroupTypeId = allGroup.dataset.typeId;
            gamesData.TakeCount = allGroup.dataset.takeCount;
        }
        gamesData.SearchText = searchTxt;
        gamesData.Page = 0;
        imgSortIndex = 0;
        GetGames('js_games_lobby');
        setPageUrl();
        scrollIntoViewCustom();
    }, 400);
}
function isSearchInutTextValid(input, text) {
    const regex = new RegExp("^[A-Za-z0-9 '&!-\"™:]*$");
    if (regex.test(text)) {
        if (document.getElementById('js_search_msg')) {
            document.getElementById('js_search_msg').remove();
        }
        return true;
    } else {
        if (!document.getElementById('js_search_msg')) {
            var elem = document.createElement('span');
            elem.id = 'js_search_msg';
            elem.innerHTML = Lobbies.trns.UseLatinLettersInSearch;
            input.parentNode.appendChild(elem);
        }
        return false;
    }
}
function GetBigWinsWidget(lobbyWidgetType, winsType, elem) {
    $.ajax({
        type: "GET",
        url: "/DynamicLobbyHelper/GetBigWins?lobbyWidgetType=" + lobbyWidgetType + "&winsType=" + winsType,
        success: function (result) {
            $('.js_top_winners_item').removeClass('active');
            $('.js_top_winners_item_names').removeClass('active');
            elem.classList.add('active');
            if (document.getElementById('js_top_winers_skelet')) {
                skeletOff('topwins');
            }
            $('#js_top_winners_content').append(result);
        }
    });
}
function scrollIntoViewCustom() {
    if (document.body.classList.contains('lobbyFilter_fixed')) {
        let hdrHeight = 0;
        if (Lobbies.isFixedHeader) {
            hdrHeight = Lobbies.isMobileBrowser ? 64 : 56;
            let hdr = document.getElementById('header');
            if (hdr == null) {
                hdr = document.getElementById('header_fix');
            }
            if (hdr) {
                hdrHeight = hdr.offsetTop + hdr.offsetHeight;
            }
        }

        hdrHeight -= 16;
        lobbyMain.scrollIntoView();
        window.scrollBy(0, -hdrHeight + 10);
    }
}
function handleShowMoreButtonVisibility(hasNext) {
    if (hasNext) {
        document.getElementById('js_show_more_btn_cont').style.display = '';
    } else {
        document.getElementById('js_show_more_btn_cont').style.display = 'none';
    }
}
function GetGameDetails(gameId, source) {
    $.ajax({
        type: 'POST',
        data: 'lobbyUrl=' + Lobbies.lobbyUrl + '&gameId=' + gameId + '&usrId=' + GamesCommon.userId,
        url: '/DynamicLobbyHelper/GetGameDetails',
        success: function (result) {
            if (result.Success) {
                drawGameDetailsView(result.Data, null, source);
            } else {
                createToast('error', result.Message);
            }
        }
    });
}
function createBadgesV1(game) {
    let badges = '';
    let length = game.BadgeTypeIds.length;
    if (length > 0) {
        badges = `<div class="lb_card_badge_wrapper ${length > 1 ? "lb_card_badge_anim" : ""}" style="--cwStatusAnimationCount:3;"> <div class="lb_card_badge_inner_wrapper_global">`;
        for (let b = 0; b < length; b++) {
            switch (game.BadgeTypeIds[b]) {
                case 1:
                    badges += `<div class="lb_card_badge top" style="background:var(--cwStatusTopBg);"><i style="color:var(--cwStatusTopIcon);">&#58193</i><span style="color:var(--cwStatusTopTxt);">Top</span></div>`;
                    break;
                case 2:
                    badges += `<div class="lb_card_badge hot" style="background:var(--cwStatusHotBg);"><i style="color:var(--cwStatusHotIcon);">&#58193</i><span style="color:var(--cwStatusHotTxt);">Hot</span></div>`;
                    break;
                case 3:
                    badges += `<div class="lb_card_badge jackpot" style="background:var(--cwStatusJackpotBg);"><i style="color:var(--cwStatusJackpotIcon);">&#58193</i><span style="color:var(--cwStatusJackpotTxt);">Jackpot</span></div>`;
                    break;
                case 4:
                    badges += `<div class="lb_card_badge new" style="background:var(--cwStatusNewBg);"><i style="color:var(--cwStatusNewIcon);">&#58193</i><span style="color:var(--cwStatusNewTxt);">New</span></div>`;
                    break;
                case 5:
                    badges += `<div class="lb_card_badge soon" style="background:var(--cwStatusSoonBg);"><i style="color:var(--cwStatusSoonIcon);">&#58193</i><span style="color:var(--cwStatusSoonTxt);">Soon</span></div>`;
                    break;
                case 6:
                    badges += `<div class="lb_card_badge premium" style="background:var(--cwStatusPremiumBg);"><i style="color:var(--cwStatusPremiumIcon);">&#58193</i><span style="color:var(--cwStatusPremiumTxt);">Hot</span></div>`;
                    break;
                default:
                    badges += `<div class="lb_card_badge" style="background:var(--cwStatusDefaultBg);"><i style="color:var(--cwStatusDefaultIcon);">&#58193</i><span style="color:var(--cwStatusDefaultTxt);">New badge</span></div>`;
                    break;
            }
        }
        badges += `</div></div>`;
    }
    return badges;
}
function createMaxWin(game) {
    let maxWin = '';
    if (game.MinMaxLimits[2] > '0') {
        maxWin += `<div class="lb_card_maxwin flex_center">${game.MinMaxLimits[2]}</div>`;
    }
    return maxWin;
}
function createLanguages(game) {
    let langs = '';
    let length = game.LanguageIds.length;
    if (length > 0) {
        if (length > 3) {
            length = 3;
        }
        langs += `<div class="lb_card_flag_wrapper">`;
        for (let l = 0; l < length; l++) {
            langs += `<div class="lb_card_flag ${game.LanguageIds[l].toLowerCase()}"></div>`;
        }
        langs += '</div>';
    }
    return langs;
}
function createCardFooter(game) {
    let cardFooter = `<div class="lb_card_footer flex_center_between"> <p class="lb_card_name">${game.Description}</p>`;
    if (game.MinMaxLimits[0] != '0' && game.MinMaxLimits[1] != '0') {
        cardFooter += `<div class="lb_card_price"><span class="lb_card_limit_count no-rtl-needed">${game.MinMaxLimits[0]} - ${game.MinMaxLimits[1]}</span><span class="currency_icon ${GamesCommon.currencyCode}"></span></div>`
    }
    cardFooter += `</div>`;

    return cardFooter;
}
window.onpopstate = function () {
    var catUrl = '', providers = '', range = '', text = '';
    var path = document.location.pathname.split('/');
    for (var i = 0; i < path.length; i++) {
        if (path[i].toLowerCase() == 'main') {
            path.splice(0, i + 1);
        }
    }
    catUrl = path[0] != undefined ? path[0].toLowerCase() : '';
    providers = path[1] != undefined ? path[1].toLowerCase() : '';
    range = path[2] != undefined ? path[2] : '';
    text = path[3] != undefined ? path[3] : '';

    gamesData.Page = 0;
    imgSortIndex = 0;
    gamesData.CategoryId = [];
    if (catUrl == '') {
        var categories = document.getElementsByClassName('js_lobby_cats');
        $('#js_dl_search_game').val('');
        $('.js_lobby_groups').removeClass('active');
        for (var i = 0; i < categories.length; i++) {
            categories[i].classList.remove('active');
        }
        Lobbies.allCat.classList.add('active');
        Lobbies.defaultGroup.classList.add('active');
        gamesData.CategoryId.push(Lobbies.allCat.dataset.id);
        gamesData.IsOpenFilter = false;
        gamesData.GroupId = Lobbies.defaultGroup.dataset.id;
        gamesData.GroupTypeId = Lobbies.defaultGroup.dataset.typeId;
        gamesData.TakeCount = Lobbies.defaultGroup.dataset.takeCount;
        gamesData.SearchText = '';
        Lobbies.slider.slideTo(0, 0);
        GetGames('js_games_lobby');
    } else {
        $('.js_lobby_groups').removeClass('active');
        let group = document.querySelector('.js_lobby_groups[data-url="' + catUrl + '"]');
        gamesData.GroupId = group.dataset.id;
        gamesData.GroupTypeId = group.dataset.typeId;
        gamesData.TakeCount = group.dataset.takeCount;
        group.classList.add('active');
        let slidePos = Number(group.dataset.pos);
        Lobbies.slider.slideTo(slidePos > 0 ? slidePos - 1 : 0, 0);
        let categories = document.getElementsByClassName('js_lobby_cats');
        var prvds = providers.split('-');
        for (var i = 0; i < categories.length; i++) {
            categories[i].classList.remove('active');
            for (var j = 0; j < prvds.length; j++) {
                if (categories[i].dataset.url == prvds[j]) {
                    categories[i].classList.add('active');
                    gamesData.CategoryId.push(categories[i].dataset.id);
                }
            }
        }

        if (text != '') {
            text = text.replace(/%20/g, ' ');
            gamesData.SearchText = searchTxt = text;
            $('#js_dl_search_game').val(text);
        } else {
            $('#js_dl_search_game').val('');
            gamesData.SearchText = searchTxt = '';
        }

        if (range != '') {
            gamesData.MinLimit = parseInt(range.split('-')[0]);
            gamesData.MaxLimit = parseInt(range.split('-')[1]);
            gamesData.IsOpenFilter = true;
            addClassIfElemExists('js_lobby_buttons_cont', 'filtered');
        } else {
            gamesData.IsOpenFilter = false;
        }
        GetGames('js_games_lobby');

        if (group.dataset.url != Lobbies.defaultGroup.dataset.url || (prvds.length >= 1 && prvds[0] != 'all') || text != '' || range != '') {
            addClassIfElemExists('js_lobby_buttons_cont', 'view_clear_all');
            addClassIfElemExists('js_lobby_buttons_cont', 'filtered');

        } else {
            removeClassIfElemExists('js_lobby_buttons_cont', 'view_clear_all');
            removeClassIfElemExists('js_lobby_buttons_cont', 'filtered');
        }
    }
};
$(document).on('click', '.js_lobby_groups', function () {
    if (!$(this).hasClass('active')) {
        allowLazyLoad = false;
        $('.js_lobby_groups').removeClass('active');
        this.classList.add('active');
        removeClassIfElemExists('js_lobby_buttons_cont', 'filtered');
        gamesData.GroupId = $(this).attr('data-id');
        gamesData.GroupTypeId = $(this).attr('data-type-id');
        gamesData.TakeCount = $(this).attr('data-take-count');
        gamesData.Page = 0;
        gamesData.IsOpenFilter = false;
        imgSortIndex = 0;
        GetGames('js_games_lobby', false, true);
        scrollIntoViewCustom();
    }
});
$(document).on('click', '.js_lobby_cats', function () {
    if (!$(this).hasClass('active') || $(this).attr('data-id') != 0) {
        allowLazyLoad = false;
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            if ($('.js_lobby_cats.active').length == 0) {
                $($('.js_lobby_cats')[0]).addClass('active');
                addCategoryIdToObj(gamesData, '0');
            }
            removeCategoryIdFromObj(gamesData, $(this).attr('data-id'));
            gamesData.Page = 0;
            imgSortIndex = 0;
            GetGames('js_games_lobby');
        } else {
            if ($(this).attr('data-id') == 0) {
                $('.js_lobby_cats').removeClass('active');
                gamesData.CategoryId = [];
                addCategoryIdToObj(gamesData, '0');
            } else {
                $($('.js_lobby_cats')[0]).removeClass('active');
                addCategoryIdToObj(gamesData, $(this).attr('data-id'));
                removeCategoryIdFromObj(gamesData, '0');
            }
            $(this).addClass('active');
            gamesData.Page = 0;
            imgSortIndex = 0;
            GetGames('js_games_lobby');
        }
        scrollIntoViewCustom();
        setPageUrl();
    }
});
$(document).on('click', '#js_lobby_open_filter_btn', function () {
    openFilter(false);
});
$(document).on('click', '#js_lobby_view_all_providers, #js_lobby_view_all_providers_from_cat_raw', function () {
    if (Lobbies.catViewType == '2' || Lobbies.isMobileBrowser) {
        openFilter(true);
    } else {
        let prvCont = document.getElementById('js_lobby_providers_cont');
        if (prvCont.classList.contains('collapsed')) {
            prvCont.classList.remove('collapsed');
            Lobbies.closedPrvList = true;
            setCookie('_' + Lobbies.lobbyUrl + 'ClosedPrvList', true, 'Session');
        } else {
            prvCont.classList.add('collapsed');
            Lobbies.closedPrvList = false;
            setCookie('_' + Lobbies.lobbyUrl + 'ClosedPrvList', false, 'Session');
        }
    }
});
$(document).on('click', '#js_close_lobby_filter', function () {
    $("#js_lobby_filter").fadeOut();
    setTimeout(function () {
        $('body').removeClass('ofh');
        $("#js_lobby_filter").remove();
    }, 300);
});
$(document).on('click', '#js_lobby_clear_all', function () {
    allowLazyLoad = false;
    $('.js_lobby_cats').removeClass('active');
    $('.js_lobby_groups').removeClass('active');
    Lobbies.defaultGroup.classList.add('active');
    Lobbies.allCat.classList.add('active');
    document.getElementById('js_dl_search_game').value = '';
    document.getElementById('js_clear_search_val').style.display = 'none';
    if (document.getElementById('js_search_msg')) {
        document.getElementById('js_search_msg').remove();
    }
    gamesData.CategoryId = [];
    gamesData.SearchText = searchTxt = '';
    gamesData.IsOpenFilter = false;
    imgSortIndex = 0;
    gamesData.CategoryId.push(Lobbies.allCat.dataset.id);
    gamesData.GroupId = Lobbies.defaultGroup.dataset.id;
    gamesData.GroupTypeId = Lobbies.defaultGroup.dataset.typeId;
    gamesData.TakeCount = Lobbies.defaultGroup.dataset.takeCount;
    gamesData.Page = 0;
    changePageUrlWithoutRefreshing('/' + GamesCommon.language + '/lobby/' + Lobbies.lobbyUrl + '/main', '');
    GetGames('js_games_lobby');
    Lobbies.slider.slideTo(0, 300);
    removeClassIfElemExists('js_lobby_buttons_cont', 'filtered');
    removeClassIfElemExists('js_lobby_buttons_cont', 'view_clear_all');
    scrollIntoViewCustom();
});
$(document).on('click', '#js_clear_search_val', function () {
    var inp = document.getElementById('js_dl_search_game');
    inp.value = '';
    inp.dispatchEvent(new Event('keyup'));
    inp.focus();
});
$(document).on('click', '#js_lobby_search_btn', function () {
    $('#js_lobby_buttons_cont').addClass('collapsed');
    let inp = document.getElementById('js_dl_search_game');
    inp.focus();
});
$(document).on('click', '#js_close_search_val', function () {
    $('#js_lobby_buttons_cont').removeClass('collapsed');
});
$(document).on('click', '.js_top_winners_item_names', function () {
    if (this.dataset.gotData != 'true') {
        GetBigWinsWidget(this.dataset.lobbyWidgetType, this.dataset.winsType, this);
        this.dataset.gotData = true;
    } else if (!this.classList.contains('active')) {
        $('.js_top_winners_item_names').removeClass('active');
        this.classList.add('active');
        let topWinItems = document.getElementsByClassName('js_top_winners_item');
        let topWinNavItems = document.getElementsByClassName('js_top_w_nav_cont');
        for (let i = 0; i < topWinItems.length; i++) {
            topWinItems[i].classList.remove('active');
            if (topWinNavItems[i] != undefined) {
                topWinNavItems[i].classList.add('hidden');
            }
            if (this.dataset.lobbyWidgetType == topWinItems[i].dataset.lobbyWidgetType) {
                topWinItems[i].classList.add('active');
                if (document.getElementById('js_t_w_swiper_' + this.dataset.lobbyWidgetType) != null) {
                    if (topWinNavItems[i] != undefined) {
                        topWinNavItems[i].classList.remove('hidden');
                    }
                }
            }
        }
    }
});
$(document).on('click', '#js_show_more_btn', function () {
    showHideButtonLoader('js_show_more_btn', true);
    if (allowLazyLoad) {
        allowLazyLoad = false;
        gamesData.Page++;
        GetGames('js_games_lobby', true);
    }
});