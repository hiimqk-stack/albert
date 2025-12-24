var newsPromoData = {
    CategoryId: -1,
    Page: 1,
    TakeCount: 12,
}

var DyContentNewsPromo = DyContentNewsPromo || (function () {
    return {
        init: function (args) {
            $.extend(this, args);
            let pathName = document.location.pathname.toLowerCase();
            this.pageUrl = pathName.includes('promotions') ? 'promotions' : pathName.includes('promociones') ? 'promociones' : "media";
            newsPromoData.Type = this.pageUrl == 'media' ? 2 : 1;
            newsPromoData.Page = 1;
            if (args.fromDetailsPage == undefined || !args.fromDetailsPage) {
                let path = pathName.split('/');
                for (let i = 0; i < path.length; i++) {
                    if (path[i].toLowerCase() == this.pageUrl) {
                        path.splice(0, i + 1);
                    }
                }
                let catUrl = path[0] != undefined ? path[0].toLowerCase() : '';
                let url = '/' + DyContentNewsPromo.language + '/' + this.pageUrl;

                if (catUrl == '') {
                    let allCat = document.querySelector('.js_news_promo_categories[data-cat-id="0"]');
                    if (allCat) {
                        url += '/' + allCat.dataset.url;
                        allCat.classList.add('active');
                        newsPromoData.CategoryId = 0;
                    } else {
                        allCat = document.querySelector('.js_news_promo_categories');
                        if (allCat) {
                            url += '/' + allCat.dataset.url;
                            allCat.classList.add('active');
                            newsPromoData.CategoryId = allCat.dataset.catId;
                        } else {
                            newsPromoData.CategoryId = 0;
                        }
                    }
                } else {
                    let ctgsDOM = document.getElementsByClassName('js_news_promo_categories');
                    for (let i = 0; i < ctgsDOM.length; i++) {
                        if (ctgsDOM[i].dataset.url == catUrl) {
                            url += '/' + ctgsDOM[i].dataset.url;
                            ctgsDOM[i].classList.add('active');
                            newsPromoData.CategoryId = ctgsDOM[i].dataset.catId;
                        }
                    }
                    if (newsPromoData.CategoryId == -1) {
                        let allCat = document.querySelector('.js_news_promo_categories[data-cat-id="0"]');
                        if (allCat) {
                            url += '/' + allCat.dataset.url;
                            allCat.classList.add('active');
                        }
                        newsPromoData.CategoryId = 0;
                    }
                }
                changePageUrlWithoutRefreshing(url, url);
                getData();

                window.removeEventListener('scroll', loadNewsPromoOnScroll);
                window.addEventListener('scroll', loadNewsPromoOnScroll);
            } else {
                let refUrl = document.referrer;
                if (refUrl != '' && refUrl.toLowerCase().includes(this.pageUrl)) {
                    if (!refUrl.toLowerCase().includes('/details/')) {
                        setCookie('_prnRefererUrl', refUrl, 2);
                    }
                } else {
                    setCookie('_prnRefererUrl', '', -1);
                }
            }
        }
    }
}());

