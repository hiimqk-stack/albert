var filterGamesData = {
    CategoryId: [],
    ThemeId: [],
    TournamentId: [],
    GroupId: 0,
    GroupTypeId: 0,
    LobbyUrl: '',
    MinLimit: 0,
    MaxLimit: 0
}

let allowLobbyFilterBtnClick = true;
let stakeSlider;
let dlRangeTimeOut = '';
let rangeMinLimit = 1;
let rangeMaxLimit = 1000;
var LobbyFilter = LobbyFilter || (function () {

    return {
        init: function (args) {
            $.extend(this, args);
            this.container = document.getElementById('js_lobby_filter');
            this.allCat = document.getElementsByClassName('js_lobby_filter_cats')[0];
            this.defaultGroup = document.getElementsByClassName('js_lobby_filter_groups default')[0];
            if (this.defaultGroup == undefined) {
                this.defaultGroup = document.getElementsByClassName('js_lobby_filter_groups')[0];
            }
            this.innerContWrapper = this.container.querySelector('#js_lobby_filter_inner_cont_wrapper');
            this.innerCont = this.container.querySelector('#js_lobby_filter_inner_cont');
            this.prvCont = this.container.querySelector('#js_lobby_filter_providers_cont');

            filterGamesData = {
                CategoryId: gamesData.CategoryId,
                ThemeId: gamesData.ThemeId,
                TournamentId: gamesData.TournamentId,
                GroupId: gamesData.GroupId,
                GroupTypeId: gamesData.GroupTypeId,
                LobbyUrl: gamesData.LobbyUrl,
                MinLimit: gamesData.MinLimit,
                MaxLimit: gamesData.MaxLimit
            }

            if (filterGamesData.MinLimit == 0 && filterGamesData.MaxLimit == 0) {
                filterGamesData.MinLimit = rangeMinLimit = args.minLimit;
                filterGamesData.MaxLimit = rangeMaxLimit = args.maxLimit;
            }

            if (filterGamesData.GroupId == 0) {
                filterGamesData.CategoryId = [];
                LobbyFilter.defaultGroup.classList.add('active');
                LobbyFilter.allCat.classList.add('active');
                filterGamesData.LobbyUrl = Lobbies.lobbyUrl;
                filterGamesData.CategoryId.push(LobbyFilter.allCat.dataset.id);
                filterGamesData.GroupId = LobbyFilter.defaultGroup.dataset.id;
                filterGamesData.GroupTypeId = LobbyFilter.defaultGroup.dataset.typeId;
            } else {
                let group = document.querySelector('.js_lobby_filter_groups[data-id="' + filterGamesData.GroupId + '"]');
                group.classList.add('active');
                let slidePos = Number(group.dataset.pos);
                args.slider.slideTo(slidePos > 0 ? slidePos - 1 : 0, 0);
            }
            if (args.hasTheme) {
                setActiveThemes();
            }
            if (args.hasTournament) {
                setActiveTournaments();
            }

            if (document.getElementById('js_stake_range')) {
                initStakeRange(true);
            } else {
                GetGamesCount(true);
            }
        }
    }
}());
function GetGamesCount(isFirstTime) {
    $.ajax({
        type: "POST",
        data: filterGamesData,
        url: "/DynamicLobbyHelper/GetProvidersCount",
        success: function (result) {
            let notEmptyActiveCats = [];
            let catInfo = result;
            for (var c = 0; c < catInfo.length; c++) {
                if (filterGamesData.CategoryId.includes(catInfo[c].Id.toString())) {
                    notEmptyActiveCats.push(catInfo[c].Id.toString());
                }
            }

            if (notEmptyActiveCats.length > 0) {
                filterGamesData.CategoryId = notEmptyActiveCats;
                setFilterCatInfo(result);
            } else {
                filterGamesData.CategoryId = ['0'];
                GetGamesCount();
            }
            setAllGamesCount();
            if (isFirstTime) {
                handleSkeleton();
            }
        }
    });
}
function setFilterCatInfo(catInfo) {
    let activePrvCount = -1;
    let catDivs = document.querySelectorAll('.js_lobby_filter_cats');
    let catDivsLength = catDivs.length;
    for (let i = 0; i < catDivsLength; i++) {
        let countElem = catDivs[i].querySelector('.js_lobby_filter_cats_count');
        if (countElem) {
            countElem.innerHTML = '';
        }
        catDivs[i].classList.add('hidden');
    }

    for (let c = 0; c < catInfo.length; c++) {
        for (let j = 0; j < catDivsLength; j++) {
            if ($(catDivs[j]).attr('data-id') == catInfo[c].Id) {
                let countElem = catDivs[j].querySelector('.js_lobby_filter_cats_count');
                if (countElem) {
                    countElem.innerHTML = '(' + catInfo[c].GamesCount + ')';
                } else {
                    catDivs[j].dataset.gamesCount = catInfo[c].GamesCount;
                }
                catDivs[j].classList.remove('hidden');
                activePrvCount++;
            }
        }
    }
    document.getElementById('js_lobby_filter_view_all_count').innerHTML = '(' + activePrvCount + ')';
}
function setAllGamesCount(fromCat) {

    preParePageUrl();
    if (!fromCat) {
        setSelectedProvsCount('providers');
    }
    if (!fromCat && LobbyFilter.hasTheme) {
        setSelectedProvsCount('themes');
    }

    if (!fromCat && LobbyFilter.hasTournament) {
        setSelectedProvsCount('tournaments');
    }
    let activeProvidersGamesCount = document.querySelectorAll('.js_lobby_filter_cats.active .js_lobby_filter_cats_count');
    let count = 0;
    if (activeProvidersGamesCount.length > 0) {
        for (let item of activeProvidersGamesCount) {
            count += Number(item.innerHTML.replace(/[^0-9]/g, ''));
        }
    } else {
        let activeProviders = document.querySelectorAll('.js_lobby_filter_cats.active');
        for (let item of activeProviders) {
            count += Number(item.dataset.gamesCount);
        }
    }

    let filterBtnEmpty = $("#js_lobby_filter_show_all_empty");
    let filterBtnAll = $("#js_lobby_filter_show_all");
    if (count < 1) {

        if (filterBtnEmpty[0]) {
            filterBtnEmpty[0].disabled = true;

            filterBtnEmpty.hasClass("hidden") && filterBtnEmpty.removeClass("hidden");

            !filterBtnAll.hasClass("hidden") && filterBtnAll.addClass("hidden");

        }
    }
    else {
        !filterBtnEmpty.hasClass("hidden") && filterBtnEmpty.addClass("hidden");

        filterBtnAll.hasClass("hidden") && filterBtnAll.removeClass("hidden");

        document.getElementById('js_lobby_filter_show_all_count').innerHTML = count;
    }
}
function preParePageUrl() {
    let groupUrl = $('.js_lobby_filter_groups[data-id="' + filterGamesData.GroupId + '"]')[0].dataset.url;
    let providers = [];
    let lobbyFilterCats = $('.js_lobby_filter_cats');
    let lobbyFilterCatsLength = lobbyFilterCats.length;
    $(lobbyFilterCats).removeClass('active');
    for (var i = 0; i < lobbyFilterCatsLength; i++) {
        for (var j = 0; j < filterGamesData.CategoryId.length; j++) {
            if (lobbyFilterCats[i].dataset.id == filterGamesData.CategoryId[j]) {
                providers.push(lobbyFilterCats[i].dataset.url);
                lobbyFilterCats[i].classList.add('active');
            }
        }
    }
    let url = '/' + GamesCommon.language + '/lobby/' + Lobbies.lobbyUrl + '/main/' + groupUrl + '/';
    for (let p = 0; p < providers.length; p++) {
        if (p == 0) {
            url += providers[p];
        } else {
            url += '-' + providers[p];
        }
    }

    if (document.getElementById('js_stake_range')) {
        let minLimit = stakeSlider.get()[0];
        let maxLimit = stakeSlider.get()[1];
        url += '/' + minLimit + '-' + maxLimit;
    }

    LobbyFilter.PageUrl = url;

    if (isFilterDefautValues()) {
        document.getElementById('js_lobby_filter_clear_all').disabled = true;
    } else {
        document.getElementById('js_lobby_filter_clear_all').disabled = false;
    }

}
function setSelectedProvsCount(type) {
    let catsCont = document.getElementById('js_lobby_filter_' + type + '_cont');
    let selectedProvsCont = document.getElementById('js_lobby_filter_selected_' + type + '_count');
    let viewAllBtn = document.getElementById('js_lobby_filter_view_all_' + type);
    let cats = LobbyFilter.container.querySelectorAll('.js_lobby_filter_' + type);
    let popupWidth = LobbyFilter.container.querySelector('#js_lobby_filter_providers_cont').offsetWidth;
    switch (type) {
        case 'providers':
            cats = LobbyFilter.container.querySelectorAll('.js_lobby_filter_cats');
            break;
    }

    if (selectedProvsCont && !catsCont.classList.contains('open')) {
        $(selectedProvsCont).parents('.js_lobby_filter_popup_sub_cont').removeAttr('style');
        selectedProvsCont.remove();
    }

    let hiddenSelectedCatsCount = 0;
    let firstRawOffsetTop = cats[0].offsetTop;
    let thirdRawItems = [];
    let raw = 1;
    for (item of cats) {
        if (item.offsetTop > firstRawOffsetTop) {
            raw++;
            firstRawOffsetTop = item.offsetTop;
        }
        if (raw == 3 && !item.classList.contains('hidden')) {
            thirdRawItems.push(item);
        }
        if (raw > 3 && item.classList.contains('active')) {
            hiddenSelectedCatsCount++;
        }
    }
    if (hiddenSelectedCatsCount > 0 && !catsCont.classList.contains('open') && !LobbyFilter.fromViewAllProviders) {

        let lastItem = '';
        let selectedCountElem = "";
        let contentPadding = LobbyFilter.isMobileDevice ? 16 : -7;
        let paddingRtl = Lobbies.isMobileBrowser ? 16 : LobbyFilter.isMobileDevice ? 60 : 44;
        let gap = LobbyFilter.isMobileDevice && !Lobbies.isMobileBrowser ? 24 : 8;
        let selectedBtnWidth = LobbyFilter.isMobileDevice && !Lobbies.isMobileBrowser ? 170 : 110;
        for (const [i, rawItem] of thirdRawItems.entries()) {
            let isEnoughSpaseAfterItem = Lobbies.languageDirection == 'ltr' ? rawItem.offsetLeft + rawItem.offsetWidth + selectedBtnWidth + gap > popupWidth + contentPadding : rawItem.offsetLeft - paddingRtl - gap - selectedBtnWidth <= 0;

            if (isEnoughSpaseAfterItem) {
                if (rawItem.classList.contains('active')) {
                    hiddenSelectedCatsCount++;
                }
                if (lastItem == '') {
                    lastItem = rawItem;
                }

            }
            if (i == thirdRawItems.length - 1) {
                if (lastItem == '') {
                    lastItem = rawItem.nextSibling;
                }
                selectedCountElem = createSelectedCountElement(hiddenSelectedCatsCount, type);
                lastItem.parentNode.insertBefore(selectedCountElem, lastItem);
            }
        }
        if (selectedCountElem.offsetTop == cats[0].offsetTop + cats[0].offsetHeight + gap) {
            $(selectedCountElem).parents('.js_lobby_filter_popup_sub_cont').attr('style', 'max-height: 90px;');
        } else {
            $(selectedCountElem).parents('.js_lobby_filter_popup_sub_cont').removeAttr('style');
        }
    }

    if (raw <= 3) {
        viewAllBtn.classList.add('hidden');
    } else {
        viewAllBtn.classList.remove('hidden');
    }
}
function initStakeRange(isFirstTime) {
    let param = isFirstTime;
    stakeSlider = noUiSlider.create(document.getElementById('js_stake_range'), {
        start: [filterGamesData.MinLimit, filterGamesData.MaxLimit],
        connect: true,
        step: 0.01,
        direction: 'ltr',
        range: {
            min: rangeMinLimit,
            max: rangeMaxLimit
        },
        format: {
            to: function (value) {
                return Math.round(value * 100) / 100;
            },
            from: function (value) {
                return Math.round(value * 100) / 100;
            }
        },
    });

    var mininput = document.getElementById('js_st_rg_min');
    var maxinput = document.getElementById('js_st_rg_max');
    var inputs = [mininput, maxinput];
    stakeSlider.on('update', function (values, handle) {
        inputs[handle].value = setStrFormatWithSpChar(values[handle].toString(), ' ');

        clearTimeout(dlRangeTimeOut);
        dlRangeTimeOut = setTimeout(function () {
            filterGamesData.MinLimit = stakeSlider.get()[0];
            filterGamesData.MaxLimit = stakeSlider.get()[1];
            GetGamesCount(param);
            param = false;
        }, 300);
    });
    stakeSlider.on('change', function (values, handle) {
        preParePageUrl();
    });

    inputs.forEach(function (input, handle) {
        input.removeEventListener('change', handleStakeRangeChange);
        input.removeEventListener('keydown', handleStakeSliderKeyDown);
        input.addEventListener('change', function () {
            handleStakeRangeChange(handle, this.value);
        });
        input.addEventListener('keydown', function (e) {
            handleStakeSliderKeyDown(e, handle, this.value);
        });
    });
}
function setStakeRangeInpVals(handle, inpVal) {
    inpVal = inpVal.toString().replace(/\s/g, '');
    switch (handle) {
        case 0:
            stakeSlider.set([inpVal, null]);
            break
        case 1:
            stakeSlider.set([null, inpVal]);
            break
    }
    preParePageUrl();
}
function handleStakeRangeChange(handle, inpVal) {
    if (!keyDownPressed) {
        setStakeRangeInpVals(handle, inpVal);
    }
}
function handleStakeSliderKeyDown(e, handle, inpVal) {
    keyDownPressed = false;
    var values = stakeSlider.get();
    var value = Number(values[handle]);
    var steps = stakeSlider.steps();
    var step = steps[handle];
    var position;
    switch (e.which) {
        case 13:
            keyDownPressed = true;
            setStakeRangeInpVals(handle, inpVal);
            break;
        case 38:
            keyDownPressed = true;
            position = step[1];
            if (position === false) {
                position = 1;
            }
            if (position !== null) {
                setStakeRangeInpVals(handle, value + position);
            }
            break;
        case 40:
            keyDownPressed = true;
            position = step[0];
            if (position === false) {
                position = 1;
            }
            if (position !== null) {
                setStakeRangeInpVals(handle, value - position);
            }
            break;
    }
}
function createSelectedCountElement(count, type) {
    let div = document.createElement('div');
    div.className = 'lobbyProvider_selected_count relative flex_center lobbyFilter_txt_size js_lobby_filter_selected_counts';
    div.id = 'js_lobby_filter_selected_' + type + '_count';
    div.dataset.type = type;
    let span = document.createElement('span');
    span.innerHTML = '+ ' + count + ' ' + LobbyFilter.trns.Selected;
    div.appendChild(span);
    return div;
}
function isFilterDefautValues() {
    let group = document.querySelector('.js_lobby_filter_groups.default.active');
    if (group == null || (filterGamesData.CategoryId.length >= 1 && filterGamesData.CategoryId[0] != '0') ||
        filterGamesData.MinLimit != rangeMinLimit || filterGamesData.MaxLimit != rangeMaxLimit || filterGamesData.ThemeId.length > 0 || filterGamesData.TournamentId.length > 0) {
        return false;
    }
    return true;
}
function setActiveThemes() {
    let themes = document.querySelectorAll('.js_lobby_filter_themes');
    for (const theme of themes) {
        for (const themId of filterGamesData.ThemeId) {
            if (theme.dataset.themeid == themId) {
                theme.classList.add('active');
            }
        }
    }
}
function setActiveTournaments() {
    let tournaments = document.querySelectorAll('.js_lobby_filter_tournaments');
    for (const tournament of tournaments) {
        for (const themId of filterGamesData.TournamentId) {
            if (tournament.dataset.tournamentid == themId) {
                tournament.classList.add('active');
            }
        }
    }
}
function handleSkeleton() {
    setTimeout(() => {
        $('.js_skeleton_item').remove();
        $('.js_lobby_filter_section').removeClass('skeleton-hide');
        $('#js_lobby_filter_inner_cont_wrapper').removeClass('skeleton-y-ofh');
        if (LobbyFilter.fromViewAllProviders) {
            LobbyFilter.fromViewAllProviders = false;
            LobbyFilter.prvCont.classList.add('open');
        }
    }, 100)
}