DyContentNewsPromo.allowLazyLoad = false;
DyContentNewsPromo.allowSeeMoreBtnClick = true;
DyContentNewsPromo.allowActionBtnClick = true;
function drawData(data, append) {
    let html = ``;
    let length = data.length;
    if (length > 0) {
        for (let i = 0; i < length; i++) {
            if (DyContentNewsPromo.isMobileBrowser || DyContentNewsPromo.isMobileDevice) {
                html += `<div class="pn_card relative js_news_promo_see_more_btn" data-href="${data[i].Url}" data-target="${data[i].Target}" data-type="${data[i].Type}">`;
            } else {
                html += `<div class="pn_card relative">`;
            }
            html += `<div class="pn_card_body"><img`;
            if (data[i].AltTags != null && data[i].AltTags != '') {
                html += ` alt="${data[i].AltTags}"`;
            }
            html += ` class="pn_card_img" src="${data[i].ImgSrc}" loading="lazy"/>`;
            if (data[i].Badge != null && data[i].Badge != '') {
                html += `<div class="lb_card_topitems absolute flex_center_between">${data[i].Badge}</div>`;
            }
            if (data[i].Categories != null && data[i].Categories != '') {
                html += `<div class="pn_card_category js_pr_n_cats_cont" style="visibility: hidden">${data[i].Categories}</div>`;
            }
            html += `</div><div class="pn_card_footer flex_center_between"><p class="pn_card_name">${data[i].Title}</p>`;

            if (data[i].LastUpdateTime != null && data[i].LastUpdateTime != '') {
                html += `<p class="pn_card_date">${data[i].LastUpdateTime}</p>`;
            } else if (data[i].StartDate != null && data[i].EndDate != null && data[i].StartDate != '' && data[i].EndDate != '') {
                html += `<p class="pn_card_date">${data[i].StartDate} - ${data[i].EndDate}</p>`;
            }

            html += `</div><div class="pn_card_hover flex_center_center"><div class="pn_card_descr">${data[i].ShortDescription != null ? data[i].ShortDescription : ''}</div><div class="pn_card_buttons d-flex">`;
            if (!DyContentNewsPromo.isMobileBrowser && !DyContentNewsPromo.isMobileDevice) {
                html += `<button class="js_news_promo_see_more_btn pn_card_button h-bg-secondary" type="button" data-href="${data[i].Url}" data-target="${data[i].Target}" data-type="${data[i].Type}">${data[i].SeeMoreButton}</button>`;
                if (data[i].ActionButton != null && data[i].ActionButton != '') {
                    html += `<button class="js_news_promo_action_btn pn_card_button h-bg-primary" type="button" data-type="${data[i].ActionButtonType}"`;
                    if (data[i].RedirectionLink != null && data[i].RedirectionLink != '') {
                        html += `data-href="${data[i].RedirectionLink}"`;
                    }
                    html += `>${data[i].ActionButton}</button>`;
                }
            }
            html += `</div></div></div>`;
        }
        $('#js_data_content').addClass('pn_card_main');
    } else {
        $('#js_data_content').removeClass('pn_card_main');
        html = `<div class="pn_noResult flex_center_center flex-column text-center"><img src="${DyContentNewsPromo.cdnUrl}Img/icons/dynamic_promo_no_result.svg" alt="No Result" class="pn_noResult_img"/>` +
            `<p class="pn_noResult_text">${DyContentNewsPromo.trns.NoDataText}</p>`;
        if (DyContentNewsPromo.trns.NoDataText1 != '') {
            html += `<p class="pn_noResult_subtext">${DyContentNewsPromo.trns.NoDataText1}</p>`;
        }
        html += `</div>`;
    }
    if (append) {
        $('#js_data_content').append(dlAnimate(html));
    } else {
        $('#js_data_content').html(dlAnimate(html));
    }
    setCategoriesPlusElem();
    $('.js_pr_n_cats_cont').removeAttr('style');
};

function getData(append) {
    DyContentNewsPromo.allowLazyLoad = false;
    $.ajax({
        type: "POST",
        data: newsPromoData,
        url: "/NewsPromo/GetData",
        success: function (result) {
            DyContentNewsPromo.allowLazyLoad = result.HasNext;
            drawData(result.Data, append);
        }
    });
};

function loadNewsPromoOnScroll() {
    let treshold = DyContentNewsPromo.isMobileBrowser ? $('#footer').height() : $('#js_footer').height();

    if (($(window).scrollTop() + $(window).height() >= $(document).height() - treshold) && DyContentNewsPromo.allowLazyLoad) {
        DyContentNewsPromo.allowLazyLoad = false;
        newsPromoData.Page++;
        getData(true);
    }
};

function setCategoriesPlusElem() {
    let catConts = document.querySelectorAll('.js_pr_n_cats_cont');
    let catContsLength = catConts.length;
    for (let i = 0; i < catContsLength; i++) {
        let contWidth = catConts[i].offsetWidth - 16;
        let addPlusItem = false;
        let cats = catConts[i].querySelectorAll('.js_pr_n_cats');
        let catsLength = cats.length;
        let catsWidth = 0;
        for (let j = catsLength - 1; j >= 0; j--) {
            if (cats[j].id == '') {
                catsWidth += cats[j].offsetWidth + 4;
            }
            if (catsWidth > contWidth) {
                addPlusItem = true;
            }
        }

        if (addPlusItem) {
            let plusItem = document.getElementById('js_cat_plusItem_' + i);
            if (plusItem == null) {
                $(catConts[i]).append('<span class="js_pr_n_cats" id="js_cat_plusItem_' + i + '"></span>');
            }
            cats = catConts[i].querySelectorAll('.js_pr_n_cats');
            catsLength = cats.length;
            catsWidth = 0;
            let hiddenCatsCount = 0;
            for (let j = catsLength - 1; j >= 0; j--) {
                catsWidth += cats[j].offsetWidth + 4;
                if (catsWidth > contWidth) {
                    hiddenCatsCount++;
                    cats[j].classList.add('vis_hidden');
                } else {
                    cats[j].classList.remove('vis_hidden');
                }
            }
            $('#js_cat_plusItem_' + i).html('+' + hiddenCatsCount);
        } else {
            $('#js_cat_plusItem_' + i).remove();
            $(catConts[i]).find('.js_pr_n_cats').removeClass('vis_hidden');
        }
    }
};

function getDetailsPageContent(url) {
    $.ajax({
        type: "GET",
        data: newsPromoData,
        url: url,
        success: function (result) {
            let html = '<div class="cw_promo_popup_root" id="js_news_promo_popoup_cont"><div class="cw_promo_popup_content"><div class="cw_promo_popup_header cw_popup_news">' +
                '<div class="cw_icon_close_v2 " id="js_close_news_promo_popup"></div></div><div class="cw_promo_popup_inner">' + result + '</div></div></div>';
            $('body').append(html);
        }
    });
}

function openPageWithPopup(pageUrl, popupType) {

    $("body").css("overflow", "hidden");
    if (popupType == '1') {
        pageUrl = pageUrl.includes('?') ? pageUrl + '&popup=true' : pageUrl + '?popup=true';
        getDetailsPageContent(pageUrl);
    } else {
        let html = '<div class="cw_promo_popup_root cw_promo_popup_with_iframe" id="js_news_promo_popoup_cont"><div class="cw_promo_popup_content"><div class="cw_promo_popup_header cw_popup_news">' +
            '<div class="cw_icon_close_v2 " id="js_close_news_promo_popup"></div></div><div class="cw_promo_popup_inner"><iframe class="cw_promo_popup_iframe" src="' + pageUrl + '"></iframe></div></div></div>';
        $('body').append(html);
    }
}

function closePromoNewsPopup() {
    $('#js_news_promo_popoup_cont').remove();
    $("body").css("overflow", "");
    DyContentNewsPromo.allowSeeMoreBtnClick = true;
}

$(document).on('click', '.js_news_promo_categories', function (e) {
    if (!$(this).hasClass('active')) {
        newsPromoData.CategoryId = this.dataset.catId;
        newsPromoData.Page = 1;
        $('.js_news_promo_categories').removeClass('active');
        $(this).addClass('active');
        let url = '/' + DyContentNewsPromo.language + '/' + DyContentNewsPromo.pageUrl + '/' + this.dataset.url;
        getData();
        changePageUrlWithoutRefreshing(url, url);
    }
});

$(document).on('click', '#js_close_news_promo_popup', function (e) {
    closePromoNewsPopup();
});

$(document).on('keyup', function (e) {
    if (e.keyCode == 27 && document.getElementById('js_news_promo_popoup_cont') != null) {
        closePromoNewsPopup();
    }
});

$(document).on('click', '#js_promo_news_back_btn', function (e) {
    let url = getCookie('_prnRefererUrl');
    if (url != '') {
        document.location.href = url;
    } else {
        document.location.href = '/';
    }
});