$(document).on('click', '.js_lobby_filter_groups', function () {
    if (!$(this).hasClass('active')) {
        $('.js_lobby_filter_groups').removeClass('active');
        $(this).addClass('active');
        filterGamesData.GroupId = $(this).attr('data-id');
        filterGamesData.GroupTypeId = $(this).attr('data-type-id');
        filterGamesData.TakeCount = $(this).attr('data-take-count');
        GetGamesCount();
    }
});
$(document).on('click', '.js_lobby_filter_cats', function () {
    if (!$(this).hasClass('active') || $(this).attr('data-id') != 0) {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            if ($('.js_lobby_filter_cats.active').length == 0) {
                $($('.js_lobby_filter_cats')[0]).addClass('active');
                addCategoryIdToObj(filterGamesData, '0');
            }
            removeCategoryIdFromObj(filterGamesData, $(this).attr('data-id'));
        } else {
            if ($(this).attr('data-id') == 0) {
                $('.js_lobby_filter_cats').removeClass('active');
                filterGamesData.CategoryId = [];
                addCategoryIdToObj(filterGamesData, '0');
            } else {
                $($('.js_lobby_filter_cats')[0]).removeClass('active');
                addCategoryIdToObj(filterGamesData, $(this).attr('data-id'));
                removeCategoryIdFromObj(filterGamesData, '0');
            }
            $(this).addClass('active');
        }
        setAllGamesCount(filterGamesData.CategoryId.length > 0 && filterGamesData.CategoryId[0] != '0' ? true : false);
    }
});
$(document).on('click', '.js_lobby_filter_themes', function () {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        removeThemeFromObj(filterGamesData, $(this).attr('data-themeId'));
    } else {
        if ($(this).attr('data-themeId') == 0) {
            $('.js_lobby_filter_themes').removeClass('active');
            filterGamesData.ThemeId = [];
            addThemeToObj(filterGamesData, '0');
        } else {
            $($('.js_lobby_filter_themes')[0]).removeClass('active');
            addThemeToObj(filterGamesData, $(this).attr('data-themeId'));
            removeThemeFromObj(filterGamesData, '0');
        }
        $(this).addClass('active');
    }
    GetGamesCount();
});
$(document).on('click', '.js_lobby_filter_tournaments', function () {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        removeTournamnetFromObj(filterGamesData, $(this).attr('data-tournamentId'));
    } else {
        if ($(this).attr('data-tournamentId') == 0) {
            $('.js_lobby_filter_tournaments').removeClass('active');
            filterGamesData.TournamentId = [];
            addTournamnetToObj(filterGamesData, '0');
        } else {
            $($('.js_lobby_filter_tournaments')[0]).removeClass('active');
            addTournamnetToObj(filterGamesData, $(this).attr('data-tournamentId'));
            removeTournamnetFromObj(filterGamesData, '0');
        }
        $(this).addClass('active');
    }
    GetGamesCount();
});
$(document).on('click', '#js_lobby_filter_show_all', function () {
    if (allowLobbyFilterBtnClick) {
        allowLazyLoad = allowLobbyFilterBtnClick = false;
        $("#js_lobby_filter").fadeOut();
        gamesData.CategoryId = filterGamesData.CategoryId;
        gamesData.GroupId = filterGamesData.GroupId;
        gamesData.GroupTypeId = filterGamesData.GroupTypeId;
        gamesData.IsOpenFilter = false;
        $('#js_dl_search_game').val('');
        gamesData.SearchText = searchTxt = '';
        document.getElementById('js_clear_search_val').style.display = 'none';
        if (LobbyFilter.hasRange) {
            gamesData.MinLimit = filterGamesData.MinLimit = stakeSlider.get()[0];
            gamesData.MaxLimit = filterGamesData.MaxLimit = stakeSlider.get()[1];
            gamesData.IsOpenFilter = true;
        }
        if (LobbyFilter.hasTheme && filterGamesData.ThemeId.length > 0) {
            gamesData.ThemeId = filterGamesData.ThemeId;
            gamesData.IsOpenFilter = true;
        }
        if (LobbyFilter.hasTournament && filterGamesData.TournamentId.length > 0) {
            gamesData.TournamentId = filterGamesData.TournamentId;
            gamesData.IsOpenFilter = true;
        }
        let group = document.querySelector('.js_lobby_groups[data-id="' + gamesData.GroupId + '"]');
        let categories = document.getElementsByClassName('js_lobby_cats');
        imgSortIndex = 0;
        gamesData.Page = 0;
        gamesData.TakeCount = group.dataset.takeCount;
        gamesData.SearchText = '';
        changePageUrlWithoutRefreshing(LobbyFilter.PageUrl, LobbyFilter.PageUrl);
        $('.js_lobby_groups').removeClass('active');
        $(categories).removeClass('active');
        $(group).addClass('active');
        for (var i = 0; i < categories.length; i++) {
            for (var j = 0; j < gamesData.CategoryId.length; j++) {
                if (categories[i].dataset.id == gamesData.CategoryId[j]) {
                    categories[i].classList.add('active');
                }
            }
        }

        if (isFilterDefautValues() && !gamesData.IsOpenFilter) {
            removeClassIfElemExists('js_lobby_buttons_cont', 'filtered');
            removeClassIfElemExists('js_lobby_buttons_cont', 'view_clear_all');
        } else {
            addClassIfElemExists('js_lobby_buttons_cont', 'filtered');
        }


        gamesData.CategoryId = filterGamesData.CategoryId;
        gamesData.ThemeId = filterGamesData.ThemeId;
        gamesData.TournamentId = filterGamesData.TournamentId;
        gamesData.GroupId = filterGamesData.GroupId;
        gamesData.GroupTypeId = filterGamesData.GroupTypeId;
        gamesData.LobbyUrl = filterGamesData.LobbyUrl;
        gamesData.MinLimit = filterGamesData.MinLimit;
        gamesData.MaxLimit = filterGamesData.MaxLimit;

        if (isFilterDefautValues() && !gamesData.IsOpenFilter) {
            removeClassIfElemExists('js_lobby_buttons_cont', 'filtered');
            removeClassIfElemExists('js_lobby_buttons_cont', 'view_clear_all');
        }

        let slidePos = Number(group.dataset.pos);
        Lobbies.slider.slideTo(slidePos > 0 ? slidePos - 1 : 0, 300);
        GetGames('js_games_lobby');
        scrollIntoViewCustom();
        setTimeout(function () {
            $('body').removeClass('ofh');
            $("#js_lobby_filter").remove();
            allowLobbyFilterBtnClick = true;
        }, 300);
    }
});
$(document).on('click', '#js_lobby_filter_clear_all', function () {
    $('.js_lobby_filter_cats').removeClass('active');
    $('.js_lobby_filter_groups').removeClass('active');
    $('.js_lobby_filter_themes').removeClass('active');
    $('.js_lobby_filter_tournaments').removeClass('active');
    LobbyFilter.defaultGroup.classList.add('active');
    LobbyFilter.allCat.classList.add('active');
    filterGamesData.CategoryId = [];
    filterGamesData.CategoryId.push(Lobbies.allCat.dataset.id);
    filterGamesData.GroupId = Lobbies.defaultGroup.dataset.id;
    filterGamesData.GroupTypeId = Lobbies.defaultGroup.dataset.typeId;
    if (stakeSlider) {
        filterGamesData.MinLimit = rangeMinLimit;
        filterGamesData.MaxLimit = rangeMaxLimit;
        setStakeRangeInpVals(0, rangeMinLimit);
        setStakeRangeInpVals(1, rangeMaxLimit);
    }
    if (LobbyFilter.hasTheme) {
        filterGamesData.ThemeId = [];
    }

    if (LobbyFilter.hasTournament) {
        filterGamesData.TournamentId = [];
    }

    LobbyFilter.PageUrl = '/' + GamesCommon.language + '/lobby/' + Lobbies.lobbyUrl + '/main';
    GetGamesCount();
    LobbyFilter.innerCont.scrollTop = 0;
    LobbyFilter.slider.slideTo(0, 300);
    this.disabled = true;
});
$(document).on('click', '.js_lobby_filter_view_all, .js_lobby_filter_selected_counts', function () {

    let type = this.dataset.type;
    let parentCont = this.parentNode.parentNode;
    if (parentCont.classList.contains('open')) {
        parentCont.classList.remove('open')
        setSelectedProvsCount(type);
    } else {
        let selectedProvsCont = document.getElementById('js_lobby_filter_selected_' + type + '_count');
        if (selectedProvsCont) {
            $(selectedProvsCont).parents('.js_lobby_filter_popup_sub_cont').removeAttr('style');
            selectedProvsCont.remove();
        }
        parentCont.classList.add('open')
    }
});