$(document).on('click', '.js_news_promo_see_more_btn', function (e) {
    if (DyContentNewsPromo.allowSeeMoreBtnClick) {
        DyContentNewsPromo.allowSeeMoreBtnClick = false;
        let href = this.dataset.href;
        let target = this.dataset.target;
        let type = this.dataset.type;
        let detailsPagePrefix = '/' + DyContentNewsPromo.language + '/' + DyContentNewsPromo.pageUrl + '/details';
        if (type == '1') {
            href = href.startsWith('/') ? detailsPagePrefix + href : detailsPagePrefix + '/' + href;
        }
        switch (target) {
            case '1':
                DyContentNewsPromo.allowSeeMoreBtnClick = true;
                window.location.href = href;
                break;
            case '2':
                openPageWithPopup(href, type);
                break;
            case '3':
                DyContentNewsPromo.allowSeeMoreBtnClick = true;
                window.open(href, '_blank').focus();
                break;
        }
    }
});

$(document).on('click', '.js_news_promo_action_btn', function (e) {
    if (DyContentNewsPromo.allowActionBtnClick) {
        DyContentNewsPromo.allowActionBtnClick = false;
        let href = this.dataset.href;
        let type = this.dataset.type;
        if (document.getElementById('js_news_promo_popoup_cont') != null) {
            closePromoNewsPopup();
        }
        switch (type) {
            case '1':
                if (!DyContentNewsPromo.isLoggedIn) {
                    LoginTrigger();
                }
                break;
            case '2':
                if (!DyContentNewsPromo.isLoggedIn) {
                    RegisterTrigger();
                }
                break;
            case '3':
                if (DyContentNewsPromo.isLoggedIn) {
                    DocumentTrigger();
                } else {
                    LoginTrigger();
                }
                break;
            case '4':
                if (DyContentNewsPromo.isLoggedIn) {
                    DepositTrigger();
                } else {
                    LoginTrigger();
                }
                break;
            case '5':
                if (DyContentNewsPromo.isLoggedIn) {
                    ReferAFriendTrigger();
                } else {
                    LoginTrigger();
                }
                break;
            case '6':
                if (DyContentNewsPromo.isLoggedIn) {
                    BonusesTrigger();
                } else {
                    LoginTrigger();
                }
                break;
            case '7':
                if (DyContentNewsPromo.isLoggedIn) {
                    PromoCodeTrigger();
                } else {
                    LoginTrigger();
                }
                break;
            case '8':
                window.open(href, '_blank').focus();
                break;
        }
        DyContentNewsPromo.allowActionBtnClick = true;
    }
});

window.onpopstate = function () {
    if ($('.js_news_promo_categories').length > 0) {
        $('.js_news_promo_categories').removeClass('active');
        var path = document.location.pathname.split('/');
        for (let i = 0; i < path.length; i++) {
            if (path[i].toLowerCase() == DyContentNewsPromo.pageUrl.toLowerCase()) {
                path.splice(0, i + 1);
            }
        }
        let catUrl = path[0] != undefined ? path[0].toLowerCase() : '';
        newsPromoData.Page = 1;
        if (catUrl == '') {
            let allCat = document.querySelector('.js_news_promo_categories[data-cat-id="0"]');
            if (allCat) {
                allCat.classList.add('active');
            }
            newsPromoData.CategoryId = 0;
        } else {
            let ctgsDOM = document.getElementsByClassName('js_news_promo_categories');
            for (let i = 0; i < ctgsDOM.length; i++) {
                if (ctgsDOM[i].dataset.url == catUrl) {
                    ctgsDOM[i].classList.add('active');
                    newsPromoData.CategoryId = ctgsDOM[i].dataset.catId;
                }
            }
        }
        getData();
    }
    if (document.getElementById('js_news_promo_popoup_cont') != null) {
        closePromoNewsPopup();
    }
};

window.addEventListener("resize", setCategoriesPlusElem);