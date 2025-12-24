var lang = $("html").attr("lang").toLowerCase();
var pageCount = 1;
var pageCountAll = 1;
var pageCountExHistory = 1;
var pageCountSpinExHistory = 1;
var pageCountDiceHistory = 1;
var LastprizePosition = 0;
var LastprizePosition2 = 0;
var fWAnimaSpeedCounter = 3000;
var fWAnimaSpeedCounter2 = 3000;
var prizeClicked = true;
var IsAll = false;
var animationProcess = false;
var autoSpinSw = false;
var autoSpinSw2 = false;
var autoSpinBuyBonus = false;
var autoSpinSwBuyBonus = false;
var stopAutoSpin = false;
var stopAutoSpinSw = false;
var stopAutoSpinSw2 = false;
var stopAutoSpinBuyBonus = false;
var stopAutoSpinSwBuyBonus = false;
var isSwTurboSpin = false;
var isSwTurboSpin2 = false;
var isSecondWheel = false;
var isSecondWheel2 = false;
var isMysteryBox = false;
var BuyBonusClicked = false;
var hasNext = false;
var hasNextAll = false;
var exchangeSpinClicked = false;
var exchangeBogClicked = false;
var exchangeSportClicked = false;
var ShakeStarted = false;
var CollectBigPrize_inProgress = false;
var tabChangeTime;

var GameStatus = {
    Active: 1,
    InActive: 2,
    Maintenance: 3,
    Disable: 4
};

var BonusStatus = {
    New: 1,
    Active: 2,
    Finished: 3,
    Cancel: 4
};

var openPopupHelper = {
    hasPlayButton: false,
    hasSpinButton: false,
    hasBetCoin: false,
    CombinationName: "",
    prizeId: "",
    BetCoinCount: 0,
    name: "",
    url: "",
}
var PromotionPopupsTypes = {
    DynamicFreeSpin: 1,
    FreeSpins: 2,
    CasinoDynamicWager: 3,
    DynamicSportFreeBet: 4,
    CurrentWheelKey: 5,
    NextWheelKey: 6,
    Money: 7,
    BetCoin: 8,
    BetcoinFinal: 9,
    Combination: 10,
    Group: 11,
    BalanceMultiplier: 12,
    Material: 13,
    FreeBet: 14,
    FreeAmount: 15,
    DynamicBetOnGames: 16,
    StandardBuyBonus: 17,
    VIPBuyBonus: 18,
    InsufficientBalance: 19,
    ExchangeStandardToVIP: 20,
    ExchangeSpinCount: 21,
    ActivatedActionProcess: 22,
    ConnectionProblem: 23,
    AutoSpinButton: 24,
    UsedAvailableSpin: 25,
    MaxSpinCount: 26,
    DynamicFreeSpinExchange: 27,
    DynamicFreeSpinBonus: 28,
    DynamicCasinoWagerExchange: 29,
    DynamicCasinoWagerBonus: 30,
    DynamicFreeBetSportExchange: 31,
    DynamicFreeBetSportBonus: 32,
    DynamicBOGExchange: 33,
    DynamicBOGBonus: 34,
    BuyBonusAutospin: 35,
    DiceLostMessage: 36,
    DiceWinMessage: 37,
    DiceCondition: 38,
    CasinoWager: 39,
    SportFreeBet: 40,
    NoWin: 41,
    Ticket: 42,
    CombinationLetter: 43,
    GroupMaterial: 44,
    GroupDynamicSportFreeBet: 45,
    GroupCasinoDynamicWager: 46,
    GroupCasinoWager: 47,
    GroupSportFreeBet: 48,
    GroupMoneyLetter: 49,
    CombinationGroupSportFreeBet: 50,
    BetCoinPrize: 51,
    BetCoinPrizeFinal: 52,
    CasinoFreeBet: 53,
    SportWager: 54,
    SportRealWager: 55,
    GeneralRealMoney: 56,
    ExchangeablePrize: 58,
    CombinationMedals: 59,
    CombinationLetters: 60,
    GroupMedals: 61,
    GroupLetters: 62,
    ExchangeablePrizeMedals: 63,
    ExchangeablePrizeLetters: 64,
    DynamicSportWagerBonus: 65,
    DynamicSportWagerExchange: 66,
}

var PrizeTypes = {
    Money: 1,
    Combination: 2,
    Material: 3,
    FreeSpins: 4,
    FreeBet: 5,
    FreeAmount: 6,
    BetCoins: 7,
    NextWheelKey: 8,
    Group: 9,
    CurrentWheelKey: 10,
    DynamicFreeSpin: 11,
    BalanceMultiplier: 12,
    DynamicSportFreeBet: 13,
    CasinoDynamicWager: 14,
    DynamicBetOnGames: 15,
    CasinoWager: 16,
    SportFreeBet: 17,
    NoWin: 18,
    CasinoFreeBet: 20,
    SportWager: 21,
    SportRealWager: 22,
    GeneralRealMoney: 23,
    DynamicSportWager: 24
};

var BetCoinRuleType = {
    None: 0,
    Main: 1,
    Wheel: 2,
    Prize: 3,
}

var musicUrl = $("#js_music").val();
var promoStartSound = new Howl({
    src: [musicUrl],
    loop: false,
});

function changeMetaName(title) {
    let meta = document.createElement('meta');
    meta.setAttribute('name', 'title');
    meta.setAttribute('content', title);
    document.getElementsByTagName('head')[0].appendChild(meta);
    document.title = title;
}
function changeMetaDescription(description) {
    let meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', description);
    document.getElementsByTagName('head')[0].appendChild(meta);
}
var Promotions = Promotions || (function () {
    return {
        init: function (args) {
            $.extend(this, args);
            let url = `/${Promotions.language}/Promo/${Promotions.ShortName}`;
            if (typeof _hasCustomMeta == 'undefined') {
                changeMetaName(`${Promotions.MetaTitle}`);
                changeMetaDescription(`${Promotions.MetaDesc}`);
            }
            changePageUrlWithoutRefreshing(url, '');
            if (args.isLoggedin || args.HistoryVisible) {
                GetPrizeWinnersList(); //check               
            }
            if (window.js_promo_main_cont) {
                //js_promo_main_cont -> promo page main container id
                const resizeObserver = new ResizeObserver(entries => handelBodyHeightChange(entries[0].target.clientHeight));
                resizeObserver.observe(window.js_promo_main_cont);
            }
        }
    }
}());
openPopup = function (className) {
    if ($("#spinnerCont").hasClass("js_bonus_activation")) {
        if ((parseInt($("#js_unused_active_bonus_count").text())) == 0) {
            Promotions.hasStandardActiveBuyBonus = false;
            $("#spinnerCont").removeClass("js_bonus_activation");
            $("#jSwheel_box__inner").empty();

            $("#js_first_animation").removeClass("bigBoxCount");
            $("#js_first_animation").removeClass("midCount");
            if (Promotions.segmentCount > 13) {
                $("#js_first_animation").addClass("bigBoxCount");
            } else if (Promotions.segmentCount > 7 && Promotions.segmentCount <= 13) {
                $("#js_first_animation").addClass("midCount");
            }

            $('#js_hasNot_sActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner");
            $("#jSwheel_box__inner").removeAttr("style");
            $(".js_has_buyBonus").css('display', 'flex');
            $(".js_BuyBonus_Exchange2").css('display', 'flex');
            $(".js_BuyBonus_Exchange1").css('display', 'flex');
            $(".js_active_bonus_text").css('display', 'none');
            if (Promotions.exchangeRate > 1) {
                $(".js_active_bonus_text").closest('.js_BuyBonus_Exchange').addClass('exchange_box_border');
                $(".js_active_bonus_text2").closest('.js_BuyBonus_Exchange').addClass('exchange_box_border');
            }
            $(".js_has_buyBonus").removeClass('border_none');

        }
    } else if ($("#wheelcontent").hasClass("js_bonus_activation")) {
        if ((parseInt($("#js_unused_active_bonus_count2").text())) == 0) {
            Promotions.hasWheelActiveBuyBonuse = false;
            $("#wheelcontent").removeClass("js_bonus_activation");
            $("#jSwheel_box__inner2").empty();
            $("#js_second_animation").removeClass("bigBoxCount");
            $("#js_second_animation").removeClass("midCount");
            if (Promotions.segmentCount2 > 13) {
                $("#js_second_animation").addClass("bigBoxCount");
            } else if (Promotions.segmentCount2 > 7 && Promotions.segmentCount2 <= 13) {
                $("#js_second_animation").addClass("midCount");
            }
            $('#js_hasNot_wActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner2");
            $(".js_has_buyBonus").css('display', 'flex');
            $(".js_BuyBonus_Exchange2").css('display', 'flex');
            $(".js_BuyBonus_Exchange1").css('display', 'flex');
            $(".js_active_bonus_text2").css('display', 'none');
            if (Promotions.exchangeRate > 1) {
                $(".js_active_bonus_text").closest('.js_BuyBonus_Exchange').addClass('exchange_box_border');
                $(".js_active_bonus_text2").closest('.js_BuyBonus_Exchange').addClass('exchange_box_border');
            }

            $(".js_has_buyBonus").removeClass('border_none');
        }
    }

    $('#popup_flex_box').removeClass('fromWhells fromCards').css('display', 'flex').addClass(className);
    document.getElementById("js_animate").scrollIntoView(false);
    /*    $("body").addClass("ofh");*/
    $('body').addClass('js_popup_active');
    isAnimationstart = false;
    $(".spinner_block_box").removeClass('animate_spin');
}
function GetPrizeWinnersList() {
    $.ajax({
        type: "POST",
        url: "/PromotionV1/GetPrizeWinnersList",
        data: { TournamentID: 4 },
        success: function (result) {
            var htmlWonPrizes = '';
            var htmlWinnersId = '';
            var disableBlock = "";
            if (result.PrizeWinnerslist != null) {
                for (let i = 0; i < result.PrizeWinnerslist.length; i++) {
                    disableBlock = "";
                    if (result.PrizeWinnerslist[i].PrizeUsedCount == 0) {
                        disableBlock = 'disabled';
                    }

                    if (Promotions.HistoryShowPrizeCount) {

                        htmlWonPrizes += '<li class="wins_status-li" >';
                        htmlWonPrizes += '<div class="wins_status js_history_block dp_winners_section_click' + disableBlock + '"  data-WonPrizes="' + i + '"><div class="wins_status_inner d-flex"><div class="wins_status-img">';
                        htmlWonPrizes += '<img src="' + Promotions.CDNURL + result.PrizeWinnerslist[i].ImageURL + '" alt="PrizeIcon">';
                        if (result.PrizeWinnerslist[i].CombinationCount > 0) {
                            htmlWonPrizes += '<span  class="prize_list-combinationCount">x' + result.PrizeWinnerslist[i].CombinationCount + '</span>';
                        }

                        htmlWonPrizes += '</div>';
                        if (result.PrizeWinnerslist[i].ShowPrizeCount) {
                            htmlWonPrizes += '<div class="wins_status--infoText"><p class="wins_status--title">' + result.PrizeWinnerslist[i].PrizeCount + ' x ' + result.PrizeWinnerslist[i].PrizeName + ' </p>';
                        } else {
                            htmlWonPrizes += '<div class="wins_status--infoText"><p class="wins_status--title">' + result.PrizeWinnerslist[i].PrizeName + ' </p>';
                        }


                        htmlWonPrizes += '<div>' + Promotions.won + ' <strong> ' + result.PrizeWinnerslist[i].PrizeUsedCount + ' </strong>';
                        if (result.PrizeWinnerslist[i].ShowPrizeCount) {
                            htmlWonPrizes += '| <span>' + Promotions.left + ' <strong>' + result.PrizeWinnerslist[i].PrizeUnUsedCount + '</strong></span>';
                        }
                        htmlWonPrizes += '</div></div></div></div> ';
                        htmlWonPrizes += '<div class="all_wins_table js_wins_table scrolled_content hidden" data-WinnersId ="' + i + '" ><div class="all_wins__divider"></div><div class="all_wins__head d-flex"><div class="all_wins__item">ID</div><div class="all_wins__item">' + Promotions.Winning + '</div></div>';
                        for (let j = 0; j < result.PrizeWinnerslist[i].UniqueIds.length; j++) {
                            htmlWonPrizes += '<div class="all_wins__row d-flex"><div class="all_wins__item">' + result.PrizeWinnerslist[i].UniqueIds[j] + '</div><div class="all_wins__item">' + result.PrizeWinnerslist[i].PrizeName + '</div></div>';
                        }
                        htmlWonPrizes += '</div></li>';

                    } else {

                        htmlWonPrizes += '<li class="wins_status-li" >';
                        htmlWonPrizes += '<div class="wins_status js_history_block dp_winners_section_click' + disableBlock + '"  data-WonPrizes="' + i + '"><div class="wins_status_inner d-flex"><div class="wins_status-img">';
                        htmlWonPrizes += '<img src="' + Promotions.CDNURL + result.PrizeWinnerslist[i].ImageURL + '" alt="PrizeIcon">';
                        if (result.PrizeWinnerslist[i].CombinationCount > 0) {
                            htmlWonPrizes += '<span  class="prize_list-combinationCount">x' + result.PrizeWinnerslist[i].CombinationCount + '</span>';
                        }

                        htmlWonPrizes += '</div>';
                        htmlWonPrizes += '<div class="wins_status--infoText"><p class="wins_status--title">' + result.PrizeWinnerslist[i].PrizeName + ' </p>';
                        htmlWonPrizes += '<div>' + Promotions.won + ' <strong> ' + result.PrizeWinnerslist[i].PrizeUsedCount + ' </strong> </div></div></div></div>';
                        htmlWonPrizes += '<div class="all_wins_table js_wins_table scrolled_content hidden" data-WinnersId ="' + i + '" ><div class="all_wins__divider"></div><div class="all_wins__head d-flex"><div class="all_wins__item">ID</div><div class="all_wins__item">' + Promotions.Winning + '</div></div>';
                        for (let j = 0; j < result.PrizeWinnerslist[i].UniqueIds.length; j++) {
                            htmlWonPrizes += '<div class="all_wins__row d-flex"><div class="all_wins__item">' + result.PrizeWinnerslist[i].UniqueIds[j] + '</div><div class="all_wins__item">' + result.PrizeWinnerslist[i].PrizeName + '</div></div>';
                        }
                        htmlWonPrizes += '</div></li>';
                    }



                }
            }

            //htmlWonPrizes += '<li class="wins_status js_history_block js_client_history" id="js_client_history"><p class="wins_status--title">';
            //htmlWonPrizes += Promotions.MyWins;
            //htmlWonPrizes += '</p></li>';

            $("#js_prizeWinnersList").html(htmlWonPrizes);
            /*$("#js_winnersId").html(htmlWinnersId);*/

        },
    });
}

function setAmountFormat(number) {
  
    if (Promotions.digitAfterPoint == "Comma") {
        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
        return formatter.format(number.replaceAll(' ', '').replaceAll(',', ''));
    } else {
        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
        return (formatter.format(number.replaceAll(' ', '').replaceAll(',', ''))).replaceAll(',', ' ');
    }
}


$(document).on('click', '.js_history_block:not(disabled)', function () {
    if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        return;
    }

    $(".promo_play_verify").css("display", "flex")
    $('#js_prizeWinnersList').find('[data-WinnersId="' + $(this).attr("data-WonPrizes") + '"]').removeClass('hidden');
    $(this).attr("data-WonPrizes");
    $('.wins_status').removeClass("active");
    $(this).addClass("active");
    /*Wins status item scroll to top*/
    $('html, body').animate({
        scrollTop: $(this).offset().top - $(this).parent().height()
    }, 300);
    if ($(this).hasClass("js_client_history")) {

        if (!$("#js_client_history").hasClass("active")) {
            $('.tablinks1').removeClass('active');
        } else {
            $("#tab3").trigger("click");
        }
    }
});

var i = 0;
var spin_exchang = 0;
var sportBet_exchang = 0;
function minusClickExchange(blockname) {
    
    var freespintypeid = 1;
    const gameList = document.querySelectorAll('.' + blockname + '_exchange_select_games [name="selectGame' + blockname + '"]');
    spin_exchang = parseFloat((document.getElementById('js_' + blockname + '_exchange_number').innerText).replaceAll(' ', '').replaceAll(',', ''));
    let MinBetAmount = parseFloat($('input[name="selectGame' + blockname + '"]:checked').data('amount'));
    if (isNaN(MinBetAmount)) {
        MinBetAmount = 1;
    }
    spin_exchang -= MinBetAmount;
    spin_exchang = spin_exchang.toFixed(1);

    if (spin_exchang > 0) {
        document.getElementById('js_' + blockname + '_exchange_number').innerText = setAmountFormat(spin_exchang);
        document.getElementById("js_" + blockname + "_plus").classList.remove("disabled");
        if (spin_exchang - MinBetAmount < MinBetAmount) {
            document.getElementById("js_" + blockname + "_minus").classList.add("disabled");
        }
    } else {
        document.getElementById("js_" + blockname + "_minus").classList.add("disabled");

        return;
    }

    for (let i = 0; i < gameList.length; i++) {

        let FreeSpinCount = 0;
        const elparent = gameList[i].parentElement.parentElement;

        if (blockname == "betongames") {
            freespintypeid = parseFloat(gameList[i].getAttribute('data-freespintypeid'));
        }


        if (spin_exchang >= MinBetAmount) {
            if (parseFloat(gameList[i].getAttribute('data-amount')) > parseFloat((document.getElementById('js_' + blockname + '_exchange_number').innerText).replaceAll(' ', '').replaceAll(',', ''))) {
                if (!gameList[i].closest('div.' + blockname + '_exchange_game_item').classList.contains('maintenance')) {
                    gameList[i].closest('div.' + blockname + '_exchange_game_item').classList.add("disabled");
                    if (gameList[i].checked) {
                        gameList[i].checked = false;
                        for (let k = 0; k < document.querySelectorAll('[name="selectGame' + blockname + '"]').length; k++) {
                            if (parseFloat(gameList[i].getAttribute('data-amount')) > parseFloat((document.getElementById('js_' + blockname + '_exchange_number').innerText).replaceAll(' ', '').replaceAll(',', ''))) {
                                if (!gameList[k].closest('div.' + blockname + '_exchange_game_item').classList.contains('maintenance')
                                    && !gameList[k].closest('div.' + blockname + '_exchange_game_item').classList.contains("disabled")) {
                                    gameList[k].checked = true;
                                }
                            }

                        }
                    }
                }
            }
            if (spin_exchang <= MinBetAmount) {
                $('#js_spin_minus').addClass('disabled');
            }
        } else if (spin_exchang < MinBetAmount) {

            if (!gameList[i].closest('div.' + blockname + '_exchange_game_item').classList.contains('maintenance')) {
                gameList[i].closest('div.' + blockname + '_exchange_game_item').classList.add("disabled");
                gameList[i].checked = false;
            }

        }

        if (parseFloat((document.getElementById('js_' + blockname + '_exchange_number').innerText).replaceAll(' ', '').replaceAll(',', '')) / parseFloat(gameList[i].getAttribute('data-amount')) >= 1 && freespintypeid == 1) {

            FreeSpinCount = parseFloat(parseFloat((document.getElementById('js_' + blockname + '_exchange_number').innerText).replaceAll(' ', '').replaceAll(',', '')) / parseFloat(gameList[i].getAttribute('data-amount')));


            if (FreeSpinCount > parseInt(Promotions.MaxBonusSpinCount)) {
                FreeSpinCount = parseInt(Promotions.MaxBonusSpinCount);
            }

            if (!elparent.classList.contains('maintenance')) {
                if (FreeSpinCount != 0) {
                    elparent.classList.remove("disabled");
                }
                elparent.getElementsByClassName("FreeSpinCount")[0].innerText = Math.floor(FreeSpinCount.toFixed(1));
            }

        } else if (freespintypeid == 1) {
            if (!elparent.classList.contains('maintenance')) {
                if (FreeSpinCount != 0) {
                    elparent.classList.remove("disabled");
                }
                elparent.getElementsByClassName("FreeSpinCount")[0].innerText = Math.floor(FreeSpinCount.toFixed(1));
            }
        }

    }

}
function plusClickExchange(blockname) {

    var freespintypeid = 1;
    const gameList = document.querySelectorAll('.' + blockname + '_exchange_select_games [name="selectGame' + blockname + '"]');
    spin_exchang = parseFloat((document.getElementById('js_' + blockname + '_exchange_number').innerText).replaceAll(' ', '').replaceAll(',', ''));
    max_spin_exchang = parseFloat((document.getElementById('js_bonus_infoUpdate_' + blockname).innerText).replaceAll(' ', '').replaceAll(',', ''));
    let MinBetAmount = parseFloat($('input[name="selectGame' + blockname + '"]:checked').data('amount'));

    if (isNaN(MinBetAmount)) {
        MinBetAmount = 1;
    }
    
    spin_exchang += MinBetAmount;
    spin_exchang = spin_exchang.toFixed(1);

    //js_bonus_infoUpdate
    if (spin_exchang <= max_spin_exchang) {
        document.getElementById('js_' + blockname + '_exchange_number').innerText = setAmountFormat(spin_exchang.replaceAll(' ', '').replaceAll(',', ''));
        document.getElementById("js_" + blockname + "_minus").classList.remove("disabled");
        if (spin_exchang == max_spin_exchang) {
            document.getElementById("js_" + blockname + "_plus").classList.add("disabled");
        }

        if (spin_exchang + MinBetAmount > max_spin_exchang) {
            document.getElementById("js_" + blockname + "_plus").classList.add("disabled");
        }

    } else {
        document.getElementById("js_" + blockname + "_plus").classList.add("disabled");
        document.getElementById("js_" + blockname + "_minus").classList.remove("disabled");
        return;
    }


    for (let i = 0; i < gameList.length; i++) {
        if (blockname == "betongames") {
            freespintypeid = parseFloat(gameList[i].getAttribute('data-freespintypeid'));
        }

        let FreeSpinCount = 0;
        const elparent = gameList[i].parentElement.parentElement;

        if (parseFloat((document.getElementById('js_' + blockname + '_exchange_number').innerText).replaceAll(' ', '').replaceAll(',', '')) / parseFloat(gameList[i].getAttribute('data-amount')) >= 1 && freespintypeid == 1) {

            FreeSpinCount = parseFloat(parseFloat((document.getElementById('js_' + blockname + '_exchange_number').innerText).replaceAll(' ', '').replaceAll(',', '')) / parseFloat(gameList[i].getAttribute('data-amount')));

            if (FreeSpinCount > parseInt(Promotions.MaxBonusSpinCount)) {
                FreeSpinCount = parseInt(Promotions.MaxBonusSpinCount);
            }

            if (!elparent.classList.contains('maintenance')) {
                elparent.getElementsByClassName("FreeSpinCount")[0].innerText = Math.floor(FreeSpinCount.toFixed(1));
            }
        }
        else if (freespintypeid == 1) {
            if (!elparent.classList.contains('maintenance')) {
                elparent.getElementsByClassName("FreeSpinCount")[0].innerText = Math.floor(FreeSpinCount.toFixed(1));
            }
        }

        if (parseInt(gameList[i].getAttribute('data-amount')) > parseInt((document.getElementById('js_' + blockname + '_exchange_number').innerText).replaceAll(' ', '').replaceAll(',', ''))) {
            gameList[i].closest('div.' + blockname + '_exchange_game_item').classList.add("disabled");

        } else {
            gameList[i].closest('div.' + blockname + '_exchange_game_item').classList.remove("disabled");

        }

    }

}
function minusWagerClick() {
    // dynamicBonusSportAmount  
    var decrease = 1;
    decrease = parseFloat((Promotions.dynamicBonusCasinoAmount).replaceAll(' ', '').replaceAll(',', ''));
    console.log(decrease);
    sportBet_exchang = parseFloat((document.getElementById('js_wager_number').innerText).replaceAll(' ', '').replaceAll(',', ''));
    sportBet_exchang -= decrease;
    sportBet_exchang = sportBet_exchang.toFixed(1);
    if (sportBet_exchang >= decrease) {
        document.getElementById('js_wager_number').innerText = setAmountFormat(sportBet_exchang.replaceAll(' ', '').replaceAll(',', ''));
        document.getElementById("js_plus_wager").classList.remove("disabled");
        $('.wager_game_radio').each(function () {
            $(this).removeClass("disabledWager");
        })
    } else {
        document.getElementById('js_wager_number').innerText = setAmountFormat(sportBet_exchang.replaceAll(' ', '').replaceAll(',', ''));
        $('.wager_game_radio').each(function () {
            $(this).addClass("disabledWager");
        })
        document.getElementById("js_minus_wager").classList.add("disabled");

        if (parseFloat((document.getElementById('js_bonus_infoUpdate_wager').innerText).replaceAll(' ', '').replaceAll(',', '')) > decrease) {
            document.getElementById("js_plus_wager").classList.remove("disabled");
        }

        if (parseFloat((document.getElementById('js_wager_number').innerText).replaceAll(' ', '').replaceAll(',', '')) == 0) {
            $(".confirm_wager").addClass("disabled");
        }
        return;
    }
}
function plusWagerClick() {

    var increase = 1;    
    increase = parseFloat((Promotions.dynamicBonusCasinoAmount).replaceAll(' ', '').replaceAll(',', ''));
    sportBet_exchang = parseFloat((document.getElementById('js_wager_number').innerText).replaceAll(' ', '').replaceAll(',', ''));
    sportBet_exchang_player = parseFloat((document.getElementById('js_bonus_infoUpdate_wager').innerText).replaceAll(' ', '').replaceAll(',', ''));
    //max_sportBet_exchang = max_sportBet_exchang > Promotions.MaxWagerExchangeAmount ? Promotions.MaxWagerExchangeAmount : sportBet_exchang_player;
    max_sportBet_exchang = sportBet_exchang_player;
    sportBet_exchang += increase;
    sportBet_exchang = sportBet_exchang.toFixed(1);
    if (sportBet_exchang <= max_sportBet_exchang) {
        document.getElementById('js_wager_number').innerText = setAmountFormat(sportBet_exchang.replaceAll(' ', '').replaceAll(',', ''));
        document.getElementById("js_minus_wager").classList.remove("disabled");
        if (sportBet_exchang > 0) {
            $('.wager_game_radio').each(function () {
                $(this).removeClass("disabledWager");
            })
        }
        if (sportBet_exchang == (Promotions.MaxFreeBetExchangeAmount).replaceAll(' ', '').replaceAll(',', '') || sportBet_exchang == max_sportBet_exchang) {
            document.getElementById("js_plus_wager").classList.add("disabled");
        }
        console.log(parseFloat((document.getElementById('js_wager_number').innerText).replaceAll(' ', '').replaceAll(',', '')));
        if (parseFloat((document.getElementById('js_wager_number').innerText).replaceAll(' ', '').replaceAll(',', '')) > 0) {
            $(".confirm_wager").removeClass("disabled");
        }
    } else {
        document.getElementById("js_plus_wager").classList.add("disabled");
        document.getElementById("js_minus_wager").classList.remove("disabled");
        return;
    }

}

function WagerBetExchange() {
    let ClientEvrntSelectedAmount = parseFloat(($('#js_wager_number').text()).replaceAll(' ', '').replaceAll(',', ''));

    if (exchangeSportClicked || ClientEvrntSelectedAmount > (Promotions.MaxWagerExchangeAmount).replaceAll(' ', '').replaceAll(',', '')) {
        return
    }

    let EventId = 0;

    if ($('input[name="coefficientSelect"]:checked').val() !== undefined && ClientEvrntSelectedAmount != 0) {
        EventId = $('input[name="coefficientSelect"]:checked').val();
    } else {
        return
    }
    console.log(ClientEvrntSelectedAmount);
    exchangeSportClicked = true;
    $.ajax({
        type: "POST",
        url: "/PromotionV1/ExchangeClientDinamicBonus",
        data: { PromotionId: Promotions.promotionId, PromotionEntryId: Promotions.activeClientEntryId, Id: EventId, Amount: ClientEvrntSelectedAmount, TypeId: 3 },
        success: function (result) {
            if (result.Success) {
                
                if (((result.RemainingAmount).toString()).replaceAll(' ', '').replaceAll(',', '') > (Promotions.MaxWagerExchangeAmount).replaceAll(' ', '').replaceAll(',', '')) {
                    document.getElementById('js_wager_number').innerText = Promotions.MaxWagerExchangeAmount;
                } else {
                    document.getElementById('js_wager_number').innerText = result.RemainingAmount;
                }
          
                document.getElementById('js_wager_14').innerText = result.RemainingAmount;
                document.getElementById('js_wager_format_14').innerText =  setAmountFormat(((result.RemainingAmount).toString()).replaceAll(' ', '').replaceAll(',', ''));
                document.getElementById('js_bonus_infoUpdate_wager').innerText = result.RemainingAmount;

                BlockOrdering();

                /*$('body').removeClass('ofh');*/
                $('body').removeClass('js_popup_active');
                $("#popupTxt").remove();
                $("#prizeInfopop").html('');

                $('#wager_popup').hide();
                $(".spinner_popup_error").hide();

                BlockOrdering();

                $('.popup_flex_box ').css('display', 'none');
                if (Promotions.isMobileView) {
                    window.location.href = '/Bonus/NewBonuses';
                } else {
                    $(".bonusesDialog").first().trigger("click");
                }

            } else {
                $('#wager_popup').hide();
                /*$('body').removeClass('ofh');*/
                $('body').removeClass('js_popup_active');
                setPopupErrText(result.JSMessage);
            }

            exchangeSportClicked = false;
            pageCountSpinExHistory = 1;
            $('#tab6').removeClass('updated');
            $('#tab3').trigger('click');
        }
    })

}

//freebet exchange start
function minusSportClick() {

    var decrease = 1;
    decrease = parseFloat((Promotions.dynamicBonusSportAmount).replaceAll(' ', '').replaceAll(',', ''));

    sportBet_exchang = parseFloat((document.getElementById('js_sportBet_exchange_number').innerText).replaceAll(' ', '').replaceAll(',', ''));
    sportBet_exchang -= decrease;
    sportBet_exchang = sportBet_exchang.toFixed(1);
    if (sportBet_exchang >= decrease) {
        document.getElementById('js_sportBet_exchange_number').innerText = setAmountFormat(sportBet_exchang.replaceAll(' ', '').replaceAll(',', ''));
        document.getElementById("js_plus_sport").classList.remove("disabled");
        $('.sportBet_game_radio').each(function () {
            $(this).removeClass("disabled");
        })
    } else {
        document.getElementById('js_sportBet_exchange_number').innerText = setAmountFormat(sportBet_exchang.replaceAll(' ', '').replaceAll(',', ''));
        $('.sportBet_game_radio').each(function () {
            $(this).addClass("disabled");
        })
        document.getElementById("js_minus_sport").classList.add("disabled");

        if (parseFloat((document.getElementById('js_sportBet_exchange_number').innerText).replaceAll(' ', '').replaceAll(',', '')) == 0) {
            $(".confirm_sport").addClass("disabled");
        }

        if (parseFloat((document.getElementById('js_bonus_infoUpdate_sportBet').innerText).replaceAll(' ', '').replaceAll(',', '')) > 0) {
            document.getElementById("js_plus_sport").classList.remove("disabled");
        }

        return;
    }


}
function plusSportClick() {

    var increase = 1;
    increase = parseFloat((Promotions.dynamicBonusSportAmount).replaceAll(' ', '').replaceAll(',', ''));
    
    sportBet_exchang = parseFloat((document.getElementById('js_sportBet_exchange_number').innerText).replaceAll(' ', '').replaceAll(',', ''));
    //max_sportBet_exchang = Promotions.MaxFreeBetExchangeAmount;
    max_sportBet_exchang = parseFloat((document.getElementById('js_bonus_infoUpdate_sportBet').innerText).replaceAll(' ', '').replaceAll(',', ''));
    sportBet_exchang += increase;
    sportBet_exchang = sportBet_exchang.toFixed(1);
    //js_bonus_infoUpdate
    if (sportBet_exchang <= max_sportBet_exchang) {
        document.getElementById('js_sportBet_exchange_number').innerText = setAmountFormat(sportBet_exchang.replaceAll(' ', '').replaceAll(',', ''));
        document.getElementById("js_minus_sport").classList.remove("disabled");
        if (sportBet_exchang > 0) {
            $('.sportBet_game_radio').each(function () {
                $(this).removeClass("disabled");
            })
        }
        if (sportBet_exchang == max_sportBet_exchang) {
            document.getElementById("js_plus_sport").classList.add("disabled");
        }
        if (parseFloat((document.getElementById('js_sportBet_exchange_number').innerText).replaceAll(' ', '').replaceAll(',', '')) > 0) {
            $(".confirm_sport").removeClass("disabled");
        }
    } else {
        document.getElementById("js_plus_sport").classList.add("disabled");
        document.getElementById("js_minus_sport").classList.remove("disabled");
        if (parseFloat((document.getElementById('js_sportBet_exchange_number').innerText).replaceAll(' ', '').replaceAll(',', '')) > 0) {
            $(".confirm_sport").removeClass("disabled");
        }
        return;
    }

}

function SportBetExchange() {

    let ClientEvrntSelectedAmount = parseFloat(($('#js_sportBet_exchange_number').text()).replaceAll(' ', '').replaceAll(',', ''));

    let EventId = 0;

    if ($('#sportBet_popup input[name="coefficientSelect"]:checked').val() !== undefined && ClientEvrntSelectedAmount != 0) {
        EventId = $('#sportBet_popup input[name="coefficientSelect"]:checked').val();
    } else {
        return
    }

    exchangeSportClicked = true;
    $.ajax({
        type: "POST",
        url: "/PromotionV1/ExchangeClientDinamicBonus",
        data: { PromotionId: Promotions.promotionId, PromotionEntryId: Promotions.activeClientEntryId, Id: EventId, Amount: ClientEvrntSelectedAmount, TypeId: 2 },
        success: function (result) {
            if (result.Success) {

                if (result.RemainingAmount > Promotions.MaxFreeBetExchangeAmount) {
                    document.getElementById('js_sportBet_exchange_number').innerText = Promotions.MaxFreeBetExchangeAmount;
                } else {
                    document.getElementById('js_sportBet_exchange_number').innerText = result.RemainingAmount;
                }

                document.getElementById('js_sport_13').innerText = result.RemainingAmount;
                document.getElementById('js_sport_format_13').innerText =  setAmountFormat(((result.RemainingAmount).toString()).replaceAll(' ', '').replaceAll(',', ''));
                document.getElementById('js_bonus_infoUpdate_sportBet').innerText = result.RemainingAmount;

                if (parseInt(result.RemainingAmount) > 0) {
                    $("#js_open_sportBet_popup").removeClass('disable');
                } else {
                    $("#js_open_sportBet_popup").addClass('disable');
                }

                $('#sportBet_plus_minus_content').hide();
                $('body').removeClass('noscroll');
                $("#popupTxt").remove();
                $("#prizeInfopop").html('');

                $('#sportBet_popup').css('display', 'none');

                $(".spinner_popup_error").hide();

                if (Promotions.isMobileView) {
                    window.location.href = '/Bonus/NewBonuses';
                } else {
                    $(".bonusesDialog").first().trigger("click");
                }

                BlockOrdering();

            } else {
                $('#sportBet_popup').css('display', 'none');
                $('body').removeClass('noscroll');
                setPopupErrText(result.JSMessage);
            }
            $('body').removeClass('js_popup_active')
            exchangeSportClicked = false;
            pageCountSpinExHistory = 1;
            $('#tab6').removeClass('updated');
            $('#tab3').trigger('click');
        }
    })

}

function minusSportWagerClick() {
    var decrease = 1;
    
    decrease = parseFloat(Promotions.dynamicBonusSportAmount);

    sportBet_exchang = parseFloat(document.getElementById('js_sportWager_exchange_number').innerText);
    sportBet_exchang -= decrease;
    sportBet_exchang = sportBet_exchang.toFixed(1);
    if (sportBet_exchang >= decrease) {
        document.getElementById('js_sportWager_exchange_number').innerText = sportBet_exchang;
        document.getElementById("js_plus_SportWager").classList.remove("disabled");
        $('.sportWager_game_radio').each(function () {
            $(this).removeClass("disabled");
        })
    } else {
        document.getElementById('js_sportWager_exchange_number').innerText = sportBet_exchang;
        $('.sportWager_game_radio').each(function () {
            $(this).addClass("disabled");
        })
        document.getElementById("js_minus_SportWager").classList.add("disabled");

        if (parseFloat(document.getElementById('js_sportWager_exchange_number').innerText) > 0) {
            document.getElementById("js_plus_SportWager").classList.remove("disabled");
        }

        return;
    }
}
function plusSportWagerClick() {
    var increase = 1;
    increase = parseFloat(Promotions.dynamicBonusSportAmount);
    sportBet_exchang = parseFloat(document.getElementById('js_sportWager_exchange_number').innerText);
    //max_sportBet_exchang = Promotions.MaxFreeBetExchangeAmount;
    max_sportBet_exchang = parseFloat(document.getElementById('js_bonus_infoUpdate_sport_wager').innerText);
    
    sportBet_exchang += increase;
    sportBet_exchang = sportBet_exchang.toFixed(1);
    //js_bonus_infoUpdate
    if (sportBet_exchang <= max_sportBet_exchang) {
        document.getElementById('js_sportWager_exchange_number').innerText = sportBet_exchang;
        document.getElementById("js_minus_SportWager").classList.remove("disabled");
        if (sportBet_exchang > 0) {
            $('.sportWager_game_radio').each(function () {
                $(this).removeClass("disabled");
            })
        }
        if (sportBet_exchang == max_sportBet_exchang) {
            document.getElementById("js_plus_SportWager").classList.add("disabled");
        }
    } else {
        document.getElementById("js_plus_SportWager").classList.add("disabled");
        document.getElementById("js_minus_SportWager").classList.remove("disabled");
        return;
    }

}

function SportWagerExchange() {

    let ClientEvrntSelectedAmount = parseFloat($('#js_sportWager_exchange_number').text());

    let EventId = 0;

    if ($('#sportWager_popup input[name="coefficientSelect"]:checked').val() !== undefined && ClientEvrntSelectedAmount != 0) {
        EventId = $('#sportWager_popup input[name="coefficientSelect"]:checked').val();
    } else {
        return
    }

    exchangeSportClicked = true;
    $.ajax({
        type: "POST",
        url: "/PromotionV1/ExchangeClientDinamicBonus",
        data: { PromotionId: Promotions.promotionId, PromotionEntryId: Promotions.activeClientEntryId, Id: EventId, Amount: ClientEvrntSelectedAmount, TypeId: 5 },
        success: function (result) {
            if (result.Success) {

                if (result.RemainingAmount > Promotions.MaxSportWagerExchangeAmount) {
                    document.getElementById('js_sportWager_exchange_number').innerText = Promotions.MaxSportWagerExchangeAmount;
                } else {
                    document.getElementById('js_sportWager_exchange_number').innerText = result.RemainingAmount;
                }

                document.getElementById('js_sport_24').innerText = result.RemainingAmount;
                document.getElementById('js_sport_format_24').innerText = setAmountFormat(((result.RemainingAmount).toString()).replaceAll(' ', '').replaceAll(',', ''));
                document.getElementById('js_bonus_infoUpdate_sport_wager').innerText = result.RemainingAmount;

                if (parseInt(result.RemainingAmount) > 0) {
                    $("#js_open_sportWager_popup").removeClass('disable');
                } else {
                    $("#js_open_sportWager_popup").addClass('disable');
                }

                $('#sportWager_plus_minus_content').hide();
                $('body').removeClass('noscroll');
                $("#popupTxt").remove();
                $("#prizeInfopop").html('');

                $('#sportWager_popup').css('display', 'none');

                $(".spinner_popup_error").hide();

                if (Promotions.isMobileView) {
                    window.location.href = '/Bonus/NewBonuses';
                } else {
                    $(".bonusesDialog").first().trigger("click");
                }

                BlockOrdering();

            } else {
                $('#sportBet_popup').css('display', 'none');
                $('body').removeClass('noscroll');
                setPopupErrText(result.JSMessage);
            }
            $('body').removeClass('js_popup_active')
            exchangeSportClicked = false;
            pageCountSpinExHistory = 1;
            $('#tab6').removeClass('updated');
            $('#tab3').trigger('click');
        }
    })

}

$(document).on("change", "#sportBet_popup .sport_select_games input[type = radio]", function () {

    $('#sportBet_popup .sport_select_games input[type = radio]').each(function () {
        $(this).closest('#sportBet_popup .sportBet_game_radio').removeClass('disabledSport');
        $(this).closest('#sportBet_popup .sportBet_game_radio').removeClass('checked');
        if (!$(this).is(":checked")) {
            $(this).closest('#sportBet_popup .sportBet_game_radio').addClass('disabledSport');
        } else {
            $("#js_sportBet_exchange_number").text(setAmountFormat(($("#js_bonus_infoUpdate_sportBet").text()).replaceAll(' ', '').replaceAll(',', '')));
            $("#js_plus_sport").addClass("disabled");
            $(this).closest('#sportBet_popup .sportBet_game_radio').addClass('checked');
        }
    })

});
$(document).on("change", "#sportWager_popup .sport_select_games input[type = radio]", function () {

    $('#sportWager_popup .sport_select_games input[type = radio]').each(function () {
        $(this).closest('#sportWager_popup .sportWager_game_radio').removeClass('disabledSport');
        $(this).closest('#sportWager_popup .sportWager_game_radio').removeClass('checked');
        if (!$(this).is(":checked")) {
            $(this).closest('#sportWager_popup .sportWager_game_radio').addClass('disabledSport');
        } else {
            $("#js_sportWager_exchange_number").text(setAmountFormat(($("#js_bonus_infoUpdate_sport_wager").text()).replaceAll(' ', '').replaceAll(',', '')));
            $("#js_plus_sport_wager").addClass("disabled");
            $(this).closest('#sportWager_popup .sportWager_game_radio').addClass('checked');
        }
    })

});

//freebet exchange end

$(document).on("change", ".spin_exchange_game_item input[type = radio]", function () {
    $('.spin_exchange_game_item input[type = radio]').each(function () {
        $(this).closest('.select_game_radio').removeClass('checked');
        if ($(this).is(":checked")) {
            //alert($(this).attr("data-amount"));
            // $("#js_spin_exchange_number").text(($("#js_bonus_infoUpdate_spin").text()).replace(",", ".").replace("/", ".").replace("/", "."));
            $("#js_spin_exchange_number").text($("#js_bonus_infoUpdate_spin").text());
            $('#js_spin_plus').addClass('disabled');
            let MaxExAmount = parseFloat($("#js_bonus_infoUpdate_spin").text());
            if (MaxExAmount > 0) {
                $('#js_spin_minus').removeClass('disabled');
            }
            $(this).closest('.select_game_radio').addClass('checked');
        }
    })

});

$(document).on("change", ".betongames_exchange_game_item input[type = radio]", function () {
    $('.betongames_exchange_game_item input[type = radio]').each(function () {
        $(this).closest('.select_game_radio').removeClass('checked');
        if ($(this).is(":checked")) {
            $("#js_betongames_exchange_number").text(setAmountFormat(($("#js_bonus_infoUpdate_betongames").text()).replaceAll(' ', '').replaceAll(',', '')));
            $('#js_betongames_plus').addClass('disabled');
            let MaxExAmount = parseFloat($("#js_bonus_infoUpdate_betongames").text());
            if (MaxExAmount > 0) {
                $('#js_betongames_minus').removeClass('disabled');
            }
            $(this).closest('.select_game_radio').addClass('checked');
        }
    })

});

function GetAllPrizesHistories() {
    allowScroll = false;

    if (Promotions.ShowAllPlayersHistory) {
        IsAll = true;
    }
    $.ajax({
        type: "POST",
        data: { PromotionId: Promotions.promotionId, Page: pageCountAll, Top: 10, IsAll: IsAll },
        url: "/PromotionV1/GetClientPrizesHistoriesLen",
        success: function (result) {
            var html = "";
            var htmlheader = "";
            if (result.Success == true) {
                $('#tab3').addClass('updated');
                var prizes = result.History;

                hasNextAll = result.HasNext;
                if (prizes.length > 0) {
                    htmlheader += '<li class="top_winners_head d-flex">';
                    if (Promotions.ShowAllPlayersHistory) {
                        htmlheader += '<span class="top_winners_item">' + Promotions.translation['UserId'] + "</span>";
                    }
                    htmlheader += "<span class='top_winners_item'>" +
                        Promotions.translation['Prize'] +
                        "</span><span class='top_winners_item'>" +
                        Promotions.translation['Date'] +
                        "</span></li>";
                    for (var i = 0; i < prizes.length; i++) {

                        html += '<li class="d-flex top_winners_line">';
                        if (Promotions.ShowAllPlayersHistory) {
                            html += '<span class="top_winners_item">' + prizes[i].ClientId + "</span>";
                        }
                        html += "<span class='top_winners_item'>" +
                            prizes[i].PrizeName +
                            "</span><span class='top_winners_item'>" +
                            prizes[i].CreationDate +
                            "</span></li>";

                    }
                } else {
                    if (pageCountAll == 1)
                        html += "<p class='top_winners_item text-center'>" + Promotions.translation['NoWinningsYet'] + "</p>";
                }

                if (pageCountAll == 1) {
                    setTimeout(function () {
                        $('#mCSB_2_scrollbar_vertical').css('display', 'none');
                    }, 100);
                    $('#mCSB_2_container').html("");
                }
                pageCountAll++;

                allowScroll = true;

                $('#mCSB_2_container').append(html);
                $("#mCSB_2_container").css("display", "block");

                $("#historyDate").html(htmlheader);

            }
        }
    });
}
function GetClientPrizesHistories() {
    allowScroll = false;
    $.ajax({
        type: "POST",
        data: { PromotionId: Promotions.promotionId, Page: pageCount, Top: 10, IsAll: false },
        url: "/PromotionV1/GetClientPrizesHistoriesLen",
        success: function (result) {

            var html = "";
            var htmlheader = "";
            $("#tab4").addClass('updated');
            if (result.Success == true) {
                $("#tab4").addClass("updated");
                var prizes = result.History;

                hasNext = result.HasNext;

                if (prizes.length > 0) {
                    htmlheader +=
                        '<li class="top_winners_head d-flex">' +
                        "<span class='top_winners_item'>" +
                        Promotions.translation['Prize'] +
                        "</span><span class='top_winners_item'>" +
                        Promotions.translation['Date'] +
                        "</span></li>";
                    for (var i = 0; i < prizes.length; i++) {

                        html +=
                            '<li class="d-flex top_winners_line">' +
                            "<span class='top_winners_item'>" +
                            prizes[i].PrizeName +
                            "</span><span class='top_winners_item'>" +
                            prizes[i].CreationDate +
                            "</span></li>";

                    }

                } else {
                    if (pageCount == 1) {
                        setTimeout(function () {
                            $('#mCSB_1_scrollbar_vertical').css('display', 'none');
                        }, 100);
                        html += "<p class='top_winners_item text-center'>" + Promotions.translation['NoWinningsYet'] + "</p>";
                    }
                       
                }

                if (pageCount == 1) {
                    $('#mCSB_1_container').html("");
                }
                pageCount++;

                allowScroll = true;

                $('#mCSB_1_container').append(html);
                $("#js_historyDate").html(htmlheader);
            }
        }
    });
}
function GetClientExchangeHistory() {
    allowScrollExHistory = false;
    $.ajax({
        type: "POST",
        url: "/PromotionV1/GetClientExchangeHistory",
        data: { PromotionId: Promotions.promotionId, Page: pageCountExHistory, Top: 10 },
        success: function (result) {
            var html = "";
            var htmlheader = "";
            if (result.Success == true) {
                $("#tab5").addClass("updated");
                var prizes = result.ClientExchangeHistory;
                hasNextExHistory = result.HasNext;

                if (prizes.length > 0) {
                    htmlheader +=
                        '<li class="top_winners_head d-flex"><span class="top_winners_item">' +
                        Promotions.translation['Date'] +
                        "</span>" +
                        "<span class='top_winners_item uppercase'>" +
                        Promotions.ExchangeChances +
                        "</span><span class='top_winners_item uppercase'>" +
                        Promotions.VipSpin +
                        "</span><span class='top_winners_item uppercase'>" +
                        Promotions.StandardRemaining +
                        "</span></li>";

                    for (var i = 0; i < prizes.length; i++) {
                        html +=
                            '<li class="d-flex top_winners_line"><span class="top_winners_item">' +
                            prizes[i].CreationTimeDynamic +
                            "</span>" +
                            "<span class='top_winners_item'>" +
                            prizes[i].ExchangedPoints +
                            "</span><span class='top_winners_item'>" +
                            prizes[i].ExchangedWheelPoints +
                            "</span><span class='top_winners_item'>" +
                            prizes[i].RemainingPoints +
                            "</span></li>";
                    }
                } else {
                    if (pageCountExHistory == 1) {
                        setTimeout(function () {
                            $('#mCSB_4_scrollbar_vertical').css('display', 'none');
                        }, 100);  
                        
                        html += "<p class='top_winners_item text-center'>" + Promotions.translation['NoWinningsYet'] + "</p>";
                    }
                       
                }
            }
            if (pageCountExHistory == 1) {
                $('#mCSB_4_container').html("");
            }
            pageCountExHistory++

            $('#mCSB_4_container').append(html);
            allowScrollExHistory = true;
            $("#js_exchange_historyDate").html(htmlheader);
        },
    });
}
function GetClientSpinExchangeHistory() {
    allowScrollSpinExHistory = false;
    $.ajax({
        type: "POST",
        url: "/PromotionV1/GetClientSpinExchangeHistory",
        data: { PromotionId: Promotions.promotionId, Page: pageCountSpinExHistory, Top: 10 },
        success: function (result) {
            var html = "";
            var htmlheader = "";
            if (result.Success == true) {
                $("#tab6").addClass("updated");
                var SpinExchange = result.ClientSpinExchangeHistory;
                hasNextExHistory = result.HasNext;

                if (SpinExchange.length > 0) {
                    htmlheader +=
                        '<li class="top_winners_head d-flex"><span class="top_winners_item uppercase text-uppercase">' +
                        Promotions.translation['Date'] +
                        "</span>" +
                        "<span class='top_winners_item uppercase'>" +
                        Promotions.ExchangeAmount +
                        "</span><span class='top_winners_item uppercase'>" +
                        Promotions.RecivedBonuses +
                        "</span></li>";
                    for (var s = 0; s < SpinExchange.length; s++) {
                        var url = "";

                        if (SpinExchange[s].Status == BonusStatus.New || SpinExchange[s].Status == BonusStatus.Active) {
                            if (Promotions.isMobileView) {
                                url = " <a class='active_color' href ='/Bonus/NewBonuses'>";
                            } else {
                                url = " <a class='active_color bonusesDialog' data-href ='/Bonus/NewBonuses'>";
                            }
                        }

                        if (SpinExchange[s].TypeId == 2) {//SportFreeBet
                            html +=
                                '<li class="d-flex top_winners_line exchange_spin_history"><span class="top_winners_item">' +
                                SpinExchange[s].CreationTimeDynamic +
                                "</span>" +
                                '<span class="top_winners_item">' +
                                SpinExchange[s].ExchangedAmount + " " + Promotions.currency + " " +
                                "</span><span class='top_winners_item'>" + url + " " +
                                SpinExchange[s].ExchangedAmount + " " + Promotions.currency + " " +
                                " " +
                                Promotions.DynamicSportFreeBet +
                                "</a></span></li>";
                        } else if (SpinExchange[s].TypeId == 3) { //LiveCasino
                            html +=
                                '<li class="d-flex top_winners_line exchange_spin_history"><span class="top_winners_item">' +
                                SpinExchange[s].CreationTimeDynamic +
                                "</span>" +
                                '<span class="top_winners_item">' +
                                SpinExchange[s].ExchangedAmount + " " + Promotions.currency + " " +
                                "</span><span class='top_winners_item'>" + url + ' ' +
                                SpinExchange[s].ExchangedAmount + " " + Promotions.currency + " " +
                                Promotions.LiveCasinoWager +
                                "</a></span></li>";
                        } else if (SpinExchange[s].TypeId == 5) { //DynamicSportWager
                            html +=
                                '<li class="d-flex top_winners_line exchange_spin_history"><span class="top_winners_item">' +
                                SpinExchange[s].CreationTimeDynamic +
                                "</span>" +
                                '<span class="top_winners_item">' +
                                SpinExchange[s].ExchangedAmount + " " + Promotions.currency + " " +
                                "</span><span class='top_winners_item'>" + url + ' ' +
                                SpinExchange[s].ExchangedAmount + " " + Promotions.currency + " " +
                                Promotions.WagerBonusInSport +
                                "</a></span></li>";
                        } else {
                            html +=
                                '<li class="d-flex top_winners_line exchange_spin_history"><span class="top_winners_item">' +
                                SpinExchange[s].CreationTimeDynamic +
                                "</span>" +
                                '<span class="top_winners_item">' +
                                SpinExchange[s].ExchangedAmount + " " + Promotions.currency +
                                "</span> <span class='top_winners_item'>" + url +
                                SpinExchange[s].BonusName + "</span></a></li>";
                        }


                    }
                } else {
                    if (pageCountSpinExHistory == 1)
                        html += "<p class='top_winners_item text-center'>" + Promotions.translation['NoWinningsYet'] + "</p>";
                }
            } else {
                $('#spin_exchange_popup').css('display', 'none');
                setPopupErrText(result.Message);
            }
            if (pageCountSpinExHistory == 1) {
                setTimeout(function () {
                    $('#mCSB_3_scrollbar_vertical').css('display', 'none');
                }, 100);
                $('#mCSB_3_container').html("");
            }
            pageCountSpinExHistory++

            $('#mCSB_3_container').append(html);
            allowScrollSpinExHistory = true;
            $("#js_exchange_spin_historyDate").html(htmlheader);
        },
    });
}

function GetClientDiceHistory() {
    allowScrollDiceHistory = false;
    $.ajax({
        type: "POST",
        url: "/PromotionV1/GetClientShakeHistory",
        data: { PromotionId: Promotions.promotionId, Page: pageCountDiceHistory, Top: 10 },
        success: function (result) {
            var html = "";
            var htmlheader = "";
            if (result.Success == true) {
                $("#tab7").addClass("updated");
                var DiceHistory = result.Entries;

                hasNextExHistory = result.HasNext;
                if (DiceHistory.length > 0) {
                    htmlheader +=
                        '<li class="top_winners_head flex"><span class="top_winners_item uppercase">' +
                        Promotions.translation['Date'] +
                        "</span>" +
                        "<span class='top_winners_item uppercase'>" +
                        Promotions.Combination +
                        "</span><span class='top_winners_item uppercase'>" +
                        Promotions.Winning +
                        "</span></li>";

                    for (var s = 0; s < DiceHistory.length; s++) {

                        html +=
                            '<li class="flex top_winners_line"><span class="top_winners_item">' +
                            DiceHistory[s].CreationTimeDynamic +
                            "</span>" +
                            '<span class="top_winners_item ">' +
                            DiceHistory[s].Dice1 + " : " + DiceHistory[s].Dice2 +
                            "</span><span class='top_winners_item'>" +
                            DiceHistory[s].Prize +
                            "</span></li>";
                    }

                } else {
                    if (pageCountDiceHistory == 1)
                        html += "<p class='top_winners_item text-center'>" + Promotions.translation['NoWinningsYet'] + "</p>";
                }

            } else {
                setPopupErrText(result.Message);
            }

            if (pageCountDiceHistory == 1) {

                $('#mCSB_5_container').html("");
            }
            pageCountDiceHistory++

            $('#mCSB_5_container').append(html);
            allowScrollDiceHistory = true;
            if (htmlheader != '') {
                $("#js_dice_historyDate").html(htmlheader);
            }
        },
    });
}
$('.confirm_spin_exchange').click(function () {
    let ClientSelectedAmount = parseFloat(($('#js_spin_exchange_number').text()).replaceAll(' ', '').replaceAll(',', ''));
    let MinBetAmount = parseFloat($('input[name="selectGamespin"]:checked').data('amount'));

    if (!exchangeSpinClicked) {

        if (MinBetAmount > ClientSelectedAmount || ClientSelectedAmount == 0) {
            alert("invalid Selected amount");
            return;
        } else {
            if (ClientSelectedAmount % MinBetAmount != 0) {

                ClientSelectedAmount = parseInt(ClientSelectedAmount / MinBetAmount) * MinBetAmount;

                if (parseInt(ClientSelectedAmount / MinBetAmount) > parseInt(Promotions.MaxBonusSpinCount)) {

                    ClientSelectedAmount = MinBetAmount * parseInt(Promotions.MaxBonusSpinCount);

                }
            } else {

                ClientSelectedAmount = parseInt(ClientSelectedAmount / MinBetAmount) * MinBetAmount;

                if (parseInt(ClientSelectedAmount / MinBetAmount) > parseInt(Promotions.MaxBonusSpinCount)) {

                    ClientSelectedAmount = MinBetAmount * parseInt(Promotions.MaxBonusSpinCount);

                }
            }
        }
        openPopupHelper.Keys = [];
        exchangeSpinClicked = true;
        $.ajax({
            type: "POST",
            url: "/PromotionV1/ExchangeClientDinamicBonus",
            data: { PromotionId: Promotions.promotionId, PromotionEntryId: Promotions.activeClientEntryId, Id: $('input[name="selectGamespin"]:checked').val(), Amount: ClientSelectedAmount, TypeId: 1 },
            success: function (result) {
                if (result.Success) {
                    openPopupHelper.Keys = result.Keys;
                    document.getElementById('js_spin_exchange_number').innerText = setAmountFormat(((result.RemainingAmount).toString()).replaceAll(' ', '').replaceAll(',', ''));
                    document.getElementById('js_freeSpin_11').innerText = setAmountFormat(((result.RemainingAmount).toString()).replaceAll(' ', '').replaceAll(',', ''));
                    document.getElementById('js_freeSpin_format_11').innerText = setAmountFormat(((result.RemainingAmount).toString()).replaceAll(' ', '').replaceAll(',', ''));
                    document.getElementById('js_bonus_infoUpdate_spin').innerText = setAmountFormat(((result.RemainingAmount).toString()).replaceAll(' ', '').replaceAll(',', ''));

                    if (parseInt(result.RemainingAmount) > 0) {
                        $("#js_open_exchange_11").removeClass('disabled');
                        $("#js_open_exchange_11").addClass('medals_active');
                    } else {
                        $("#js_open_exchange_11").addClass('disabled');
                        $("#js_open_exchange_11").removeClass('medals_active');
                    }

                    $('#spin_exchange_popup').hide();
                    $("#popupTxt").remove();
                    $("#prizeInfo").html();

                    $(".spinner_popup_error").hide();
                    setDynamicPopupText(result, 'spin');
                    BlockOrdering();

                } else {
                    $('#spin_exchange_popup').css('display', 'none');
                    setPopupErrText(result.JSMessage);
                }

                exchangeSpinClicked = false;
                pageCountSpinExHistory = 1;
                $('#tab6').removeClass('updated');
                $('#tab3').trigger('click');
            }
        })
    }
})
function setWheelPopupText(prizeinfo) {

    $("#popupTxt").remove();
    $("#prizeInfo").html();
    var html = "";
    var prizeType = prizeinfo.PrizeType;
    let subPrizeType = prizeinfo.PrizeSubType;
    var BetCoinRuleTypeId = prizeinfo.BetCoinRuleTypeId;

    $.ajax({
        type: "POST",
        url: "/PromotionV1/GetPopups",
        data: { TypeId: openPopupHelper.type, defoult: Promotions.DefaultLen },
        success: function (result) {       
            var description = result.Description;
            html += '<div class ="popup_header d-flex justify-content-between align-items-center">';
            if (result.Title != null) {
                html += result.Title;
            }
            html += '<span class="close_popup_button" id="js_close_popup_button"></span>';
            html += '</div>';
            html += '<div class ="popup_body">';
            html += '<div class ="popup_winItem text-center">';
            html += '<img class ="popup_winItem__img" src="' + openPopupHelper.name + '" alt="" />';

            for (var key in openPopupHelper.Keys) {
                description = description.replaceAll(key, openPopupHelper.Keys[key]);
            }

            html += '<div class ="popup_winItem__txt">';
            html += description;
            html += '</div>';

            if (openPopupHelper.widgetClone) {
                html += '<div id="js_wdg"></div>';
            }
            html += '</div>';

            html += '</div>';

            if (result.Button1 != null || result.Button2 != null) {

                html += '<div class ="popup_footer d-flex justify-content-end">';

                if (result.Button1 != null) {

                    if (prizeType == PrizeTypes.SportFreeBet ||
                        prizeType == PrizeTypes.FreeAmount ||
                        prizeType == PrizeTypes.FreeBet ||
                        prizeType == PrizeTypes.CasinoWager ||
                        prizeType == PrizeTypes.CasinoFreeBet ||
                        prizeType == PrizeTypes.SportWager ||
                        prizeType == PrizeTypes.SportRealWager ||
                        prizeType == PrizeTypes.GeneralRealMoney ||
                        prizeType == PrizeTypes.FreeSpins) {
                        html += '<button class="btn_popup btn_popup__primary" id="js_see_button">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.CasinoDynamicWager) {
                        html += '<button class="btn_popup btn_popup__primary" id="js_see_button_Wager">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.DynamicFreeSpin) {
                        html += '<button class="btn_popup btn_popup__primary" id="js_see_button_freespin">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.DynamicBetOnGames) {
                        html += '<button class="btn_popup btn_popup__primary" id="js_see_button_bog">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.DynamicSportFreeBet) {
                        html += '<button class="btn_popup btn_popup__primary" id="js_see_button_exchange_sport">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.DynamicSportWager) {
                        html += '<button class="btn_popup btn_popup__primary" id="js_see_button_exchange_sportWager">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.CurrentWheelKey) {
                        html += '<button class="btn_popup btn_popup__primary js_fw_spin_btn_popup">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.NextWheelKey) {
                        html += '<button class="btn_popup btn_popup__primary js_sw_spin_btn_popup">' + result.Button1 + '</button>';
                    } else if (BetCoinRuleTypeId == BetCoinRuleType.Wheel && (prizeType == PrizeTypes.BetCoins && openPopupHelper.BetCoinCount == 0)) {
                        html += '<button class="btn_popup btn_popup__primary js_sw_spin_btn_popup">' + result.Button1 + '</button>';
                    } else if (BetCoinRuleTypeId == BetCoinRuleType.Main && (prizeType == PrizeTypes.BetCoins && openPopupHelper.BetCoinCount == 0)) {
                        html += '<button class="btn_popup btn_popup__primary js_sw_spin_btn_popup2">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.FreeSpins || prizeType == PrizeTypes.FreeBet || prizeType == PrizeTypes.FreeAmount) {
                        html += '<button class="btn_popup btn_popup__primary js_notify_to_parent" data-type="cw_gameLaunch" data-game-url="' + result.GameUrl2 + '" data-lobby-url="' + result.UniqueUrlName + '">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.Group) {
                        if (subPrizeType == PrizeTypes.SportFreeBet ||
                            subPrizeType == PrizeTypes.FreeAmount ||
                            subPrizeType == PrizeTypes.FreeBet ||
                            subPrizeType == PrizeTypes.CasinoWager ||
                            subPrizeType == PrizeTypes.FreeSpins) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button">' + result.Button1 + '</button>';
                        } else if (subPrizeType == PrizeTypes.CasinoDynamicWager) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_Wager">' + result.Button1 + '</button>';
                        } else if (subPrizeType == PrizeTypes.DynamicFreeSpin) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_freespin">' + result.Button1 + '</button>';
                        } else if (subPrizeType == PrizeTypes.DynamicBetOnGames) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_bog">' + result.Button1 + '</button>';
                        } else if (subPrizeType == PrizeTypes.DynamicSportFreeBet) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_exchange_sport">' + result.Button1 + '</button>';
                        } else if (subPrizeType == PrizeTypes.DynamicSportWager) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_exchange_sportWager">' + result.Button1 + '</button>';
                        } else if (subPrizeType == PrizeTypes.CurrentWheelKey) {
                            html += '<button class="btn_popup btn_popup__primary js_fw_spin_btn_popup">' + result.Button1 + '</button>';
                        }
                    } else if (prizeType == PrizeTypes.BetCoins && prizeinfo.ClientBetCoins == 0 && prizeinfo.BetCoinRuleTypeId == BetCoinRuleType.Prize) {

                        prizeType = prizeinfo.PrizeSubType;
                        if (prizeType == PrizeTypes.SportFreeBet ||
                            prizeType == PrizeTypes.FreeAmount ||
                            prizeType == PrizeTypes.FreeBet ||
                            prizeType == PrizeTypes.CasinoWager ||
                            prizeType == PrizeTypes.FreeSpins) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button">' + result.Button1 + '</button>';
                        } else if (prizeType == PrizeTypes.CasinoDynamicWager) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_Wager">' + result.Button1 + '</button>';
                        } else if (prizeType == PrizeTypes.DynamicFreeSpin) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_freespin">' + result.Button1 + '</button>';
                        } else if (prizeType == PrizeTypes.DynamicBetOnGames) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_bog">' + result.Button1 + '</button>';
                        } else if (prizeType == PrizeTypes.DynamicSportFreeBet) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_exchange_sport">' + result.Button1 + '</button>';
                        } else if (subPrizeType == PrizeTypes.DynamicSportWager) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_exchange_sportWager">' + result.Button1 + '</button>';
                        } else if (prizeType == PrizeTypes.CurrentWheelKey) {
                            html += '<button class="btn_popup btn_popup__primary js_fw_spin_btn_popup">' + result.Button1 + '</button>';
                        } else if (prizeType == PrizeTypes.NextWheelKey) {
                            html += '<button class="btn_popup btn_popup__primary js_sw_spin_btn_popup">' + result.Button1 + '</button>';
                        } else if (prizeType == PrizeTypes.FreeSpins || prizeType == PrizeTypes.FreeBet || prizeType == PrizeTypes.FreeAmount) {
                            html += '<button class="btn_popup btn_popup__primary js_notify_to_parent" data-type="cw_gameLaunch" data-game-url="' + result.GameUrl2 + '" data-lobby-url="' + result.UniqueUrlName + '">' + result.Button1 + '</button>';
                        } else if (prizeType == PrizeTypes.Group && subPrizeType == PrizeTypes.CasinoWager) {
                            html += '<button class="btn_popup btn_popup__primary js_notify_to_parent" data-type="cw_openBonusPage" id="js_see_button">' + result.Button1 + '</button>';
                        }

                    }
                    else {
                        html += '<button class="btn_popup btn_popup__primary">' + result.Button1 + '</button>';
                    }
                }

                if (result.Button2 != null) {
                    if (prizeType == PrizeTypes.CurrentWheelKey) {
                        html += '<button class="btn_popup btn_popup__secondary js_auto_spin_popup" id="">' + result.Button2 + '</button>';
                    } else {
                        if ((prizeType == PrizeTypes.Group)) {
                            html += '<input type="hidden" value="' + prizeinfo.WonPrizeId + '" class="PrizeWinnerId">';
                            html += '<input type="hidden" value="' + prizeinfo.BigPrizeGroupId + '" class="ExchangeId">';
                            html += '<button class="btn_popup btn_popup__primary js_prize_exchange_popup_confirm" id="">' + result.Button2 + '</button>';
                        } else {
                            html += '<button class="btn_popup btn_popup__secondary">' + result.Button2 + '</button>';
                        }
                    }
                }

                html += '</div>';
            }
            $("#prizeInfopop").html(html);
            $(".spinner_popup_error").hide();
            $("#popup_flex_box").removeClass("error_popup");
            $(".spinner_popup").removeClass("not_prize_popup");

        },
    });

    historyclicked = false;

    if (prizeinfo.PrizeType == PrizeTypes.Combination || prizeinfo.PrizeType == PrizeTypes.Group) {
        if (prizeinfo.PrizeType == PrizeTypes.Combination) {
            SetLatters(prizeinfo.CombinationPrizes.PrizeNames, prizeinfo.BigPrizeGroupId);
            if (openPopupHelper.widgetClone) {
                wdgclone = setTimeout(function () {
                    $('.wdg_' + prizeinfo.BigPrizeGroupId + ' .widget_box').first().clone().appendTo("#js_wdg");
                }, 1000); //after 1 seconds           

            }
        } else {
            SetLatters(prizeinfo.CombinationPrizes.PrizeNames, prizeinfo.BigPrizeGroupId);
            if (openPopupHelper.widgetClone) {
                wdgclone = setTimeout(function () {
                    $('.wdg_' + prizeinfo.BigPrizeGroupId + ' .widget_box').first().clone().appendTo("#js_wdg");
                }, 1000); //  after 1 seconds                   
            }

        }
    }
}

function setMysteryPopupText(prizeinfo, random) {

    $("#popupTxt").remove();
    $("#prizeInfo").html();
    var html = "";
    var prizeType = prizeinfo.PrizeType;
    let subPrizeType = prizeinfo.PrizeSubType;
    var BetCoinRuleTypeId = prizeinfo.BetCoinRuleTypeId;

    $.ajax({
        type: "POST",
        url: "/PromotionV1/GetPopups",
        data: { TypeId: openPopupHelper.type, defoult: Promotions.DefaultLen },
        success: function (result) {
            var description = result.Description;
            html += '<div class ="popup_header d-flex justify-content-between align-items-center">';
            if (result.Title != 'null') {
                html += result.Title;
            }
            html += '<span class="close_popup_button" id="js_close_popup_button"></span>';
            html += '</div>';
            html += '<div class ="popup_body">';
            html += '<div class ="popup_winItem text-center">';
            html += '<img class ="popup_winItem__img" src="' + openPopupHelper.name + '" alt="" />';

            for (var key in openPopupHelper.Keys) {
                description = description.replaceAll(key, openPopupHelper.Keys[key]);
            }

            html += '<div class ="popup_winItem__txt">';
            html += description;
            html += '</div>';

            if (openPopupHelper.widgetClone) {
                html += '<div id="js_wdg"></div>';
            }
            html += '</div>';

            html += '</div>';
         
            if (result.Button1 != null || result.Button2 != null) {

                html += '<div class ="popup_footer d-flex justify-content-end">';

                if (result.Button1 != null) {

                    if (prizeType == PrizeTypes.SportFreeBet ||
                        prizeType == PrizeTypes.FreeAmount ||
                        prizeType == PrizeTypes.FreeBet ||
                        prizeType == PrizeTypes.CasinoWager ||
                        prizeType == PrizeTypes.CasinoFreeBet ||
                        prizeType == PrizeTypes.SportWager ||
                        prizeType == PrizeTypes.SportRealWager ||
                        prizeType == PrizeTypes.GeneralRealMoney ||
                        prizeType == PrizeTypes.FreeSpins) {
                        html += '<button class="btn_popup btn_popup__primary" id="js_see_button">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.CasinoDynamicWager) {
                        html += '<button class="btn_popup btn_popup__primary" id="js_see_button_Wager">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.DynamicFreeSpin) {
                        html += '<button class="btn_popup btn_popup__primary" id="js_see_button_freespin">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.DynamicBetOnGames) {
                        html += '<button class="btn_popup btn_popup__primary" id="js_see_button_bog">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.DynamicSportFreeBet) {
                        html += '<button class="btn_popup btn_popup__primary" id="js_see_button_exchange_sport">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.DynamicSportWager) {
                        html += '<button class="btn_popup btn_popup__primary" id="js_see_button_exchange_sportWager">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.CurrentWheelKey) {
                        html += '<button class="btn_popup btn_popup__primary js_fw_spin_btn_popup">' + result.Button1 + '</button>';
                    } else if (BetCoinRuleTypeId == BetCoinRuleType.Wheel && (prizeType == PrizeTypes.BetCoins && openPopupHelper.BetCoinCount == 0)) {
                        html += '<button class="btn_popup btn_popup__primary js_sw_spin_btn_popup">' + result.Button1 + '</button>';
                    } else if (BetCoinRuleTypeId == BetCoinRuleType.Main && (prizeType == PrizeTypes.BetCoins && openPopupHelper.BetCoinCount == 0)) {
                        html += '<button class="btn_popup btn_popup__primary js_sw_spin_btn_popup2">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.FreeSpins || prizeType == PrizeTypes.FreeBet || prizeType == PrizeTypes.FreeAmount) {
                        html += '<button class="btn_popup btn_popup__primary js_notify_to_parent" data-type="cw_gameLaunch" data-game-url="' + result.GameUrl2 + '" data-lobby-url="' + result.UniqueUrlName + '">' + result.Button1 + '</button>';
                    } else if (prizeType == PrizeTypes.Group) {
                        if (subPrizeType == PrizeTypes.CasinoWager) {
                            html += '<button class="btn_popup btn_popup__primary js_notify_to_parent" data-type="cw_openBonusPage" id="js_see_button">' + result.Button1 + '</button>';
                        } else if (subPrizeType == PrizeTypes.DynamicSportFreeBet) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_exchange_sport">' + result.Button1 + '</button>';
                        } else if (subPrizeType == PrizeTypes.DynamicSportWager) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_exchange_sportWager">' + result.Button1 + '</button>';
                        } else if (subPrizeType == PrizeTypes.CasinoDynamicWager) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_Wager">' + result.Button1 + '</button>';
                        } else {
                            html += '<button class="btn_popup btn_popup__secondary js_close_popup_button_big" id="">' + result.Button1 + '</button>';
                        }
                    } else if (prizeType == PrizeTypes.BetCoins && prizeinfo.ClientBetCoins == 0 && prizeinfo.BetCoinRuleTypeId == BetCoinRuleType.Prize) {

                        prizeType = prizeinfo.PrizeSubType;
                        if (prizeType == PrizeTypes.SportFreeBet ||
                            prizeType == PrizeTypes.FreeAmount ||
                            prizeType == PrizeTypes.FreeBet ||
                            prizeType == PrizeTypes.CasinoWager ||
                            prizeType == PrizeTypes.FreeSpins) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button">' + result.Button1 + '</button>';
                        } else if (prizeType == PrizeTypes.CasinoDynamicWager) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_Wager">' + result.Button1 + '</button>';
                        } else if (prizeType == PrizeTypes.DynamicFreeSpin) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_freespin">' + result.Button1 + '</button>';
                        } else if (prizeType == PrizeTypes.DynamicBetOnGames) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_bog">' + result.Button1 + '</button>';
                        } else if (prizeType == PrizeTypes.DynamicSportFreeBet) {
                            html += '<button class="btn_popup btn_popup__primary" id="js_see_button_exchange_sport">' + result.Button1 + '</button>';
                        } else if (prizeType == PrizeTypes.CurrentWheelKey) {
                            html += '<button class="btn_popup btn_popup__primary js_fw_spin_btn_popup">' + result.Button1 + '</button>';
                        } else if (prizeType == PrizeTypes.FreeSpins || prizeType == PrizeTypes.FreeBet || prizeType == PrizeTypes.FreeAmount) {
                            html += '<button class="btn_popup btn_popup__primary js_notify_to_parent" data-type="cw_gameLaunch" data-game-url="' + result.GameUrl2 + '" data-lobby-url="' + result.UniqueUrlName + '">' + result.Button1 + '</button>';
                        } else if (prizeType == PrizeTypes.Group && subPrizeType == PrizeTypes.CasinoWager) {
                            html += '<button class="btn_popup btn_popup__primary js_notify_to_parent" data-type="cw_openBonusPage" id="js_see_button">' + result.Button1 + '</button>';
                        }
                    }
                    else {
                        html += '<button class="btn_popup btn_popup__primary">' + result.Button1 + '</button>';
                    }
                }

                if (result.Button2 != null) {
                    if (prizeType == PrizeTypes.CurrentWheelKey) {
                        html += '<button class="btn_popup btn_popup__secondary js_auto_spin_popup" id="">' + result.Button2 + '</button>';
                    } else {
                        if ((prizeType == PrizeTypes.Group)) {
                            html += '<input type="hidden" value="' + prizeinfo.WonPrizeId + '" class="PrizeWinnerId">';
                            html += '<input type="hidden" value="' + prizeinfo.BigPrizeGroupId + '" class="ExchangeId">';
                            html += '<button class="btn_popup btn_popup__primary js_prize_exchange_popup_confirm" id="">' + result.Button2 + '</button>';
                        } else {
                            html += '<button class="btn_popup btn_popup__secondary">' + result.Button2 + '</button>';
                        }
                    }
                }

                html += '</div>';
            }
            $("#prizeInfopop").html(html);
            $("#popup_flex_box").addClass("mysteryBox_popup");
            $(".spinner_popup_error").hide();
            $("#popup_flex_box").removeClass("error_popup");
            $(".spinner_popup").removeClass("not_prize_popup");

            if (!random) {
                setTimeout(function () {

                    let MysteryAudioSrc = Promotions.CDNURL + '/Audio/mystery_box_open_sound.mp3';
                    let MysterySound = new Howl({
                        src: [MysteryAudioSrc],

                    });

                    MysterySound.currentTime = 0;
                    MysterySound.play();

                    openPopup();
                    $('#mysteryBoxContent .mysteryBox_item').removeClass('active1');
                    $('#mysteryBoxContent .mysteryBox_item').removeClass('opened');
                }, 1000);
            }
        },
    });

    historyclicked = false;

    if (prizeinfo.PrizeType == PrizeTypes.Combination || prizeinfo.PrizeType == PrizeTypes.Group) {
        if (prizeinfo.PrizeType == PrizeTypes.Combination) {
            SetLatters(prizeinfo.CombinationPrizes.PrizeNames, prizeinfo.BigPrizeGroupId);
            if (openPopupHelper.widgetClone) {
                wdgclone = setTimeout(function () {
                    $('.wdg_' + prizeinfo.BigPrizeGroupId + ' .widget_box').first().clone().appendTo("#js_wdg");
                }, 1000); //after 1 seconds           

            }
        } else {
            SetLatters(prizeinfo.CombinationPrizes.PrizeNames, prizeinfo.BigPrizeGroupId);
            if (openPopupHelper.widgetClone) {
                wdgclone = setTimeout(function () {
                    $('.wdg_' + prizeinfo.BigPrizeGroupId + ' .widget_box').first().clone().appendTo("#js_wdg");
                }, 1000); //  after 1 seconds                   
            }

        }
    }
}

function setDynamicPopupText(result, exchangeType) {

    $("#popupTxt").remove();
    $("#prizeInfo").html();
    var html = "";

    var prizeType = PromotionPopupsTypes.DynamicBOGBonus;
    if (exchangeType == 'spin') {
        prizeType = PromotionPopupsTypes.DynamicFreeSpinBonus;
    }
    let imgUrl = "";

    $.ajax({
        type: "POST",
        url: "/PromotionV1/GetDynamicExchangePopups",
        data: { TypeId: prizeType, defoult: Promotions.DefaultLen },
        success: function (result) {
            if (exchangeType == 'bog') {
                imgUrl = $('#betongames_exchange_popup .js_img_spin').attr('src');
            } else {
                imgUrl = $('#spin_exchange_popup .js_img_spin').attr('src');
            }

            let description = result.Description;
            for (var key in openPopupHelper.Keys) {
                description = description.replaceAll(key, openPopupHelper.Keys[key]);
            }

            html =
                '<div class ="popup_header d-flex justify-content-between align-items-center">';
            html += result.Title;
            html += '<span class="close_popup_button" id="js_close_popup_button"></span></div>';
            html += '<div class="popup_body">';
            html += '<div class="popup_winItem text-center"><img class="popup_winItem__img" src="' + imgUrl + '" alt="freeSpin" />';
            html += '<div class="popup_winItem__txt"><div class="spinner_popup_text flex-column justify-content-center"><span class="popup_wins_2">' + description + '</span></div></div></div>';
            if (result.Button1 != null) {
                html += '<div class ="popup_footer d-flex justify-content-end"><button class="btn_popup btn_popup__primary" id="js_see_button_sport">' + result.Button1 + "</button></div>";
            } else {
                html += '<div class ="popup_footer d-flex justify-content-end"><button class="btn_popup btn_popup__primary" id="js_see_button_sport">' + Promotions.see + "</button></div>";
            }


            $("#prizeInfopop").html(html);
            openPopup();
        },
    });

    historyclicked = false;

    if (result.PrizeType == PrizeTypes.Combination) {
        SetLatters(result.CombinationPrizes.PrizeNames, result.BigPrizeGroupId);
    }

    if (result.PrizeType == PrizeTypes.Group) {
        SetLatters(result.CombinationPrizes.PrizeNames, result.BigPrizeGroupId);
    }
}

$('.confirm_betongames_exchange').click(function () {
    let ClientSelectedAmount = parseFloat(($('#js_betongames_exchange_number').text()).replaceAll(' ', '').replaceAll(',', ''));
    let MinBetAmount = parseFloat($('.betongames_exchange_select_games input[name="selectGamebetongames"]:checked').data('amount'));

    if (!exchangeBogClicked) {

        if (parseFloat($('.betongames_exchange_select_games input[name="selectGamebetongames"]:checked').data('freespintypeid')) == 1) {
            if (MinBetAmount > ClientSelectedAmount || ClientSelectedAmount == 0) {
                alert("invalid Selected amount");
                return;
            } else {
                if (ClientSelectedAmount % MinBetAmount != 0) {

                    ClientSelectedAmount = parseInt(ClientSelectedAmount / MinBetAmount) * MinBetAmount;

                    if (parseInt(ClientSelectedAmount / MinBetAmount) > parseInt(Promotions.MaxBogBonusSpinCount)) {

                        ClientSelectedAmount = MinBetAmount * parseInt(Promotions.MaxBogBonusSpinCount);

                    }
                } else {

                    ClientSelectedAmount = parseFloat(ClientSelectedAmount / MinBetAmount) * MinBetAmount;

                    if (parseInt(ClientSelectedAmount / MinBetAmount) > parseInt(Promotions.MaxBogBonusSpinCount)) {

                        ClientSelectedAmount = MinBetAmount * parseInt(Promotions.MaxBogBonusSpinCount);

                    }
                }
            }
        }
        openPopupHelper.Keys = [];
        exchangeBogClicked = true;

        $.ajax({
            type: "POST",
            url: "/PromotionV1/ExchangeClientDinamicBonus",
            data: { PromotionId: Promotions.promotionId, PromotionEntryId: Promotions.activeClientEntryId, Id: $('.betongames_exchange_select_games input[name="selectGamebetongames"]:checked').val(), Amount: ClientSelectedAmount, TypeId: 4 },
            success: function (result) {
                if (result.Success) {
                    openPopupHelper.Keys = result.Keys;
                    document.getElementById('js_betongames_exchange_number').innerText = result.RemainingAmount;
                    document.getElementById('js_bog_15').innerText = result.RemainingAmount;
                    document.getElementById('js_bog_format_15').innerText = setAmountFormat(((result.RemainingAmount).toString()).replaceAll(' ', '').replaceAll(',', ''));
                    document.getElementById('js_bonus_infoUpdate_betongames').innerText = result.RemainingAmount;


                    if (parseInt(result.RemainingAmount) > 0) {
                        $("#js_open_spin_exchange").removeClass('disable');
                    } else {
                        $("#js_open_spin_exchange").addClass('disable');
                    }

                    $('#betongames_exchange_popup').hide();
                    $("#popupTxt").remove();
                    $("#prizeInfo").html();

                    setDynamicPopupText(result, 'bog');

                    $(".spinner_popup_error").hide();

                    BlockOrdering();

                } else {
                    $('#betongames_exchange_popup').hide();
                    setPopupErrText(result.JSMessage);
                }

                exchangeBogClicked = false;
                pageCountSpinExHistory = 1;
                $('#tab6').removeClass('updated');
                $('#tab3').trigger('click');
            }
        })
    }
})

$(document).on('click', '#mysteryBoxContent .mysteryBox_item', function () {
    $('#mysteryBoxContent .mysteryBox_item').removeClass('active1');
    $('#mysteryBoxContent .mysteryBox_item').removeClass('opened');
    $(this).addClass('active1');
});

$('#js_my_history').mCustomScrollbar({
    callbacks: {
        onTotalScrollOffset: 200,
        onTotalScroll: function () {
            if (allowScroll && hasNext) {
                GetClientPrizesHistories();
            }
        }
    }
});

$('#history').mCustomScrollbar({
    callbacks: {
        onTotalScrollOffset: 200,
        onTotalScroll: function () {
            if (allowScroll && hasNextAll) {
                GetAllPrizesHistories();
            }
        }
    }
});

$('#js_exchange_spin_history').mCustomScrollbar({
    callbacks: {
        onTotalScrollOffset: 200,
        onTotalScroll: function () {
            if (allowScroll && hasNext) {
                GetClientSpinExchangeHistory();
            }
        }
    }
});

$('#js_exchange_history').mCustomScrollbar({
    callbacks: {
        onTotalScrollOffset: 200,
        onTotalScroll: function () {
            if (allowScroll && hasNext) {
                GetClientExchangeHistory();
            }
        }
    }
});

$('#js_dice_history').mCustomScrollbar({
    callbacks: {
        onTotalScrollOffset: 200,
        onTotalScroll: function () {
            if (allowScrollDiceHistory && hasNextExHistory) {
                GetClientDiceHistory();
            }
        }
    }
});

function workAsTab(elem, elemId, tabLinks, tabContent) {
    tabLinks.removeClass('active');
    $(elem).addClass('active');
    tabContent.hide();
    $('#' + elemId + 'Cont').fadeIn('slow');
}

$('.tablinks').click(function () {
    let elemId = $(this).attr('id');
    let tabLinks = $('.tablinks');
    let tabContent = $('.tabcontent');
    workAsTab(this, elemId, tabLinks, tabContent);
});
$('.js_voice_icon').click(function () {
    if ($(this).hasClass('muted')) {
        $(this).removeClass('muted');
        var video = $('.banner_box_video')[0];
        video.muted = false;

    } else {
        $(this).addClass('muted');
        var video = $('.banner_box_video')[0];
        video.muted = true;
    }
});
$('.js_ds_popup_voice_icon').click(function () {
    if ($(this).hasClass('muted')) {
        $(this).removeClass('muted');
        var video = $('.ds_popup_banner_box_video')[0];
        video.muted = false;

    } else {
        $(this).addClass('muted');
        var video = $('.ds_popup_banner_box_video')[0];
        video.muted = true;
    }
});
$('.js_ds_openQr').click(function () {

    var AppType = $(this).data('id');
    $.ajax({
        type: "POST",
        url: "/PromotionV1/GetAplicationQr",
        data: { AppType: AppType},
        success: function (result) {
            if (result.Success) {
                if (Promotions.isMobileView == true) {
                    $('#app_open_popup').hide();
                    $('body').removeClass('js_popup_active');
                    window.location.href = result.Url;
                } else {
                    $("#js_qr").attr('src', 'data:image/png;base64, ' + result.QR);
                    $('.ds_info').hide();
                    $('.ds_popup_title').addClass('dis_none');
                    $('.ds_qr').show();
                    $('.js_qrTitle').removeClass('dis_none');
                }
                
            } else {          
                setPopupErrText(result.JSMessage);
            }
        }
    })
})

$(document).on("click", '.tablinks1', function () {
    if (!$(this).hasClass("active")) {
        let elemId = $(this).attr('id');
        let tabLinks = $('.tablinks1');
        let tabContent = $('.tabcontent1');
        workAsTab(this, elemId, tabLinks, tabContent);
        if ($(this).prop('id') == 'tab4' && !$("#tab4").hasClass("updated")) {
            GetClientPrizesHistories();
        } else if ($(this).prop('id') == 'tab3' && !$("#tab3").hasClass("updated")) {
            GetAllPrizesHistories();
        } else if ($(this).prop('id') == 'tab5' && !$("#tab5").hasClass("updated")) {
            GetClientExchangeHistory();
        } else if ($(this).prop('id') == 'tab6' && !$("#tab6").hasClass("updated")) {
            GetClientSpinExchangeHistory();
        } else if ($(this).prop('id') == 'tab7' && !$("#tab7").hasClass("updated")) {
            GetClientDiceHistory();
        }
    }
});

function FirstMachineButtonDisable() {

    $("#js_sw_stop_auto_spin").addClass("disabled");
    $("#js_sw_auto_spin").addClass("disabled");
    $("#wheel__spinBtn").addClass("disabled");
    $("#js_sw_turboSpin").addClass("disabled").removeClass("checked");

    $("#js_auto_spin").css('display', 'flex');
    $("#js_stop_auto_spin").css('display', 'none');
    $(".js_exchange_btn").addClass("disabled");
    $(".js_plus_btn").addClass("disabled");
    $(".js_minus_btn").addClass("disabled");

    $("#js_sw_auto_spin").css('display', 'block');
    $("#js_sw_stop_auto_spin").css('display', 'none');

}

function SecondMachineButtonDisable() {

    $("#wheel__spinBtn2").addClass("disabled");
    $("#js_sw_stop_auto_spin2").addClass("disabled");
    $("#js_sw_auto_spin2").addClass("disabled");
    $("#js_sw_turboSpin2").addClass("disabled").removeClass("checked");
    $("#js_sw_auto_spin2").css('display', 'block');
    $("#js_sw_stop_auto_spin2").css('display', 'none');

}
function UpdateClientData() {
    $.ajax({
        type: "POST",
        url: "/PromotionV1/UpdateClientData",
        data: { Id: parseInt(Promotions.PromoId) },
        success: function (result) {
            if (result.Success) {
                for (var i = 0; i < result.ClosedPeriods.length; i++) {
                    if (result.ClosedPeriods[i].State == 1) {
                        var clientActiveEntry = result.ClosedPeriods[i];
                    }
                    if (result.ClosedPeriods[i].EntryId == Promotions.FirstActiveEntryId) {
                        var ClientStandartEntry = result.ClosedPeriods[i];
                    }
                    if (result.ClosedPeriods[i].EntryId == Promotions.SecondActiveEntryId) {
                        var ClientWheelEntry = result.ClosedPeriods[i];
                    }
                    if (result.ClosedPeriods[i].EntryId == Promotions.firstBuyBonus) {
                        var ClientFirstEntryBuyBonus = result.ClosedPeriods[i];
                    }
                    if (result.ClosedPeriods[i].EntryId == Promotions.secondBuyBonus) {
                        var ClientSecondEntryBuyBonus = result.ClosedPeriods[i];
                    }
                }
               
                if (!(Promotions.hasStandardActiveBuyBonus || Promotions.hasWheelActiveBuyBonuse)) {
                    if (Promotions.isMobAppAndIos) {
                        Promotions.AppPoints = ClientStandartEntry.AppPoints;
                        $("#js_freespin_count").text(ClientStandartEntry.AppPoints);
                        $(".js_appPointCounts").text(ClientStandartEntry.AppPoints + Promotions.ShakeCount);
                        UpdatePoints(ClientStandartEntry.TotalPoints + ClientStandartEntry.AppPoints, false);
                    } else {
                        UpdatePoints(ClientStandartEntry.TotalPoints, false);
                    }
                    
                    if (ClientWheelEntry != null) {
                        UpdatePoints(ClientWheelEntry.TotalPoints, true);
                    }
                } else {
                    if (Promotions.hasStandardActiveBuyBonus) {
                        UpdatePoints(ClientFirstEntryBuyBonus.TotalPoints, false);
                        if (ClientWheelEntry != null) {
                            UpdatePoints(ClientWheelEntry.TotalPoints, true);
                        }
                    } else {
                        if (Promotions.isMobAppAndIos) {
                            $("#js_freespin_count").text(ClientStandartEntry.AppPoints);
                            UpdatePoints(ClientStandartEntry.TotalPoints + ClientStandartEntry.AppPoints, false);
                        } else {
                            UpdatePoints(ClientStandartEntry.TotalPoints, false);
                        }
                        if (ClientSecondEntryBuyBonus != null) {
                            UpdatePoints(ClientSecondEntryBuyBonus.TotalPoints, true);
                        }
                    }
                }


                if (ClientWheelEntry != null) {
                    Promotions.ClientActiveWheelEntry = ClientWheelEntry.TotalPoints;
                }
                Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints;

                if (Promotions.activeClientEntryId != ClientStandartEntry.EntryId ||
                    ClientStandartEntry.TotalPoints != Promotions.ClientActiveEntry ||
                    clientActiveEntry.RemainBet != Promotions.activeEntryTotalBet) {

                    Promotions.activeClientEntryId = ClientStandartEntry.EntryId;
                    Promotions.activeEntryTotalBet = ClientStandartEntry.RemainBet;
                    Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints;
                    if (ClientWheelEntry != null) {
                        Promotions.activeEntrySwTotalPoint = ClientWheelEntry.TotalPoints;
                    }


                    var activeElement = $("li[data-entryId =" + ClientStandartEntry.EntryId + "]");
                    activeElement.addClass("active client_Entry");

                    var activeSection = $("li[data-sectionId = " + clientActiveEntry.EntryId + "]");
                    $(activeSection[0]).addClass("active");
                    $(activeSection[0]).find(".range").removeClass("hidden");
                    $(activeSection[0]).find(".range_pop_block").addClass("hidden");

                    $("#history_box").parents(".js_gold_medals").css("display", "none");
                    $(".js_client_history").removeClass("active updated");
                    $(".your_wins_section").removeClass("active updated");
                    pageCount = 1;

                    $(".range_section_button.client_Entry").find("span").text(clientActiveEntry.TotalPoints);
                    $(".js_availableSpins").text(ClientStandartEntry.TotalPoints);
                    $("#availableSpinsText").text(ClientStandartEntry.TotalPoints);

                    $("#js_setUnUsedPoint").text(clientActiveEntry.TotalPoints);
                    $("li[data-entryId = " + ClientStandartEntry.EntryId + "]").children("span").text(ClientStandartEntry.TotalPoints);
                    $(".your_wins_section").removeClass("updated")

                    if (!(Promotions.hasStandardActiveBuyBonus || Promotions.hasWheelActiveBuyBonuse)) {
                        if (Promotions.ClientActiveEntry <= 0) {
                            stopAutoSpinSw = true;

                            FirstMachineButtonDisable();

                        } else {
                            $("#wheel__spinBtn").removeClass("disabled");
                            $(".js_availableSpins").removeClass("dis_none");
                            $("#js_tab_first_spinCount").removeClass("dis_none");
                            $("#js_sw_stop_auto_spin").removeClass("disabled");
                            $("#js_sw_auto_spin").removeClass("disabled");
                            $("#js_sw_turboSpin").removeClass("disabled");
                            $("#js_sw_auto_spin").css('display', 'block');
                            $("#js_sw_stop_auto_spin").css('display', 'none');
                        }

                        if (Promotions.ClientActiveWheelEntry <= 0) {
                            SecondMachineButtonDisable();
                        } else {
                            $("#wheel__spinBtn2").removeClass("disabled");
                            $(".js_availableSpins2").removeClass("dis_none");
                            $("#js_tab_second_spinCount").removeClass("dis_none");
                            $("#js_sw_stop_auto_spin2").removeClass("disabled");
                            $("#js_sw_auto_spin2").removeClass("disabled");
                            $("#js_sw_turboSpin2").removeClass("disabled");

                        }

                        if (Promotions.ClientActiveEntry / Promotions.exchangeRate == 0) {
                            $(".js_exchange_btn  ").addClass("disabled");
                            $(".js_plus_btn").addClass("disabled");
                            $(".js_minus_btn").addClass("disabled");
                        } else {
                            $(".js_exchange_btn").removeClass("disabled");
                            $(".js_exchange_popup").removeClass('dis_none');
                        }
                    }

                    SetActiveElement();
                    if (Promotions.progressBar > 1) {
                        setRange();
                    }
                }
            } else {
                location.reload();
            }
        },
    });
}
//function setRange() {
///*    Promotions.activeEntryTotalBet = 500;*/
//   // $(".range_section").find(".range_value_arrow .range_value").text(Promotions.activeEntryTotalBet);
//    $(".range_section").find(".range_value_arrow > .range_value").text(Promotions.activeEntryTotalBet);
//    let element = $(".range_section");
//    let prBarWhidth = $(".range_section").find(".range_element")[0].clientWidth;
//    let dvs = $(".range_section").find(".range_value_from_to > span > span");
//    let dvsVal = "";
//    let countOfDvs = dvs.length - 1;
//    let dvsPos = prBarWhidth / countOfDvs;
//    let sdv = 1;
//    let bdsvjb = 0;
//    for (var i = 0; i < dvs.length; i++) {
//        if (dvsVal == "" && Number.parseInt(dvs[i].innerHTML) >= Number.parseInt(Promotions.activeEntryTotalBet) && i != 0) {
//            bdsvjb = dvs[i - 1].innerHTML;
//            dvsVal = dvs[i].innerHTML - dvs[i - 1].innerHTML;
//            sdv = i - 1;
//        }
//    }

//    let prBarPos = (dvsPos / dvsVal * (Promotions.activeEntryTotalBet - bdsvjb)) + (dvsPos * sdv);
//    let rangeAnimWidth = prBarPos * 100 / prBarWhidth;
//    if (rangeAnimWidth > 100) { rangeAnimWidth = 100; }
//    $(element).find('.range_info_line').css('width', rangeAnimWidth + '%');

// //   $(element).find('.range_value_triangle').css('inset-inline-start', (rangeAnimWidth + 29) + 'px');

//    //if (rangeAnimWidth < 4.5) {
//    //    $(element).find('.range_value_arrow').css('inset-inline-start', '29%');
//    //    $(element).find('.range_value_triangle').css('inset-inline-start', rangeAnimWidth + $('.range_info_line').outerWidth() + '%');
//    //} else if (rangeAnimWidth > 4) {
//    //    $(element).find('.range_value_arrow').css('inset-inline-start', '95%');
//    //    $(element).find('.range_value_triangle').css('inset-inline-start', rangeAnimWidth + $('.range_info_line').outerWidth() / 2 + '%');
//    //}


//}

function setRange() {
    //debugger
    //Promotions.activeEntryTotalBet = '5000';
    //Promotions.activeEntryTotalBetFormating = '5 000';
    $(".range_section").find(".range_value_arrow .js_RemainBet").text(Promotions.activeEntryTotalBetFormating);

    parent = $(".range_section .range_value_step");
    $(".range_section").find(".range_value_step span").text();
    $.each(parent.children('span'), function () {
        if (parseInt(($(this).text()).replaceAll(' ', '').replaceAll(',', '')) < Promotions.activeEntryTotalBet) {
            $(this).closest('.range_value_step').addClass('disabled');
        }
    });

    let element = $(".range_section");
    let prBarWhidth = $(".range_section").find(".range_element")[0].clientWidth;
    let dvs = $(".range_section").find(".range_value_from_to > span > span");
    let dvsVal = "";
    let countOfDvs = dvs.length - 1;
    let dvsPos = prBarWhidth / countOfDvs;
    let sdv = 1;
    let bdsvjb = 0;
    for (var i = 0; i < dvs.length; i++) {
        if (dvsVal == "" && Number.parseInt((dvs[i].innerHTML).replaceAll(' ', '').replaceAll(',', '')) >= Number.parseInt((Promotions.activeEntryTotalBet).replaceAll(' ', '').replaceAll(',', '')) && i != 0) {
            bdsvjb = (dvs[i - 1].innerHTML).replaceAll(' ', '').replaceAll(',', '');
            dvsVal = (dvs[i].innerHTML).replaceAll(' ', '').replaceAll(',', '') - (dvs[i - 1].innerHTML).replaceAll(' ', '').replaceAll(',', '');
            sdv = i - 1;
        }
    }

    let prBarPos = (dvsPos / dvsVal * ((Promotions.activeEntryTotalBet).replaceAll(' ', '').replaceAll(',', '') - bdsvjb)) + (dvsPos * sdv);
    let rangeAnimWidth = prBarPos * 100 / prBarWhidth;
    if (rangeAnimWidth > 100) { rangeAnimWidth = 100; }

    let amountWith = $(".range_value_arrow").find(".range_value_arrow_inner")[0].clientWidth;

    $(element).find('.range_info_line').css('width', rangeAnimWidth + '%');
    let progressWith = $(".range_value_line").find(".range_info_line")[0].clientWidth;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'progress_bar_completion',
        'inIteration': Promotions.IsFirstIteration,
        'status': progressWith + '%'
    });



    if (Promotions.isMobileView) {

        if (amountWith / 2 < progressWith + 16) {
            if (amountWith / 2 + progressWith > prBarWhidth) {
                let amountTo = - (amountWith - 16);
                amountTo = amountTo - (amountWith / 2 + progressWith - prBarWhidth - 58);
                $('.range_value_arrow_inner').css('inset-inline-start', amountTo + 'px');
            } else {
                let amountTo2 = -(amountWith / 2 - 16);
                $('.range_value_arrow_inner').css('inset-inline-start', amountTo2 + 'px');
            }
        }
        else {
            let amountTo3 = - progressWith;
            $('.range_value_arrow_inner').css('inset-inline-start', amountTo3 + 'px');
        }
    } else {
        if (amountWith / 2 < progressWith + 32) {
            if (amountWith / 2 + progressWith > prBarWhidth) {
                let amountTo = - (amountWith - 34);
                amountTo = amountTo - (amountWith / 2 + progressWith - prBarWhidth - 34);
                $('.range_value_arrow_inner').css('inset-inline-start', amountTo + 'px');
            } else {
                let amountTo2 = -(amountWith / 2 - 32);
                $('.range_value_arrow_inner').css('inset-inline-start', amountTo2 + 'px');
            }
        }
        else {
            let amountTo3 = - progressWith;
            $('.range_value_arrow_inner').css('inset-inline-start', amountTo3 + 'px');
        }
    }
}


function UpdatePoints(totalPoint, isWheel) {
    totalPoint = totalPoint > 0 ? totalPoint : 0;
    if (isWheel) {
        $("#js_tab_second_spinCount").text(totalPoint);
        $(".js_availableSpins2").text(totalPoint);
    } else {
        if (totalPoint / Promotions.exchangeRate < 1) {
            $(".exchange_count").css('display', 'none');
        } else {
            $(".js_exchange_popup").text(Math.trunc(totalPoint / Promotions.exchangeRate));
        }

        $("#js_tab_first_spinCount").text(totalPoint); 
        $(".js_appPointCounts").text(parseInt(Promotions.AppPoints) + parseInt(Promotions.ShakeCount));       
        $(".js_totoalPoints").text(totalPoint);
        $(".js_availableSpins").text(totalPoint);

    }
}
document.addEventListener('visibilitychange', function () {
    if (Promotions.isLoggedin && Promotions.isJoined) {
        if (document.hidden && !autoSpinSw && !autoSpinSw2) {
            tabChangeTime = Date.now();
        } else {
            if (Date.now() - tabChangeTime > 5000) {
                UpdateClientData();
            }
        }
    }
});
function SetActiveElement() {
    if (!$(".your_wins_section").hasClass('updated')) {
        $.ajax({
            type: "POST",
            data: { PromotionId: Promotions.promotionId },
            url: "/PromotionV1/GetClientCombinationPrize",
            success: function (result) {

                if (result.Success == true) {
                    $(".your_wins_section").addClass('updated');
                    let element = result.CombinationPrize;
                    if (element.length > 0) {
                        let medalCount = 1;
                        for (var i = 0; i <= element.length - 1; i++) {
                            $("#js_" + element[i].PrizeGroupId).text(element[i].ClientCombinationCount);

                            medalCount = parseInt($(".js_" + element[i].PrizeGroupId + " .medal_comb_count").text());
                            let rangeWidth = 0;
                            if (element[i].ClientCombinationCount == element[i].CombinationCount) {
                                rangeWidth = 100
                            } else {
                                rangeWidth = (element[i].ClientCombinationCount * 100) / medalCount;
                            }

                            if (typeof $("#js_letter_" + element[i].PrizeGroupId).val() != "undefined") {

                                let lattersString = $("#js_letter_" + element[i].PrizeGroupId).val();
                                let stringSplit = lattersString.split(" ");
                                var newTxt = "";
                                var letterByletter = "";
                                for (var j = 0; j < stringSplit.length; j++) {
                                    var txt = stringSplit[j];
                                    newTxt = "<div class='d-flex'>";
                                    newTxt += txt.replace(/\w/g, function (c) {
                                        return '<span class="medals_letter ' + c + ' js_latters">' + c + '</span>';
                                    })

                                    letterByletter += newTxt;
                                    letterByletter += "</div>";
                                    if (stringSplit.length > 1) {
                                        letterByletter += "<span class='medals_letter_space'></span>";
                                    }
                                }
                                $('#js_static_latter_' + element[i].PrizeGroupId).empty();
                                $('#js_static_latter_' + element[i].PrizeGroupId).append(letterByletter);

                                let combinationPrizeString = result.CombinationPrize.filter(function (item) {
                                    return item.PrizeGroupId == element[i].PrizeGroupId;
                                });

                                SetLatters(combinationPrizeString[0].PrizeNames, element[i].PrizeGroupId);
                            }

                            $(".js_" + element[i].PrizeGroupId).find('.medals_progress_bar').css('width', rangeWidth + '%');
                            $("#js_" + element[i].PrizeGroupId).text(element[i].ClientCombinationCount);
                        }
                    }


                }
            },
        });
    }
}
function SetLatters(result, prizeType) {
    let lattersCount = 0;
    let staticLatters = $('#js_static_latter_' + prizeType).find('.js_latters');
    let wdg = $('.wdg_' + prizeType).not('.swiper-slide-duplicate').first();
    let wdgdup = $('.swiper-slide-duplicate.wdg_' + prizeType).first();
    let wdgLetters = wdg.find('.js_latters');
    let wdgLettersdup = wdgdup.find('.js_latters');

    staticLatters.removeClass('active');
    wdgLetters.removeClass('active');
    wdgLettersdup.removeClass('active');

    for (var i = 0; i < result.length; i++) {
        lattersCount = 0;
        wdglattersCount = 0;
        for (var j = 0; j < staticLatters.length; j++) {
            if ($(staticLatters[j]).text().toLowerCase() == result[i].toLowerCase().trim() && lattersCount == 0 && !$(staticLatters[j]).hasClass("active")) {
                lattersCount++;
                $(staticLatters[j]).addClass('active');
            }
        }

        for (var k = 0; k < wdgLetters.length; k++) {
            if ($(wdgLetters[k]).data('latter') == result[i].trim() && wdglattersCount == 0 && !$(wdgLetters[k]).hasClass("active")) {
                wdglattersCount++;
                $(wdgLetters[k]).addClass('active');
                $(wdgLettersdup[k]).addClass('active');
            }
        }

    }
}

/*BuyBonus */

if ($(".wheel_amount:not(dis_none)").attr('id') != null) {
    var Wheel_current_set = ($(".wheel_amount:not(dis_none)").attr('id')).split("_")[1];
}

if ($(".standard_amount:not(dis_none)").attr('id') != null) {
    var Standard_current_set = $(".standard_amount:not(dis_none)").data('order');
}
function StandardminusClick() {

    if ($('#standard_buy_bonus_minus').hasClass('disabled')) {
        return;
    }

    Standard_current_set = parseInt(Standard_current_set) - 1;

    if (Standard_current_set > 0) {
        document.getElementById("standard_buy_bonus_minus").classList.remove("disabled");
    } else {
        document.getElementById("standard_buy_bonus_minus").classList.add("disabled");
    }

    if (Promotions.StandardBuyBonusConfigCount == (Standard_current_set + 1)) {
        document.getElementById("standard_buy_bonus_plus").classList.add("disabled");
    } else {
        document.getElementById("standard_buy_bonus_plus").classList.remove("disabled");
    }

    for (let i = 0; i < Promotions.StandardBuyBonusConfigCount; i++) {
        document.getElementById('buy_' + i).classList.add("dis_none");
    }

    let show_steP_id = "#buy_" + Standard_current_set;
    $(show_steP_id).removeClass('dis_none');
    $("#js_buyBonus_price").text($(show_steP_id).data("amount"));

    $("#s_entryid").val($(show_steP_id).data('entryid'));
    $("#s_pontcount").val($(show_steP_id).data('pointcount'));
    $("#s_Amount").val(($(show_steP_id).data('amount') + " ").replace(',', '').replace(' ', ''));
    $("#standard_bonusCount").text($(show_steP_id).data('pointcount'));

    $("#standard_buy_bonus_minus").removeClass("disable");


}
function StandardplusClick() {

    if ($('#standard_buy_bonus_plus').hasClass('disabled') || Promotions.StandardBuyBonusConfigCount == 1) {
        return;
    }

    Standard_current_set = parseInt(Standard_current_set) + 1;

    if (Standard_current_set > 0) {

        document.getElementById("standard_buy_bonus_minus").classList.remove("disabled");

        if (Promotions.StandardBuyBonusConfigCount == (Standard_current_set + 1)) {
            document.getElementById("standard_buy_bonus_plus").classList.add("disabled");
        } else {
            document.getElementById("standard_buy_bonus_plus").classList.remove("disabled");
        }

    } else {
        document.getElementById("standard_buy_bonus_minus").classList.add("disabled");
        return;
    }

    for (let i = 0; i < Promotions.StandardBuyBonusConfigCount; i++) {
        document.getElementById('buy_' + i).classList.add("dis_none");
    }

    let show_steP_id = "#buy_" + Standard_current_set;

    $(show_steP_id).removeClass('dis_none');
    $("#js_buyBonus_price").text($(show_steP_id).data("amount"));


    $("#s_entryid").val($(show_steP_id).data('entryid'));
    $("#s_pontcount").val($(show_steP_id).data('pointcount'));


    $("#s_Amount").val(($(show_steP_id).data('amount') + " ").replace(",", ".").replace("/", "."));

    

    $("#standard_bonusCount").text($(show_steP_id).data('pointcount'));

    $("#standard_buy_bonus_minus").removeClass("disable");

}
function WheelminusClick() {
    if ($('#wheel_buy_bonus_minus').hasClass('disabled')) {
        return;
    }
    
    Wheel_current_set = parseInt(Wheel_current_set) - 1;

    if (Wheel_current_set > 0) {
        document.getElementById("wheel_buy_bonus_minus").classList.remove("disabled");
    } else {
        document.getElementById("wheel_buy_bonus_minus").classList.add("disabled");
    }

    if (Promotions.WheelBuyBonusConfigCount == (Wheel_current_set + 1)) {
        document.getElementById("wheel_buy_bonus_plus").classList.add("disabled");
    } else {
        document.getElementById("wheel_buy_bonus_plus").classList.remove("disabled");
    }

    for (let i = 0; i < Promotions.WheelBuyBonusConfigCount; i++) {
        document.getElementById("w_" + i).classList.add("dis_none");
    }

    let show_steP_id = "#w_" + Wheel_current_set;
    $(show_steP_id).removeClass('dis_none');
    $("#js_buyBonus_price2").text($(show_steP_id).data("amount"));

    $("#w_entryid").val($(show_steP_id).data('entryid'));
    $("#w_pontcount").val($(show_steP_id).data('pointcount'));

   $("#w_Amount").val(($(show_steP_id).data('amount') + " ").replace(',', '').replace(' ', ''));
    $("#wheel_bonusCount").text($(show_steP_id).data('pointcount'));
}
function WheelplusClick() {

    if ($('#wheel_buy_bonus_plus').hasClass('disabled') || Promotions.WheelBuyBonusConfigCount == 1) {
        return;
    }
    
    Wheel_current_set = parseInt(Wheel_current_set) + 1;

    if (Wheel_current_set > 0) {

        document.getElementById("wheel_buy_bonus_minus").classList.remove("disabled");

        if (Promotions.WheelBuyBonusConfigCount == (Wheel_current_set + 1)) {
            document.getElementById("wheel_buy_bonus_plus").classList.add("disabled");
        } else {
            document.getElementById("wheel_buy_bonus_plus").classList.remove("disabled");
        }

    } else {
        document.getElementById("wheel_buy_bonus_minus").classList.add("disabled");
        return;
    }

    for (let i = 0; i < Promotions.WheelBuyBonusConfigCount; i++) {
        document.getElementById("w_" + i).classList.add("dis_none");
    }

    let show_steP_id = "#w_" + Wheel_current_set;
    $(show_steP_id).removeClass('dis_none');
    $("#js_buyBonus_price2").text($(show_steP_id).data("amount"));

    $("#w_entryid").val($(show_steP_id).data('entryid'));
    $("#w_pontcount").val($(show_steP_id).data('pointcount'));
    $("#w_Amount").val(($(show_steP_id).data('amount') + " ").replace(',', '').replace(' ', ''));
    $("#wheel_bonusCount").text($(show_steP_id).data('pointcount'));

    $("#wheel_buy_bonus_minus").removeClass("disabled");

}

function BuyBonus(bonustype) {
if ($("#wheelcontent").hasClass("js_bonus_activation")
    || $("#spinnerCont").hasClass("js_bonus_activation")
    || autoSpinSw
    || autoSpinSw2
    || animationProcess
    ) {
        return
    }

    $("#js_accept").attr('bonustype', bonustype);
    $('#buy_bonus_popup').css('display', 'flex');
    document.getElementById("js_animate").scrollIntoView(false);
    $('body').addClass('js_popup_active');
    $(".buy_bonus_popup_text").empty();
    let popuptext = '';
    Id = $("#s_entryid").val();
    spointcount = $("#s_pontcount").val();
    sAmount = ($("#s_Amount").val() + " ").replace(",", "").replace("/", "").replace(".", "").replace(" ", "");
    wpointcount = $("#w_pontcount").val();
    wAmount = ($("#w_Amount").val() + " ").replace(",", "").replace("/", "").replace(".", "").replace(" ", "");

    $("#js_deposit").addClass('hidden');;
    $("#js_accept").removeClass('hidden');
    $("#js_cancel").removeClass('hidden');

    if (bonustype == 2) {
        if (typeof swiper2 != "undefined") {
            swiper2.slideTo(1, 1, true);
        }        
        Id = $("#w_entryid").val();
        popuptext = ($("#js_BuyBonusSecond").val().replace("#{PointCount}", $("#wheel_bonusCount").text())).replace("#{RuleName}", ($("#js_secondTitle").val()).trim());

    } else {
        if (typeof  swiper2 != "undefined") {
            swiper2.slideTo(0, 1, true);
        }   
        popuptext = ($("#js_BuyBonusFirst").val().replace("#{PointCount}", $("#standard_bonusCount").text())).replace("#{RuleName}", ($("#js_firstTitle").val()).trim());
    }
    
    if (Math.round(parseInt(Promotions.PlayerBalance)) < parseInt(wAmount) && bonustype == 2) {
        $("#buy_bonus_popup .popup_title").html($("#js_InsufficientBuyBonusTitle").val());
        popuptext = $("#js_InsufficientBuyBonusDec").val().replace("#{Amount}#{CurrencyId}", $("#js_buyBonus_price2").text() + " " + Promotions.currency);
        $("#js_accept").addClass('hidden');
        $("#js_cancel").addClass('hidden');
        $("#js_deposit").removeClass('hidden');
    } else if (Math.round(parseInt(Promotions.PlayerBalance)) < parseInt(sAmount) && bonustype == 1) {
        $("#buy_bonus_popup .popup_title").html($("#js_InsufficientBuyBonusTitle").val());
        popuptext = $("#js_InsufficientBuyBonusDec").val().replace("#{Amount}#{CurrencyId}", ($("#js_buyBonus_price").text() + " " +Promotions.currency));
        $("#js_accept").addClass('hidden');
        $("#js_cancel").addClass('hidden');
        $("#js_deposit").removeClass('hidden');
    }

    $(".buy_bonus_popup_text").html(popuptext);
}

function GoToMachine(machintype) {
    document.getElementById("js_animate").scrollIntoView(false);
    if (typeof swiper2 != "undefined") {
        if (machintype == 1) {
            swiper2.slideTo(0, 1, true);
        } else {
            swiper2.slideTo(1, 1, true);
        }
    } 
   
}
$('#js_accept').click(function () {
    if (BuyBonusClicked) {
        return
    }
    let EntryId = 0;
    var standardBonus = false;

    spointcount = $("#s_pontcount").val();
    sAmount = $("#s_Amount").val();

    wpointcount = $("#w_pontcount").val();
    wAmount = $("#w_Amount").val();

    if ($(this).attr('bonustype') == 1) {
        standardBonus = true;
        Id = $("#s_entryid").val();
        EntryId = $("#s_EntryId").val();

    } else {
        wheelBonus = true;
        Id = $("#w_entryid").val();
        EntryId = $("#w_EntryId").val();
    }

    BuyBonusClicked = true;

    $.ajax({
        type: "POST",
        url: "/PromotionV2/BuyBonus",
        data: { PromotionId: Promotions.promotionId, PromotionEntryId: EntryId, PromotionEntrySettingId: Id },
        success: function (result) {

            if (result.Success) {

                $('#buy_bonus_popup').css('display', 'none');
                $('body').removeClass('js_popup_active');
                $("#ActiveBuyBonusId").val(result.BuyBonusId);
                $('.cards_spin_section').addClass('active_bonus_style');

                if (!standardBonus) {

                    $("#wheelcontent").removeClass('disabled');
                    $("#wheelcontent").addClass("js_bonus_activation");

                    $("#jSwheel_box__inner2").empty();
                    $("#js_second_animation").removeClass("bigBoxCount");
                    $("#js_second_animation").removeClass("midCount");
                    if (Promotions.SecondBuyBonusegmentCount2 > 13) {
                        $("#js_second_animation").addClass("bigBoxCount");
                    } else if (Promotions.SecondBuyBonusegmentCount2 > 7 && Promotions.SecondBuyBonusegmentCount2 <= 13) {
                        $("#js_second_animation").addClass("midCount");
                    }
                    $('#js_has_wActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner2");
                    $("#jSwheel_box__inner2").removeAttr("style");
                    Promotions.hasWheelActiveBuyBonuse = true;
                    $(".priceMachine_section").addClass("has_standart_buyBonus");
                    $(".js_has_buyBonus").css('display', 'none');
                    $(".js_BuyBonus_Exchange1").css('display', 'none');
                    $(".js_active_bonus_text2").css('display', 'flex');
                    $(".js_active_bonus_text").closest('.js_BuyBonus_Exchange').removeClass('exchange_box_border');
                    $(".js_has_buyBonus").addClass('border_none');

                    $("#wheel__spinBtn2").removeClass("disabled");
                    $(".js_availableSpins2").removeClass("dis_none");
                    $("#js_tab_second_spinCount").removeClass("dis_none");
                    $("#js_sw_auto_spin2").removeClass("disabled");
                    $("#js_sw_turboSpin2").removeClass("disabled");
                    $("#js_sw_auto_spin2").css('display', 'block');
                    $("#js_sw_stop_auto_spin2").css('display', 'none');

                    $("#js_tab_second_spinCount").text(result.TotalPoints);

                    $(".js_availableSpins2").empty().text(result.TotalPoints);

                    $("#js_active_bonus_count2, #js_unused_active_bonus_count2, #js_unused_active_bonus_countText2").text(result.TotalPoints);
                    $("#js_tab_second_spinCount, .js_availableSpins2").removeClass('dis_none');
                    $("#wheel__spinBtn").addClass('disabled');
                    $("#js_sw_auto_spin").addClass('disabled');
                    $("#js_sw_turboSpin").addClass('disabled');

                } else {

                    $("#spinnerCont").removeClass('disabled');
                    $("#spinnerCont").addClass("js_bonus_activation");

                    $("#jSwheel_box__inner").empty();
                    $("#js_first_animation").removeClass("bigBoxCount");
                    $("#js_first_animation").removeClass("midCount");
                    if (Promotions.FirstBuyBonusegmentCount > 13) {
                        $("#js_first_animation").addClass("bigBoxCount");
                    } else if (Promotions.FirstBuyBonusegmentCount > 7 && Promotions.FirstBuyBonusegmentCount <= 13) {
                        $("#js_first_animation").addClass("midCount");
                    }
                    $('#js_has_sActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner");
                    $("#jSwheel_box__inner").removeAttr("style");
                    Promotions.hasStandardActiveBuyBonus = true;
                    $(".priceMachine_section").addClass("has_standart_buyBonus");
                    $(".js_has_buyBonus").css('display', 'none');
                    $(".js_BuyBonus_Exchange2").css('display', 'none');
                    $(".js_active_bonus_text").css('display', 'flex');
                    $(".js_active_bonus_text2").closest('.js_BuyBonus_Exchange').removeClass('exchange_box_border');
                    $(".js_has_buyBonus").addClass('border_none');

                    $("#wheel__spinBtn").removeClass("disabled");
                    $(".js_availableSpins").removeClass("dis_none");
                    $("#js_tab_first_spinCount").removeClass("dis_none");
                    $("#js_sw_auto_spin").removeClass("disabled");
                    $("#js_sw_turboSpin").removeClass("disabled");
                    $("#js_sw_auto_spin").css('display', 'block');
                    $("#js_sw_stop_auto_spin").css('display', 'none');

                    $("#js_tab_first_spinCount").text(result.TotalPoints);
                    $(".js_availableSpins").empty().text(result.TotalPoints);

                    $("#js_active_bonus_count, #js_unused_active_bonus_count, #js_unused_active_bonus_countText").text(result.TotalPoints);

                    $("#js_tab_first_spinCount, .js_availableSpins").removeClass('dis_none'); 

                    $("#wheel__spinBtn2").addClass('disabled');
                    $("#js_sw_auto_spin2").addClass('disabled');
                    $("#js_sw_turboSpin2").addClass('disabled');

                }
                isAnimationstart = true;

            } else {
                $('#buy_bonus_popup').css('display', 'none');
                $('body').removeClass('js_popup_active');
                setPopupErrText(result.Message);
            }

            BuyBonusClicked = false;
        }
    })

})

var RemCasinoWagerOrder = 0;
var ClientRemainingSportBetOrder = 1;
var ClientRemainingBonusOrder = 2;
var ClientRemainingBogOrder = 3;
var ClientRemainingSportWagerOrder = 4;
var RemCasinoWagerOrderClass = '';
var ClientRemainingSportBetOrderClass = '';
var ClientRemainingSportWagerOrderClass = '';
var ClientRemainingBonusOrderClass = '';
var ClientRemainingBogOrderClass = '';
function BlockOrdering() {

    let freespinAmount = $("#js_freeSpin_11").text();
    $("#js_freeSpin_11").text(freespinAmount.replaceAll(' ', '').replaceAll(',', ''));
    if (freespinAmount == "") {
        freespinAmount = "0,0";
    }

    let BogAmount = $("#js_bog_15").text();
    $("#js_bog_15").text(BogAmount.replaceAll(' ', '').replaceAll(',', ''));
    if (BogAmount == "") {
        BogAmount = "0,0";
    }

    let wagerAmount = $("#js_wager_14").text();
    $("#js_wager_14").text(wagerAmount.replaceAll(' ', '').replaceAll(',', ''));
    if (wagerAmount == "") {
        wagerAmount = "0,0";
    }

    let sportAmount = $("#js_sport_13").text();
    $("#js_sport_13").text(sportAmount.replaceAll(' ', '').replaceAll(',', ''));
    if (sportAmount == "") {
        sportAmount = "0,0";
    }

    let sportWagerAmount = $("#js_sport_24").text();
    $("#js_sport_24").text(sportWagerAmount.replaceAll(' ', '').replaceAll(',', ''));
    if (sportAmount == "") {
        sportAmount = "0,0";
    }

    MaxOrderArray = [parseFloat(wagerAmount.replaceAll(' ', '').replaceAll(',', '')), parseFloat(freespinAmount.replaceAll(' ', '').replaceAll(',', '')), parseFloat(BogAmount.replaceAll(' ', '').replaceAll(',', '')), parseFloat(sportAmount.replaceAll(' ', '').replaceAll(',', '')), parseFloat(sportWagerAmount.replaceAll(' ', '').replaceAll(',', ''))];

    MaxOrderArray.sort(function (a, b) { return b - a });

    for (let i = 0; i < MaxOrderArray.length; i++) {

        if (MaxOrderArray[i] == parseFloat(($("#js_wager_14").text()).replaceAll(' ', '').replaceAll(',', ''))) {
            RemCasinoWagerOrder = i;
        }

        if (MaxOrderArray[i] == parseFloat(($("#js_freeSpin_11").text()).replaceAll(' ', '').replaceAll(',', ''))) {
            ClientRemainingBonusOrder = i;
        }

        if (MaxOrderArray[i] == parseFloat(($("#js_bog_15").text()).replaceAll(' ', '').replaceAll(',', ''))) {
            ClientRemainingBogOrder = i;
        }

        if (MaxOrderArray[i] == parseFloat(($("#js_sport_13").text()).replaceAll(' ', '').replaceAll(',', ''))) {
            ClientRemainingSportBetOrder = i;
        }
        

        if (MaxOrderArray[i] == parseFloat(($("#js_sport_24").text()).replaceAll(' ', '').replaceAll(',', ''))) {
            ClientRemainingSportWagerOrder = i;
        }

    }

    if (parseFloat(($("#js_wager_14").text()).replaceAll(' ', '').replaceAll(',', '')) > 0) {
        RemCasinoWagerOrder = RemCasinoWagerOrder + " medals_active";
    } else {
        RemCasinoWagerOrder = RemCasinoWagerOrder + " disabled";
    }
    if (parseFloat(($("#js_freeSpin_11").text()).replaceAll(' ', '').replaceAll(',', '')) > 0) {
        ClientRemainingBonusOrder = ClientRemainingBonusOrder + " medals_active";
    } else {
        ClientRemainingBonusOrder = ClientRemainingBonusOrder + " disabled";
    }

    if (parseFloat(($("#js_bog_15").text()).replaceAll(' ', '').replaceAll(',', '')) > 0) {
        ClientRemainingBogOrder = ClientRemainingBogOrder + " medals_active";
    } else {
        ClientRemainingBogOrder = ClientRemainingBogOrder + " disabled";
    }

    if (parseFloat(($("#js_sport_13").text()).replaceAll(' ', '').replaceAll(',', '')) > 0) {
        ClientRemainingSportBetOrder = ClientRemainingSportBetOrder + " medals_active";
    } else {
        ClientRemainingSportBetOrder = ClientRemainingSportBetOrder + " disabled";
    }

    if (parseFloat(($("#js_sport_24").text()).replaceAll(' ', '').replaceAll(',', '')) > 0) {
        ClientRemainingSportWagerOrder = ClientRemainingSportWagerOrder + " medals_active";
    } else {
        ClientRemainingSportWagerOrder = ClientRemainingSportWagerOrder + " disabled";
    }

    RemCasinoWagerOrderClass = "medals_block flex-order-" + RemCasinoWagerOrder;
    ClientRemainingSportBetOrderClass = "medals_block flex-order-" + ClientRemainingSportBetOrder;
    ClientRemainingSportWagerOrderClass = "medals_block flex-order-" + ClientRemainingSportWagerOrder;
    ClientRemainingBonusOrderClass = "medals_block flex-order-" + ClientRemainingBonusOrder;
    ClientRemainingBogOrderClass = "medals_block flex-order-" + ClientRemainingBogOrder;

    $("#js_open_exchange_11, #js_open_exchange_15, #js_open_exchange_14, #js_open_exchange_13, #js_open_exchange_24").removeAttr('class');

    $("#js_open_exchange_14").addClass(RemCasinoWagerOrderClass);
    $("#js_open_exchange_13").addClass(ClientRemainingSportBetOrderClass);
    $("#js_open_exchange_24").addClass(ClientRemainingSportWagerOrderClass);
    $("#js_open_exchange_11").addClass(ClientRemainingBonusOrderClass);
    $("#js_open_exchange_15").addClass(ClientRemainingBogOrderClass);


}

function setPopupErrText(message) {
    let type = message != null ? message[0].Key : "";
    switch (type) {
        case "225":
        case "226":
        case "1024":
        case "153": // blockedFor transaction
        case "399": // CheckDepositLastDaysFailed
        case "497": // BlockedForBetsAndDeposits 
        case "681": // ClentCantJoin 
            $("#popup_flex_box").addClass("error_popup");
            $(".spinner_popup").removeClass("not_prize_popup");
            $("#prizeInfopop").html("");
            $(".spinner_popup_error_text").html(message[0].Value);
            $(".spinner_popup_error .popup_title").html(Promotions.translation['Attention']);
            $(".spinner_popup_error").show();
            $("#js_sw_stop_auto_spin").click();
            $("#js_sw_stop_auto_spin2").click();
            break;
        case "498": // BlockedForBetsAndDeposits 
            $("#popup_flex_box").addClass("error_popup");
            $(".spinner_popup").removeClass("not_prize_popup");
            $("#prizeInfopop").html("");
            $(".spinner_popup_error_text").html(Promotions.translation['YouDoNotHaveAccessToThisPromotion']);
            $(".spinner_popup_error .popup_title").html(Promotions.translation['Attention']);
            $(".spinner_popup_error").show();
            $("#js_sw_stop_auto_spin").click();
            $("#js_sw_stop_auto_spin2").click();
            break;
        default:
            $("#popup_flex_box").addClass("error_popup");
            $(".spinner_popup").removeClass("not_prize_popup");
            $('.js_error').html($('#js_ConectionProbDec').val().replace('#{ErrorCode}', type));          
            $("#prizeInfopop").html("");
            $(".spinner_popup_error").show();
            $("#js_sw_stop_auto_spin").click();
            $("#js_sw_stop_auto_spin2").click();
            break;
    }
    openPopup();
    firstClick = false;
}

$(document).ready(function () {

    let BoxAudioSrc = Promotions.CDNURL + 'Audio/firstWheelSound.mp3';
    var BoxSound = new Howl({
        src: [BoxAudioSrc],

    });

    let WheelAudioSrc = Promotions.CDNURL + 'Audio/secondWheelSound.wav';
    var WheelSound = new Howl({
        src: [WheelAudioSrc],
    });

    let WheelTurboAudioSrc = Promotions.CDNURL + 'Audio/secondWheeTurbolSound.wav';
    var WheeTurboSound = new Howl({
        src: [WheelTurboAudioSrc],
    });

    if (!Promotions.hasStandardActiveBuyBonus) {
        $("#jSwheel_box__inner").empty();
        $("#js_first_animation").removeClass("bigBoxCount");
        $("#js_first_animation").removeClass("midCount");
        if (Promotions.segmentCount > 13) {
            $("#js_first_animation").addClass("bigBoxCount");
        } else if (Promotions.segmentCount > 7 && Promotions.segmentCount <= 13) {
            $("#js_first_animation").addClass("midCount");
        }
        $('#js_hasNot_sActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner");
        $("#jSwheel_box__inner").removeAttr("style");
    }
    if (!Promotions.hasWheelActiveBuyBonuse) {
        $("#jSwheel_box__inner2").empty();
        $("#js_second_animation").removeClass("bigBoxCount");
        $("#js_second_animation").removeClass("midCount");
        if (Promotions.segmentCount2 > 13) {
            $("#js_second_animation").addClass("bigBoxCount");
        } else if (Promotions.segmentCount2 > 7 && Promotions.segmentCount2 <= 13) {
            $("#js_second_animation").addClass("midCount");
        }
        $('#js_hasNot_wActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner2");
        $("#jSwheel_box__inner2").removeAttr("style");

    }

    if (Promotions.hasStandardActiveBuyBonus || Promotions.hasWheelActiveBuyBonuse) {
        $(".js_has_buyBonus").css('display', 'none');

        $(".js_has_buyBonus").addClass('border_none');

        if (Promotions.hasWheelActiveBuyBonuse) {
            $(".js_active_bonus_text2").css('display', 'flex');
            if (typeof swiper2 != "undefined") {
                swiper2.slideNext();
            } 
            $(".js_BuyBonus_Exchange1").css('display', 'none');
            $("#jSwheel_box__inner2").empty();
            $("#js_second_animation").removeClass("bigBoxCount");
            $("#js_second_animation").removeClass("midCount");
            if (Promotions.SecondBuyBonusegmentCount2 > 13) {
                $("#js_second_animation").addClass("bigBoxCount");
            } else if (Promotions.SecondBuyBonusegmentCount2 > 7 && Promotions.SecondBuyBonusegmentCount2 <= 13) {
                $("#js_second_animation").addClass("midCount");
            }
            $('#js_has_wActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner2");
            $("#jSwheel_box__inner2").removeAttr("style");

            $("#wheel__spinBtn").addClass("disabled");
            $("#js_sw_auto_spin").addClass("disabled");
            $("#js_sw_turboSpin").addClass("disabled").removeClass("checked");

        } else {
            $(".js_BuyBonus_Exchange2").css('display', 'none');
            $(".js_active_bonus_text").css('display', 'flex');
            $("#jSwheel_box__inner").empty();
            $("#js_first_animation").removeClass("bigBoxCount");
            $("#js_first_animation").removeClass("midCount");
            if (Promotions.FirstBuyBonusegmentCount > 13) {
                $("#js_first_animation").addClass("bigBoxCount");
            } else if (Promotions.FirstBuyBonusegmentCount > 7 && Promotions.FirstBuyBonusegmentCount <= 13) {
                $("#js_first_animation").addClass("midCount");
            }
            $('#js_has_sActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner");
            $("#jSwheel_box__inner").removeAttr("style");
            $("html, body").animate({ scrollTop: $("#js_firstMathis").offset().top }, 600);

            SecondMachineButtonDisable();
        }
    }
    function GetPrize() {

        if (prizeClicked) {
            return
        }

        var fEntryId = Promotions.FirstActiveEntryId;
        if (Promotions.hasStandardActiveBuyBonus) {
            fEntryId = Promotions.firstBuyBonus;
        }
        openPopupHelper.name = "";
        openPopupHelper.RemainingBonusAmount = "";
        openPopupHelper.RemainingBonusAmountFormat = "";
        openPopupHelper.type = 0;
        openPopupHelper.PrizeId = 0;
        openPopupHelper.Counts = 0;
        openPopupHelper.UpdateTreasury = false;
        openPopupHelper.Keys = [];
        openPopupHelper.DynamicFreeSpin = false;
        openPopupHelper.DynamicBetOnGames = false;
        openPopupHelper.DynamicSportWager = false;
        openPopupHelper.DynamicSportFreeBet = false;
        openPopupHelper.CasinoDynamicWager = false;
        openPopupHelper.Betcoin = false;
        openPopupHelper.CurrentWheelKey = false;
        openPopupHelper.NextWheelKey = false;
        openPopupHelper.widgetClone = false;
        prizeClicked = true;
        
        $.ajax({
            type: "POST",
            url: "/PromotionV1/CheckPrize",
            data: { PromotionId: Promotions.promotionId, PromoEntryId: fEntryId, WheelId: "2", IsAutoPlay: false, DeviceType: Promotions.deviceTypeGivePrize },
            success: function (result) { 
            
                if (result.Success == true) {
               
                    animationProcess = true;
                    for (var i = 0; i < result.ClosedPeriods.length; i++) {
                        if (result.ClosedPeriods[i].EntryTypeId == 1) {
                            var ClientStandartEntry = result.ClosedPeriods[i];
                        }
                        if (result.ClosedPeriods[i].EntryTypeId == 4) { //Wheel
                            var ClientWheelEntry = result.ClosedPeriods[i];
                        }
                    }
                    Promotions.AppPoints = ClientStandartEntry.AppPoints;

                    if (Promotions.hasStandardActiveBuyBonus) {
                        
                        var availableSpinsStandard = $("#js_used_bonus_count_standard").text();
                        var activeSpinsStandard = $("#js_active_bonus_count").text();
                        var UnusedSpinsStandard = $("#js_unused_active_bonus_count").text();
                        $("#js_used_bonus_count_standard").empty().append(parseInt(availableSpinsStandard) + 1);
                        $("#js_unused_active_bonus_count").empty().append(parseInt(UnusedSpinsStandard) - 1);
                        $(".js_availableSpins").empty().append(parseInt(activeSpinsStandard) - parseInt(availableSpinsStandard) - 1);
                        $("#js_unused_active_bonus_countText").empty().append(parseInt(UnusedSpinsStandard) - 1);

                        var spin = $("#js_tab_first_spinCount").text() - 1;
                        $(".js_availableSpins").empty().append(parseInt(UnusedSpinsStandard) - 1);
                        $("#js_tab_first_spinCount").empty().append(parseInt(UnusedSpinsStandard) - 1);
                    } else {
                        $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry - 1);
                        $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry - 1);
                        $(".js_totoalPoints").empty().append(Promotions.ClientActiveEntry - 1);


                        if (Promotions.exchangeRate > 1) {
                            let changingPoint = Promotions.exchangeRate;
                            if (changingPoint <= (Promotions.ClientActiveEntry - Promotions.exchangeRate)) {
                                $(".js_plus_btn").removeClass("disabled");
                            } else {
                                $(".js_plus_btn").addClass("disabled");
                            }

                            if (Promotions.exchangeRate > 1) {
                                if (ClientStandartEntry.TotalPoints < changingPoint) {
                                    $(".js_exchange_btn").addClass("disabled");
                                    $(".js_exchange_popup").addClass('dis_none');
                                } else {
                                    $(".js_exchange_btn").removeClass("disabled");
                                    $(".js_exchange_popup").removeClass('dis_none');
                                }

                                $(".js_exchange_popup").text(Math.trunc(ClientStandartEntry.TotalPoints / Promotions.exchangeRate));
                            }
                        }
                    }

                    prizes = result.PrizeType;

                    if (Promotions.isMobAppAndIos) {
                        Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints + ClientStandartEntry.AppPoints; //Standard   
                    } else {
                        Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints; //Standard   
                    }

                   
                    if (ClientWheelEntry != null) {
                        Promotions.ClientActiveWheelEntry = ClientWheelEntry.TotalPoints; //wheel          
                    }

                    openPopupHelper.Keys = result.Keys;
                    switch (prizes) {
                        case PrizeTypes.DynamicFreeSpin:
                            openPopupHelper.type = PromotionPopupsTypes.DynamicFreeSpin
                            openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                            openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                            openPopupHelper.DynamicFreeSpin = true;
                            break;
                        case PrizeTypes.FreeSpins:
                            openPopupHelper.type = PromotionPopupsTypes.FreeSpins
                            break;
                        case PrizeTypes.BetCoins:
                            if (ClientWheelEntry != null) {
                                if (ClientWheelEntry.TotalPoints > 0) {
                                    Promotions.ClientActiveWheelEntry = ClientWheelEntry.TotalPoints;
                                    $("#wheel__spinBtn2").removeClass('disabled');
                                    $(".js_availableSpins2").removeClass("dis_none");
                                    $("#js_tab_second_spinCount").removeClass("dis_none");
                                    $("#js_sw_auto_spin2").removeClass('disabled');
                                    $("#js_sw_turboSpin2").removeClass('disabled');
                                }
                            }
                            if (ClientStandartEntry != null) {
                                if (Promotions.isMobAppAndIos) {
                                    if (ClientStandartEntry.TotalPoints + ClientStandartEntry.AppPoints > 0) {
                                        Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints + ClientStandartEntry.AppPoints;
                                        $("#wheel__spinBtn").removeClass('disabled');
                                        $(".js_availableSpins").removeClass("dis_none");
                                        $("#js_tab_first_spinCount").removeClass("dis_none");
                                        $("#js_sw_auto_spin").removeClass('disabled');
                                        $("#js_sw_turboSpin").removeClass('disabled');
                                    }
                                } else {
                                    if (ClientStandartEntry.TotalPoints > 0) {
                                        Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints;
                                        $("#wheel__spinBtn").removeClass('disabled');
                                        $(".js_availableSpins").removeClass("dis_none");
                                        $("#js_tab_first_spinCount").removeClass("dis_none");
                                        $("#js_sw_auto_spin").removeClass('disabled');
                                        $("#js_sw_turboSpin").removeClass('disabled');
                                    }
                                }
                                
                            }

                            if (result.ClientBetCoins == 0) {

                                if (result.BetCoinRuleTypeId == BetCoinRuleType.Prize) {
                                    openPopupHelper.type = PromotionPopupsTypes.BetCoinPrizeFinal;
                                    if (result.PrizeSubType == PrizeTypes.DynamicSportFreeBet) {
                                        openPopupHelper.DynamicSportFreeBet = true;
                                        openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                        openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                    } else if (result.PrizeSubType == PrizeTypes.CasinoDynamicWager) {
                                        openPopupHelper.CasinoDynamicWager = true;
                                        openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                        openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                    } else if (result.PrizeSubType == PrizeTypes.DynamicBetOnGames) {
                                        openPopupHelper.DynamicBetOnGames = true;
                                        openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                        openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                    } else if (result.PrizeSubType == PrizeTypes.DynamicFreeSpin) {
                                        openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                        openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                        openPopupHelper.DynamicFreeSpin = true;
                                    }
                                } else {
                                    openPopupHelper.type = PromotionPopupsTypes.BetcoinFinal;
                                }
                                UpdateBetcoinGroup(result);

                            } else {
                                openPopupHelper.type = PromotionPopupsTypes.BetCoin;
                                if (result.BetCoinRuleTypeId == BetCoinRuleType.Prize) {
                                    openPopupHelper.type = PromotionPopupsTypes.BetCoinPrize;
                                }
                            }

                            openPopupHelper.Counts = result.ClientBetCoins;
                            openPopupHelper.UpdateTreasury = true;
                            openPopupHelper.Betcoin = true;
                            openPopupHelper.PrizeId = result.PrizeGroupId;
                            break;

                        case PrizeTypes.DynamicSportFreeBet:
                            openPopupHelper.DynamicSportFreeBet = true;
                            openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                            openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                            openPopupHelper.type = PromotionPopupsTypes.DynamicSportFreeBet
                            break;
                        case PrizeTypes.CurrentWheelKey:
                            if (!$("#spinnerCont").hasClass("js_bonus_activation")) {
                                openPopupHelper.CurrentWheelKey = true;
                            }

                            if (Promotions.isMobAppAndIos) {
                                Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints + ClientStandartEntry.AppPoints; //Standard   
                            } else {
                                Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints; //Standard   
                            }

                            openPopupHelper.type = PromotionPopupsTypes.CurrentWheelKey
                            break;
                        case PrizeTypes.NextWheelKey:
                            openPopupHelper.NextWheelKey = true;
                            openPopupHelper.type = PromotionPopupsTypes.NextWheelKey;
                            $("#wheel__spinBtn2").removeClass("disabled");
                            $(".js_availableSpins2").removeClass("dis_none");
                            $("#js_tab_second_spinCount").removeClass("dis_none");
                            $("#js_sw_stop_auto_spin2").removeClass("disabled");
                            $("#js_sw_auto_spin2").removeClass("disabled");
                            $("#js_sw_turboSpin2").removeClass("disabled");
                            break;
                        case PrizeTypes.Money:
                            openPopupHelper.type = PromotionPopupsTypes.Money
                            break;
                        case PrizeTypes.FreeAmount:
                            openPopupHelper.type = PromotionPopupsTypes.FreeAmount
                            break;
                        case PrizeTypes.FreeBet:
                            openPopupHelper.type = PromotionPopupsTypes.FreeBet
                            break;
                        case PrizeTypes.CasinoFreeBet:
                            openPopupHelper.type = PromotionPopupsTypes.CasinoFreeBet
                            break;
                        case PrizeTypes.SportWager:
                            openPopupHelper.type = PromotionPopupsTypes.SportWager
                            break;
                        case PrizeTypes.SportRealWager:
                            openPopupHelper.type = PromotionPopupsTypes.SportRealWager
                            break;
                        case PrizeTypes.GeneralRealMoney:
                            openPopupHelper.type = PromotionPopupsTypes.GeneralRealMoney
                            break;
                        case PrizeTypes.SportFreeBet:
                            openPopupHelper.type = PromotionPopupsTypes.SportFreeBet
                            break;
                        case PrizeTypes.CasinoWager:
                            openPopupHelper.type = PromotionPopupsTypes.CasinoWager
                            break;
                        case PrizeTypes.CasinoDynamicWager:
                            openPopupHelper.CasinoDynamicWager = true;
                            openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                            openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                            openPopupHelper.type = PromotionPopupsTypes.CasinoDynamicWager
                            break;
                        case PrizeTypes.DynamicBetOnGames:
                            openPopupHelper.type = PromotionPopupsTypes.DynamicBetOnGames
                            openPopupHelper.DynamicBetOnGames = true;
                            openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                            openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                            break;
                        case PrizeTypes.DynamicSportWager:
                            openPopupHelper.type = PromotionPopupsTypes.DynamicSportWagerBonus;
                            openPopupHelper.DynamicSportWager = true;
                            openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                            openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                            break;
                        case PrizeTypes.BalanceMultiplier:
                            openPopupHelper.type = PromotionPopupsTypes.BalanceMultiplier
                            break;
                        case PrizeTypes.Combination:

                            if (result.CombPrizeGroupName == null || result.CombPrizeGroupName == "") {
                                openPopupHelper.type = PromotionPopupsTypes.CombinationMedals
                            } else {
                                openPopupHelper.widgetClone = true;
                                openPopupHelper.type = PromotionPopupsTypes.CombinationLetters
                            }

                            openPopupHelper.PrizeId = result.PrizeGroupId;
                            openPopupHelper.Counts = (result.CombinationPrizes).PrizeCount;
                            openPopupHelper.UpdateTreasury = true;
                            break;
                        case PrizeTypes.Material:
                            openPopupHelper.type = PromotionPopupsTypes.Material
                            break;
                        case PrizeTypes.Group:
                            openPopupHelper.UpdateTreasury = true;
                            openPopupHelper.PrizeId = result.PrizeGroupId;
                            openPopupHelper.BigPrizeId = result.BigPrizeGroupId;
                            openPopupHelper.Counts = (result.CombinationPrizes).PrizeCount;

                            if (result.IsExchangablePrize) {
                                openPopupHelper.type = PromotionPopupsTypes.ExchangeablePrizeMedals;
                                if ((result.PrizeName).length == 1) {
                                    openPopupHelper.type = PromotionPopupsTypes.ExchangeablePrizeLetters;
                                }
                                break;
                            } else {
                                openPopupHelper.widgetClone = true;
                                if ((result.PrizeName).length == 1) {
                                    openPopupHelper.type = PromotionPopupsTypes.GroupLetters;
                                } else {
                                    openPopupHelper.type = PromotionPopupsTypes.GroupMedals;
                                }

                                if (result.PrizeSubType == PrizeTypes.DynamicSportFreeBet) {
                                    openPopupHelper.DynamicSportFreeBet = true;
                                    openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                    openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                } else if (result.PrizeSubType == PrizeTypes.CasinoDynamicWager) {
                                    openPopupHelper.CasinoDynamicWager = true;
                                    openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                    openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                } else if (result.PrizeSubType == PrizeTypes.DynamicBetOnGames) {
                                    openPopupHelper.DynamicBetOnGames = true;
                                    openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                    openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                } else if (result.PrizeSubType == PrizeTypes.DynamicFreeSpin) {
                                    openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                    openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                    openPopupHelper.DynamicFreeSpin = true;
                                }
                            }
                            break;
                        case PrizeTypes.NoWin:
                            openPopupHelper.type = PromotionPopupsTypes.NoWin
                            break;

                        default:
                            prizeClicked = false;
                            break;
                    }

                    if (autoSpinSw) {
                        if (prizes == PrizeTypes.Group) {
                            $("#js_sw_auto_spin").css('display', 'block');
                            $("#js_sw_stop_auto_spin").css('display', 'none');
                            stopAutoSpinSw = true;
                            autoSpinSw = false;
                        }
                    }

                    if ($("#js_client_history").hasClass('active')) {
                        $('#js_client_history').trigger('click');

                    }
                    $('#tab3').removeClass('updated');
                    $('#tab4').removeClass('updated');
                    pageCount = 1;
                    pageCountAll = 1;
                    historyclicked = false;

                    openPopupHelper.name = $("#" + result.PrizeGroupId + " img").attr("src");

                    if ((result.PrizeType == PrizeTypes.Group || (result.PrizeType == PrizeTypes.Combination && result.GroupPrizeName != "" && result.GroupPrizeName != null)) ||
                        (result.ClientBetCoins == 0 && PrizeTypes.BetCoins == result.PrizeType && result.BetCoinRuleTypeId == BetCoinRuleType.Prize)) {
                        if (result.ImageURL != null) {
                            openPopupHelper.name = Promotions.CDNURL + result.ImageURL;
                        }

                    }          
                    $("#prizeInfopop .popup_body").empty();
                    $("#prizeInfopop .popup_footer").remove();
                    SecondWheelAnimation(result.PrizeGroupId);
                    setWheelPopupText(result);


                } else {
                    setPopupErrText(result.Message);
                    autoSpinSw = false;
                    autoSpinSw2 = false;

                }
                historyclicked = false;
            },
        });
    }
    function GetPrizeSecond() {

        if (prizeClicked) {
            return
        }

        var wEntryId = Promotions.SecondActiveEntryId;

        if (Promotions.hasWheelActiveBuyBonuse) {
            wEntryId = Promotions.secondBuyBonus;
        }

        openPopupHelper.name = "";
        openPopupHelper.RemainingBonusAmount = "";
        openPopupHelper.RemainingBonusAmountFormat = "";
        openPopupHelper.type = 0;
        openPopupHelper.PrizeId = 0;
        openPopupHelper.Counts = 0;
        openPopupHelper.UpdateTreasury = false;
        openPopupHelper.Keys = [];
        openPopupHelper.DynamicFreeSpin = false;
        openPopupHelper.DynamicBetOnGames = false;
        openPopupHelper.DynamicSportWager = false;
        openPopupHelper.DynamicSportFreeBet = false;
        openPopupHelper.CasinoDynamicWager = false;
        openPopupHelper.Betcoin = false;
        openPopupHelper.CurrentWheelKey = false;
        openPopupHelper.widgetClone = false;
        openPopupHelper.BigPrizeId = 0;
        prizeClicked = true;
        $.ajax({
            type: "POST",
            url: "/PromotionV1/CheckPrize",
            data: { PromotionId: Promotions.promotionId, PromoEntryId: wEntryId, WheelId: "2", IsAutoPlay: false, DeviceType: Promotions.deviceTypeGivePrize },
            success: function (result) {
                if (result.Success == true) {
                    animationProcess = true;
                    for (var i = 0; i < result.ClosedPeriods.length; i++) {
                        if (result.ClosedPeriods[i].EntryTypeId == 1) {
                            var ClientStandartEntry = result.ClosedPeriods[i];
                        }
                        if (result.ClosedPeriods[i].EntryTypeId == 4) { //Wheel
                            var ClientWheelEntry = result.ClosedPeriods[i];
                        }
                    }
                    Promotions.AppPoints = ClientStandartEntry.AppPoints;

                    prizes = result.PrizeType;
                    Promotions.ClientActiveWheelEntry = ClientWheelEntry.TotalPoints; //Standard

                    if (Promotions.hasWheelActiveBuyBonuse) {
                        var spin2 = $("#js_tab_second_spinCount").text() - 1;
                        $(".js_availableSpins2").empty().append(spin2);
                        $("#js_tab_second_spinCount").empty().append(spin2);
                        var UnusedSpinsStandard = $("#js_unused_active_bonus_count2").text();
                        $("#js_unused_active_bonus_count2").empty().append(parseInt(UnusedSpinsStandard) - 1);
                        $("#js_unused_active_bonus_countText2").empty().append(parseInt(UnusedSpinsStandard) - 1);
                        if (spin2 == 0) {
                            $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);
                            $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                            $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                            Promotions.hasWheelActiveBuyBonuse = false;
                        }
                    } else {
                        $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);
                        $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                    }

                    openPopupHelper.Keys = result.Keys;
                    switch (prizes) {
                        case PrizeTypes.DynamicFreeSpin:
                            openPopupHelper.type = PromotionPopupsTypes.DynamicFreeSpin
                            openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                            openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                            openPopupHelper.DynamicFreeSpin = true;
                            break;
                        case PrizeTypes.FreeSpins:
                            openPopupHelper.type = PromotionPopupsTypes.FreeSpins
                            break;
                        case PrizeTypes.BetCoins:

                            if (ClientWheelEntry != null) {
                                if (ClientWheelEntry.TotalPoints > 0) {
                                    Promotions.ClientActiveWheelEntry = ClientWheelEntry.TotalPoints;
                                    $("#wheel__spinBtn2").removeClass('disabled');
                                    $(".js_availableSpins2").removeClass("dis_none");
                                    $("#js_tab_second_spinCount").removeClass("dis_none");
                                    $("#js_sw_auto_spin2").removeClass('disabled');
                                    $("#js_sw_turboSpin2").removeClass('disabled');
                                }
                            }
                            if (ClientStandartEntry != null) {
                                if (Promotions.isMobAppAndIos) {
                                    if (ClientStandartEntry.TotalPoints + ClientStandartEntry.AppPoints > 0) {
                                        Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints + ClientStandartEntry.AppPoints;
                                        $("#wheel__spinBtn").removeClass('disabled');
                                        $(".js_availableSpins").removeClass("dis_none");
                                        $("#js_tab_first_spinCount").removeClass("dis_none");
                                        $("#js_sw_auto_spin").removeClass('disabled');
                                        $("#js_sw_turboSpin").removeClass('disabled');
                                    }
                                } else {
                                    if (ClientStandartEntry.TotalPoints > 0) {
                                        Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints;
                                        $("#wheel__spinBtn").removeClass('disabled');
                                        $(".js_availableSpins").removeClass("dis_none");
                                        $("#js_tab_first_spinCount").removeClass("dis_none");
                                        $("#js_sw_auto_spin").removeClass('disabled');
                                        $("#js_sw_turboSpin").removeClass('disabled');
                                    }
                                }
                               
                            }
                            if (result.ClientBetCoins == 0) {

                                if (result.BetCoinRuleTypeId == BetCoinRuleType.Prize) {
                                    openPopupHelper.type = PromotionPopupsTypes.BetCoinPrizeFinal;
                                    if (result.PrizeSubType == PrizeTypes.DynamicSportFreeBet) {
                                        openPopupHelper.DynamicSportFreeBet = true;
                                        openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                        openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                    } else if (result.PrizeSubType == PrizeTypes.CasinoDynamicWager) {
                                        openPopupHelper.CasinoDynamicWager = true;
                                        openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                        openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                    } else if (result.PrizeSubType == PrizeTypes.DynamicBetOnGames) {
                                        openPopupHelper.DynamicBetOnGames = true;
                                        openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                        openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                    } else if (result.PrizeSubType == PrizeTypes.DynamicFreeSpin) {
                                        openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                        openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                        openPopupHelper.DynamicFreeSpin = true;
                                    }
                                } else {
                                    openPopupHelper.type = PromotionPopupsTypes.BetcoinFinal;
                                }

                                UpdateBetcoinGroup(result);

                            } else {
                                openPopupHelper.type = PromotionPopupsTypes.BetCoin;
                                if (result.BetCoinRuleTypeId == BetCoinRuleType.Prize) {
                                    openPopupHelper.type = PromotionPopupsTypes.BetCoinPrize;
                                }

                            }


                            openPopupHelper.Counts = result.ClientBetCoins;
                            openPopupHelper.UpdateTreasury = true;
                            openPopupHelper.Betcoin = true;
                            openPopupHelper.PrizeId = result.PrizeGroupId;
                            break;
                        case PrizeTypes.DynamicSportFreeBet:
                            openPopupHelper.DynamicSportFreeBet = true;
                            openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                            openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                            openPopupHelper.type = PromotionPopupsTypes.DynamicSportFreeBet
                            break;
                        case PrizeTypes.CurrentWheelKey:
                            if (!$("#wheelcontent").hasClass("js_bonus_activation")) {
                                openPopupHelper.CurrentWheelKey = true;
                            }
                            Promotions.ClientActiveWheelEntry = ClientWheelEntry.TotalPoints;
                            openPopupHelper.type = PromotionPopupsTypes.CurrentWheelKey
                            break;
                        case PrizeTypes.NextWheelKey:
                            openPopupHelper.type = PromotionPopupsTypes.NextWheelKey;
                            $("#wheel__spinBtn2").removeClass("disabled");
                            $(".js_availableSpins2").removeClass("dis_none");
                            $("#js_tab_second_spinCount").removeClass("dis_none");
                            $("#js_sw_stop_auto_spin2").removeClass("disabled");
                            $("#js_sw_auto_spin2").removeClass("disabled");
                            $("#js_sw_turboSpin2").removeClass("disabled");
                            break;
                        case PrizeTypes.Money:
                            openPopupHelper.type = PromotionPopupsTypes.Money
                            break;
                        case PrizeTypes.FreeAmount:
                            openPopupHelper.type = PromotionPopupsTypes.FreeAmount
                            break;
                        case PrizeTypes.FreeBet:
                            openPopupHelper.DynamicFreeSpin = true;
                            openPopupHelper.type = PromotionPopupsTypes.FreeBet
                            break;
                        case PrizeTypes.SportFreeBet:
                            openPopupHelper.type = PromotionPopupsTypes.SportFreeBet
                            break;
                        case PrizeTypes.CasinoWager:
                            openPopupHelper.type = PromotionPopupsTypes.CasinoWager
                            break;
                        case PrizeTypes.CasinoFreeBet:
                            openPopupHelper.type = PromotionPopupsTypes.CasinoFreeBet
                            break;
                        case PrizeTypes.SportWager:
                            openPopupHelper.type = PromotionPopupsTypes.SportWager
                            break;
                        case PrizeTypes.SportRealWager:
                            openPopupHelper.type = PromotionPopupsTypes.SportRealWager
                            break;
                        case PrizeTypes.GeneralRealMoney:
                            openPopupHelper.type = PromotionPopupsTypes.GeneralRealMoney
                            break;
                        case PrizeTypes.CasinoDynamicWager:
                            openPopupHelper.CasinoDynamicWager = true;
                            openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                            openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                            openPopupHelper.type = PromotionPopupsTypes.CasinoDynamicWager
                            break;
                        case PrizeTypes.DynamicBetOnGames:
                            openPopupHelper.type = PromotionPopupsTypes.DynamicBetOnGames
                            openPopupHelper.DynamicBetOnGames = true;
                            openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                            openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                            break;
                        case PrizeTypes.DynamicSportWager:
                            openPopupHelper.type = PromotionPopupsTypes.DynamicSportWagerBonus;
                            openPopupHelper.DynamicSportWager = true;
                            openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                            openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                            break;
                        case PrizeTypes.BalanceMultiplier:
                            openPopupHelper.type = PromotionPopupsTypes.BalanceMultiplier
                            break;
                        case PrizeTypes.Combination:

                            if (result.CombPrizeGroupName == null || result.CombPrizeGroupName == "") {
                                openPopupHelper.type = PromotionPopupsTypes.CombinationMedals
                            } else {
                                openPopupHelper.widgetClone = true;
                                openPopupHelper.type = PromotionPopupsTypes.CombinationLetters
                            }

                            openPopupHelper.PrizeId = result.PrizeGroupId;
                            openPopupHelper.Counts = (result.CombinationPrizes).PrizeCount;
                            openPopupHelper.UpdateTreasury = true;
                            break;
                        case PrizeTypes.Material:
                            openPopupHelper.type = PromotionPopupsTypes.Material
                            break;
                        case PrizeTypes.Group:
                            openPopupHelper.UpdateTreasury = true;
                            openPopupHelper.PrizeId = result.PrizeGroupId;
                            openPopupHelper.BigPrizeId = result.BigPrizeGroupId;
                            openPopupHelper.Counts = (result.CombinationPrizes).PrizeCount;

                            if (result.IsExchangablePrize) {
                                openPopupHelper.type = PromotionPopupsTypes.ExchangeablePrizeMedals;
                                if ((result.PrizeName).length == 1) {
                                    openPopupHelper.type = PromotionPopupsTypes.ExchangeablePrizeLetters;
                                }
                                break;
                            } else {
                                openPopupHelper.widgetClone = true;
                                if ((result.PrizeName).length == 1) {
                                    openPopupHelper.type = PromotionPopupsTypes.GroupLetters;
                                } else {
                                    openPopupHelper.type = PromotionPopupsTypes.GroupMedals;
                                }

                                if (result.PrizeSubType == PrizeTypes.DynamicSportFreeBet) {
                                    openPopupHelper.DynamicSportFreeBet = true;
                                    openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                    openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                } else if (result.PrizeSubType == PrizeTypes.CasinoDynamicWager) {
                                    openPopupHelper.CasinoDynamicWager = true;
                                    openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                    openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                } else if (result.PrizeSubType == PrizeTypes.DynamicBetOnGames) {
                                    openPopupHelper.DynamicBetOnGames = true;
                                    openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                    openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                } else if (result.PrizeSubType == PrizeTypes.DynamicFreeSpin) {
                                    openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                    openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                    openPopupHelper.DynamicFreeSpin = true;
                                }
                            }
                            break;
                        case PrizeTypes.NoWin:
                            openPopupHelper.type = PromotionPopupsTypes.NoWin
                            break;

                        default:
                            prizeClicked = false;
                            break;
                    }

                    if (autoSpinSw2) {
                        if (prizes == PrizeTypes.Group) {
                            $("#js_sw_auto_spin2").css('display', 'block');
                            $("#js_sw_stop_auto_spin2").css('display', 'none');
                            stopAutoSpinSw2 = true;
                            autoSpinSw2 = false;
                        }
                    }

                    if ($("#js_client_history").hasClass('active')) {
                        $('#js_client_history').trigger('click');

                    }
                    $('#tab3').removeClass('updated');
                    $('#tab4').removeClass('updated');
                    pageCount = 1;
                    pageCountAll = 1;
                    historyclicked = false;

                    openPopupHelper.name = $("#" + result.PrizeGroupId + " img").attr("src");

                    if ((result.PrizeType == PrizeTypes.Group || (result.PrizeType == PrizeTypes.Combination && result.GroupPrizeName != "" && result.GroupPrizeName != null)) ||
                        (result.ClientBetCoins == 0 && result.PrizeType == PrizeTypes.BetCoins && result.BetCoinRuleTypeId == BetCoinRuleType.Prize)) {

                        if (result.ImageURL != null) {
                            openPopupHelper.name = Promotions.CDNURL + result.ImageURL;
                        }

                    }

                    $("#prizeInfopop .popup_body").empty();
                    $("#prizeInfopop .popup_footer").remove();

                    SecondWheelAnimation2(result.PrizeGroupId);

                    setWheelPopupText(result);


                } else {
                    setPopupErrText(result.Message);
                    autoSpinSw = false;
                    autoSpinSw2 = false;
                }
                historyclicked = false;
            },
        });
    }
    function ClosePopup() {
        animationProcess = false;
        autoSpinSw2 = false;
        autoSpinSw = false;

        $("#popup_flex_box").fadeOut(700, function () { $(this).removeClass('fromWhells fromCards') });
        $("#prize_clicked").fadeOut();
        $("#popup_flex_box").removeClass("mysteryBox_popup");
        $('body').removeClass('js_popup_active');
        $('.spinner_block_inner').removeClass("spinnerResult3 spinnerResult5 spinnerResult9 spinnerResult12  spinnerResult18 spinnerResult19 spinnerResult20 spinnerResult21 spinnerResult23 spinnerResultErr");
        $('.spinner_block_inner').css({ transition: '' })
        $('.winner_text').html("");
        prizeClicked = false;

        if (Promotions.BlockedForPromotion == 'False') {
            if (parseInt($('.js_availableSpins2').text()) > 0) {
                $("#wheel__spinBtn2").removeClass("disabled");
                $(".js_availableSpins2").removeClass("dis_none");
                $("#js_tab_second_spinCount").removeClass("dis_none");
                $("#js_sw_stop_auto_spin2").removeClass("disabled");
                $("#js_sw_auto_spin2").removeClass("disabled");
                $("#js_sw_turboSpin2").removeClass("disabled");
            }


            if (parseInt($('.js_availableSpins').text()) > 0) {
                $("#wheel__spinBtn").removeClass("disabled");
                $(".js_availableSpins").removeClass("dis_none");
                $("#js_tab_first_spinCount").removeClass("dis_none");
                $("#js_sw_stop_auto_spin").removeClass("disabled");
                $("#js_sw_auto_spin").removeClass("disabled");
                $("#js_sw_turboSpin").removeClass("disabled");
            }
        }

        if (parseInt($("#js_unused_active_bonus_count").text()) != 0 || ($("#js_unused_active_bonus_count2").text() != '' && parseInt($("#js_unused_active_bonus_count2").text()) != 0)) {
            if (parseInt($("#js_tab_first_spinCount").text()) <= 0 && Promotions.ClientActiveEntry <= 0 && Promotions.hasStandardActiveBuyBonus) {
                $("#wheel__spinBtn").addClass("disabled");
                $(".js_availableSpins").addClass("dis_none");
                $("#js_tab_first_spinCount").addClass("dis_none");
                $("#js_sw_auto_spin").addClass("disabled");
                $("#js_sw_turboSpin").addClass("disabled").removeClass("checked");
                $("#js_sw_auto_spin").css('display', 'block');
                $("#js_sw_stop_auto_spin").css('display', 'none');
                $(".countdown_box").removeClass('hide');
            }

            if (parseInt($("#js_tab_first_spinCount").text()) <= 0 && Promotions.ClientActiveEntry <= 0 && !$("#spinnerCont").hasClass("js_bonus_activation")) {
                $("#wheel__spinBtn").addClass("disabled");
                $(".js_availableSpins").addClass("dis_none");
                $("#js_tab_first_spinCount").addClass("dis_none");
                $("#js_sw_auto_spin").addClass("disabled");
                $("#js_sw_turboSpin").addClass("disabled").removeClass("checked");
                $("#js_sw_auto_spin").css('display', 'block');
                $("#js_sw_stop_auto_spin").css('display', 'none');
                $(".countdown_box").removeClass('hide');
            }

            if ((parseInt($("#js_unused_active_bonus_count").text()) == 0)) {
                Promotions.hasStandardActiveBuyBonus = false;            
                $("#js_first_animation").removeClass("bigBoxCount");
                $("#js_first_animation").removeClass("midCount");
                if (Promotions.segmentCount > 13) {
                    $("#js_first_animation").addClass("bigBoxCount");
                } else if (Promotions.segmentCount > 7 && Promotions.segmentCount <= 13) {
                    $("#js_first_animation").addClass("midCount");
                }
                $("#jSwheel_box__inner").removeAttr("style");
                $("#spinnerCont").removeClass("js_bonus_activation");
            }

            if ((parseInt($("#js_unused_active_bonus_count2").text()) == 0)) {
                Promotions.hasWheelActiveBuyBonuse = false;
                $("#jSwheel_box__inner2").empty();
                $("#js_second_animation").removeClass("bigBoxCount");
                $("#js_second_animation").removeClass("midCount");
                if (Promotions.segmentCount2 > 13) {
                    $("#js_second_animation").addClass("bigBoxCount");
                } else if (Promotions.segmentCount2 > 7 && Promotions.segmentCount2 <= 13) {
                    $("#js_second_animation").addClass("midCount");
                }
                $('#js_hasNot_wActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner2");
                $("#jSwheel_box__inner2").removeAttr("style");
                $("#wheelcontent").removeClass("js_bonus_activation");
            }

        } else {

            Promotions.hasStandardActiveBuyBonus = false;
            Promotions.hasWheelActiveBuyBonuse = false;

            if ((parseInt($("#js_unused_active_bonus_count").text()) == 0)) {
                Promotions.hasStandardActiveBuyBonus = false;             
                $("#js_first_animation").removeClass("bigBoxCount");
                $("#js_first_animation").removeClass("midCount");
                if (Promotions.segmentCount > 13) {
                    $("#js_first_animation").addClass("bigBoxCount");
                } else if (Promotions.segmentCount > 7 && Promotions.segmentCount <= 13) {
                    $("#js_first_animation").addClass("midCount");
                }
                $("#jSwheel_box__inner").removeAttr("style");
                $("#spinnerCont").removeClass("js_bonus_activation");
            }

            if ((parseInt($("#js_unused_active_bonus_count2").text()) == 0)) {
                Promotions.hasWheelActiveBuyBonuse = false;
                $("#jSwheel_box__inner2").empty();
                $("#js_second_animation").removeClass("bigBoxCount");
                $("#js_second_animation").removeClass("midCount");
                if (Promotions.segmentCount2 > 13) {
                    $("#js_second_animation").addClass("bigBoxCount");
                } else if (Promotions.segmentCount2 > 7 && Promotions.segmentCount2 <= 13) {
                    $("#js_second_animation").addClass("midCount");
                }
                $('#js_hasNot_wActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner2");
                $("#jSwheel_box__inner2").removeAttr("style");
                $("#wheelcontent").removeClass("js_bonus_activation");
            }
  
            $(".js_has_buyBonus").css('display', 'flex');
            $(".js_BuyBonus_Exchange2").css('display', 'flex');
            $(".js_BuyBonus_Exchange1").css('display', 'flex');

            $(".js_active_bonus_text").css('display', 'none');
            $(".js_active_bonus_text2").css('display', 'none');

            if (Promotions.exchangeRate > 1) {
                $(".js_active_bonus_text2").closest('.js_BuyBonus_Exchange').addClass('exchange_box_border');
                $(".js_active_bonus_text").closest('.js_BuyBonus_Exchange').addClass('exchange_box_border');
            }

            $(".js_has_buyBonus").removeClass('border_none');
            if (Promotions.ClientActiveEntry <= 0) {
                $("#wheel__spinBtn").addClass("disabled");
                $(".js_availableSpins").addClass("dis_none");
                $("#js_tab_first_spinCount").addClass("dis_none");
                $("#js_sw_auto_spin").addClass("disabled");
                $("#js_sw_turboSpin").addClass("disabled").removeClass("checked");
                $("#js_sw_auto_spin").css('display', 'block');
                $("#js_sw_stop_auto_spin").css('display', 'none');
                $(".countdown_box").removeClass('hide');
                autoSpinSw = false;
                if (Promotions.ShowCountDown) {
                    startTournamentCountDown();
                }
            }

        }
    }

    function SecondWheelAnimation(prizeId) {

        if (Promotions.FirstAnimationTypeId) {

            if ($('#jSwheel_box__inner .flip_card_block.active').index() == 0) {
                LastprizePosition = 0;
            }
            prizePosition = $("#jSwheel_box__inner #" + prizeId).first().data('order') - 1;
            var segmentCount = Promotions.segmentCount;

            if ($("#spinnerCont").hasClass("js_bonus_activation")) {
                segmentCount = Promotions.FirstBuyBonusegmentCount;
            }
            let count = 0;

            if (prizePosition - LastprizePosition <= 0) {
                count = prizePosition - LastprizePosition + segmentCount * 2;
            } else {
                count = prizePosition - LastprizePosition + segmentCount;
            }

            let caseV = 0;
            let speed = fWAnimaSpeedCounter / (count - 4);
            let speedSlow = fWAnimaSpeedCounter / 10;
            $('#js_has_sActiveBuyBonuse.play_cards_block').addClass('stylefoitem');
            $('#js_hasNot_sActiveBuyBonuse.play_cards_block').addClass('stylefoitem');
            let startFunction = () => setTimeoutWithFrame(function () { SwAutoSpin(); }, 100, Function.prototype);
            var animInt = function () {
                BoxSound.currentTime = 0;
                BoxSound.play();
                if ($('#jSwheel_box__inner .flip_card_block.active').index() + 1 == $('#jSwheel_box__inner .flip_card_block').length) {
                    $('#jSwheel_box__inner .flip_card_block.active').removeClass('active');
                    $('#jSwheel_box__inner .flip_card_block').eq(0).addClass('active');
                } else {
                    $('#jSwheel_box__inner .flip_card_block.active').removeClass('active').next().addClass('active');
                }
                caseV++;
                if (caseV == count) {
                    $('#jSwheel_box__inner .flip_card_block.active').addClass('flip_card_anim').animate({
                        opacity: 1,
                    }, fWAnimaSpeedCounter / 1.2, function () {

                        $('#jSwheel_box__inner .flip_card_block.active').removeClass('flip_card_anim');

                        if (Promotions.ClientActiveEntry <= 0 && !$("#spinnerCont").hasClass("js_bonus_activation")) {

                            stopAutoSpinSw = true;

                            Promotions.hasActiveBonuse == "false";
                            Promotions.hasWheelActiveBuyBonuse == "false";

                            $("#wheel__spinBtn").addClass("disabled");
                            $(".js_availableSpins").addClass("dis_none");
                            $("#js_tab_first_spinCount").addClass("dis_none");
                            $("#js_sw_turboSpin").addClass("disabled").removeClass("checked");
                            $("#js_sw_auto_spin").addClass("disabled");
                            $("#js_sw_auto_spin").css('display', 'block');
                            $("#js_sw_stop_auto_spin").css('display', 'none');
                        }

                        if (Promotions.hasStandardActiveBuyBonus && parseInt($("#js_unused_active_bonus_count").text()) == 0) {
                            stopAutoSpinSw = true;

                            $("#js_sw_auto_spin").css('display', 'block');
                            $("#js_sw_stop_auto_spin").css('display', 'none');

                            Promotions.hasStandardActiveBuyBonus = false;

                            $("#spinnerCont").removeClass("js_bonus_activation");
                            $("#jSwheel_box__inner").empty();
                            $("#js_first_animation").removeClass("bigBoxCount");
                            $("#js_first_animation").removeClass("midCount");
                            if (Promotions.segmentCount > 13) {
                                $("#js_first_animation").addClass("bigBoxCount");
                            } else if (Promotions.segmentCount > 7 && Promotions.segmentCount <= 13) {
                                $("#js_first_animation").addClass("midCount");
                            }
                            $('#js_hasNot_sActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner");
                            $("#jSwheel_box__inner").removeAttr("style");
                            $(".js_has_buyBonus").css('display', 'flex');
                            $(".js_active_bonus_text").css('display', 'none');
                            $(".js_active_bonus_text2").css('display', 'none');
                            $(".js_has_buyBonus").removeClass('border_none');
                            $(".js_BuyBonus_Exchange2").css('display', 'flex');
                            $(".js_BuyBonus_Exchange1").css('display', 'flex');

                            if (Promotions.ClientActiveWheelEntry <= 0) {
                                SecondMachineButtonDisable();
                            } else {
                                $("#wheel__spinBtn2").removeClass("disabled");
                                $(".js_availableSpins2").removeClass("dis_none");
                                $("#js_tab_second_spinCount").removeClass("dis_none");
                                $("#js_sw_auto_spin2").removeClass("disabled");
                                $("#js_sw_turboSpin2").removeClass("disabled");
                            }
                            if (Promotions.ClientActiveEntry > 0) {
                                $("#wheel__spinBtn").removeClass("disabled");
                                $(".js_availableSpins").removeClass("dis_none");
                                $("#js_tab_first_spinCount").removeClass("dis_none");
                                $("#js_sw_auto_spin").removeClass("disabled");
                                $("#js_sw_turboSpin").removeClass("disabled");
                            } else {
                                $("#wheel__spinBtn").addClass("disabled");
                                $(".js_availableSpins").addClass("dis_none");
                                $("#js_tab_first_spinCount").addClass("dis_none");
                                $("#js_sw_auto_spin").addClass("disabled");
                                $("#js_sw_turboSpin").addClass("disabled").removeClass("checked");
                            }

                            $("#js_sw_auto_spin").css('display', 'block');
                            $("#js_sw_stop_auto_spin").css('display', 'none');
                        }

                        if (Promotions.ClientActiveEntry >= 2 * Promotions.exchangeRate) {
                            $(".js_exchange_btn").removeClass("disabled");
                            $(".js_exchange_popup").removeClass('dis_none');
                            let changingPoint = Promotions.exchangeRate;
                            if (changingPoint <= (Promotions.ClientActiveEntry - Promotions.exchangeRate)) {
                                $(".js_plus_btn").removeClass("disabled");
                            } else {
                                $(".js_plus_btn").addClass("disabled");
                            }

                            if (Promotions.exchangeRate > 1) {

                                if (Promotions.ClientActiveEntry < changingPoint) {
                                    $('.js_exchange_rate').text(Number(changingPoint) - Number(Promotions.exchangeRate));
                                    $('.js_exchange_result').text(Number($('.js_exchange_result')[0].textContent) - 1);
                                }
                                $(".js_exchange_popup").text(Math.trunc(Promotions.ClientActiveEntry / Promotions.exchangeRate));
                            }

                        } else if (Promotions.ClientActiveEntry >= Promotions.exchangeRate) {
                            $(".js_exchange_btn").removeClass("disabled");
                            $(".js_exchange_popup").removeClass('dis_none');
                            $(".js_plus_btn").addClass("disabled");
                            $(".js_minus_btn").addClass("disabled");
                            $('.js_exchange_result').text("1");
                            $(".js_exchange_popup").text(1);
                        } else {
                            $(".js_exchange_btn").addClass("disabled");
                            $(".js_plus_btn").addClass("disabled");
                            $(".js_minus_btn").addClass("disabled");
                            $(".js_exchange_popup").text(0);
                        }

                        if (!autoSpinSw || prizes == PrizeTypes.Group) {

                            if (parseInt($("#js_unused_active_bonus_count").text()) == 0 &&
                                $("#spinnerCont").hasClass("js_bonus_activation")) {
                                $("#js_sw_auto_spin").css('display', 'block');
                                $("#js_sw_stop_auto_spin").css('display', 'none');
                                Promotions.hasStandardActiveBuyBonus == "false";
                            }

                            if (prizes == PrizeTypes.Group) {
                                $(".canvas-container").css('display', 'block');
                            }
                            animationProcess = false;
                            openPopup();
                        } else {

                            if ($("#spinnerCont").hasClass("js_bonus_activation") && parseInt($("#js_unused_active_bonus_count").text()) == 0) {
                                stopAutoSpinSw = true;
                                Promotions.hasStandardActiveBuyBonus == "false";
                                if (Promotions.ClientActiveEntry <= 0) {
                                    FirstMachineButtonDisable();
                                }
                                $("#js_sw_auto_spin").css('display', 'block');
                                $("#js_sw_stop_auto_spin").css('display', 'none');
                            }

                            startFunction();
                        }

                        $('.play_cards_block').removeClass('stylefoitem');
                        LastprizePosition = prizePosition;
                    });

                    setTimeout(function () {
                        if (openPopupHelper.UpdateTreasury) {
                            UpdateTreasury();
                        }

                        if (openPopupHelper.CurrentWheelKey) {
                            $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry);
                            $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry);
                            $(".js_totoalPoints").empty().append(Promotions.ClientActiveEntry);
                            $("#wheel__spinBtn").removeClass("disabled");
                            $(".js_availableSpins").removeClass("dis_none");
                            $("#js_tab_first_spinCount").removeClass("dis_none");
                            $("#js_sw_stop_auto_spin").removeClass("disabled");
                            $("#js_sw_auto_spin").removeClass("disabled");
                            $("#js_sw_turboSpin").removeClass("disabled");
                        }

                        if (openPopupHelper.NextWheelKey) {
                            $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);
                            $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                            $(".js_totoalPoints").empty().append(Promotions.ClientActiveWheelEntry);
                            $("#wheel__spinBtn2").removeClass("disabled");
                            $(".js_availableSpins2").removeClass("dis_none");
                            $("#js_tab_second_spinCount").removeClass("dis_none");
                            $("#js_sw_stop_auto_spin2").removeClass("disabled");
                            $("#js_sw_auto_spin2").removeClass("disabled");
                            $("#js_sw_turboSpin2").removeClass("disabled");
                        }

                        if (Promotions.hasStandardActiveBuyBonus && parseInt($("#js_unused_active_bonus_count").text()) == 0) {
                            $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry);
                            $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry);
                        }

                        if ($("#spinnerCont").hasClass("js_bonus_activation") && parseInt($("#js_unused_active_bonus_count").text()) == 0) {
                            $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry);
                            $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry);
                            $(".js_totoalPoints").empty().append(Promotions.ClientActiveEntry);
                        }

                        if (openPopupHelper.DynamicFreeSpin || openPopupHelper.DynamicBetOnGames || openPopupHelper.CasinoDynamicWager || openPopupHelper.DynamicSportFreeBet || openPopupHelper.DynamicSportWager) {
                            UpdateDynamicBonuses();
                        }
                    }, 2);

                } else if (caseV < count - 4) {
                    setTimeoutWithFrame(function () { animInt(); }, speed, fn => cancel = fn)

                } else {
                    speedSlow = speedSlow + (fWAnimaSpeedCounter / 43);
                    setTimeoutWithFrame(function () { animInt(); }, speedSlow, fn => cancel = fn)
                }
            };

            animInt();
        }
        else {
            let SwstartFunction = () => setTimeoutWithFrame(function () { SwAutoSpin(); }, 100, Function.prototype);
            var SwanimInt = function () {
                let position = 0;
                if (Promotions.hasStandardActiveBuyBonus) {
                    position = $("#js_first_machine #" + prizeId).first().data('order') * Promotions.giftpositionBuyBonus + 90 + Promotions.giftpositionBuyBonus / 2;
                } else {
                    position = $("#js_first_machine #" + prizeId).first().data('order') * Promotions.giftposition + 90 + Promotions.giftposition / 2;
                }

                let spinDegree = position + 1080;

                $('#js_first_machine .spinner_block_inner').css({ transform: 'translate3d(0,0, 0) rotate(' + spinDegree + 'deg)' });
                $('#js_first_machine .spinner_block_inner').css({ transition: 'all 2.2s cubic-bezier(0.22, 0.14, 0.13, 0.94) 0s' });

                if (isSwTurboSpin) {

                    WheeTurboSound.currentTime = 0;
                    WheeTurboSound.play();

                    $('#js_first_machine .spinner_block_inner').animate({ textIndent: 0 }, 500, function () {
                        $('#js_first_machine .spinner_block_inner').css({ transition: '' })
                        $('#js_first_machine .spinner_block_inner').css({ transform: 'translate3d(0, 0, 0) rotate(' + spinDegree % 360 + 'deg)' });

                        if (autoSpinSw && prizes != PrizeTypes.Group) {

                            if (Promotions.hasStandardActiveBuyBonus && parseInt($("#js_unused_active_bonus_count").text()) == 0) {

                                stopAutoSpinSw = true;
                                autoSpinSw = false;

                                Promotions.hasStandardActiveBuyBonus == "false";
                                $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry);
                                $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry);
                                $(".js_totoalPoints").empty().append(Promotions.ClientActiveEntry);

                                if (Promotions.ClientActiveEntry <= 0) {
                                    FirstMachineButtonDisable();

                                }

                                $("#js_sw_auto_spin").css('display', 'block');
                                $("#js_sw_stop_auto_spin").css('display', 'none');
                            }
                            else if (!Promotions.hasStandardActiveBuyBonus && Promotions.ClientActiveEntry == 0) {
                                FirstMachineButtonDisable();

                                stopAutoSpinSw = true;
                                autoSpinSw = false;
                            }
                            SwstartFunction();

                        } else {

                            if (Promotions.hasStandardActiveBuyBonus && parseInt($("#js_unused_active_bonus_count").text()) == 0) {

                                stopAutoSpinSw = true;
                                autoSpinSw = false;

                                Promotions.hasStandardActiveBuyBonus == "false";
                                $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry);
                                $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry);
                                $(".js_totoalPoints").empty().append(Promotions.ClientActiveEntry);

                                if (Promotions.ClientActiveEntry <= 0) {
                                    FirstMachineButtonDisable();
                                }

                                $("#js_sw_auto_spin").css('display', 'block');
                                $("#js_sw_stop_auto_spin").css('display', 'none');
                            }
                            animationProcess = false;
                            openPopup();

                            if (!Promotions.hasStandardActiveBuyBonus) {
                                $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry);
                                $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry);
                                $(".js_totoalPoints").empty().append(Promotions.ClientActiveEntry);
                            }
                            if (Promotions.ClientActiveWheelEntry > 0) {
                                $("#wheel__spinBtn2").removeClass('disabled');
                                $(".js_availableSpins2").removeClass("dis_none");
                                $("#js_tab_second_spinCount").removeClass("dis_none");
                                $("#js_sw_auto_spin2").removeClass('disabled');
                                $("#js_sw_turboSpin2").removeClass('disabled');
                            }
                            $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                            $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);

                        }

                    });
                } else {

                    WheelSound.currentTime = 0;
                    WheelSound.play();

                    $('#js_first_machine .spinner_block_inner').animate({ textIndent: 0 }, 3500, function () {
                        $('#js_first_machine .spinner_block_inner').css({ transition: '' })
                        $('#js_first_machine .spinner_block_inner').css({ transform: 'translate3d(0, 0, 0) rotate(' + spinDegree % 360 + 'deg)' });

                        if (autoSpinSw && prizes != PrizeTypes.Group) {

                            if (Promotions.hasStandardActiveBuyBonus && parseInt($("#js_unused_active_bonus_count").text()) == 0) {

                                stopAutoSpinSw = true;
                                autoSpinSw = false;

                                Promotions.hasStandardActiveBuyBonus == "false";
                                $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry);
                                $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry);
                                $(".js_totoalPoints").empty().append(Promotions.ClientActiveEntry);

                                if (Promotions.ClientActiveEntry <= 0) {
                                    FirstMachineButtonDisable();

                                }

                                $("#js_sw_auto_spin").css('display', 'block');
                                $("#js_sw_stop_auto_spin").css('display', 'none');
                            } else if (!Promotions.hasStandardActiveBuyBonus && Promotions.ClientActiveEntry == 0) {

                                FirstMachineButtonDisable();

                                stopAutoSpinSw = true;
                                autoSpinSw = false;
                            }
                            SwstartFunction();

                        } else {

                            if ($("#spinnerCont").hasClass("js_bonus_activation") && parseInt($("#js_unused_active_bonus_count").text()) == 0) {
                                stopAutoSpinSw = true;

                                Promotions.hasStandardActiveBuyBonus == "false";
                                $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry);
                                $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry);
                                $(".js_totoalPoints").empty().append(Promotions.ClientActiveEntry);

                                if (Promotions.ClientActiveEntry <= 0) {
                                    FirstMachineButtonDisable();
                                }

                                $("#js_sw_auto_spin").css('display', 'block');
                                $("#js_sw_stop_auto_spin").css('display', 'none');
                            }
                            animationProcess = false;
                            openPopup();
                            if (!Promotions.hasStandardActiveBuyBonus) {
                                $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry);
                                $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry);
                                $(".js_totoalPoints").empty().append(Promotions.ClientActiveEntry);
                            }

                            if (Promotions.ClientActiveWheelEntry > 0) {
                                $("#wheel__spinBtn2").removeClass('disabled');
                                $(".js_availableSpins2").removeClass("dis_none");
                                $("#js_tab_second_spinCount").removeClass("dis_none");
                                $("#js_sw_auto_spin2").removeClass('disabled');
                                $("#js_sw_turboSpin2").removeClass('disabled');
                            }
                            $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                            $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);

                        }

                    });
                }
            }
            setTimeout(function () {
                if (openPopupHelper.UpdateTreasury) {
                    UpdateTreasury();
                }

                if (openPopupHelper.CurrentWheelKey) {
                    $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry);
                    $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry);
                    $(".js_totoalPoints").empty().append(Promotions.ClientActiveEntry);
                    $("#wheel__spinBtn").removeClass("disabled");
                    $(".js_availableSpins").removeClass("dis_none");
                    $("#js_tab_first_spinCount").removeClass("dis_none");
                    $("#js_sw_stop_auto_spin").removeClass("disabled");
                    $("#js_sw_auto_spin").removeClass("disabled");
                    $("#js_sw_turboSpin").removeClass("disabled");
                }

                if (openPopupHelper.NextWheelKey) {
                    $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);
                    $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                    $(".js_totoalPoints").empty().append(Promotions.ClientActiveWheelEntry);
                    $("#wheel__spinBtn2").removeClass("disabled");
                    $(".js_availableSpins2").removeClass("dis_none");
                    $("#js_tab_second_spinCount").removeClass("dis_none");
                    $("#js_sw_stop_auto_spin2").removeClass("disabled");
                    $("#js_sw_auto_spin2").removeClass("disabled");
                    $("#js_sw_turboSpin2").removeClass("disabled");
                }

                if (openPopupHelper.DynamicFreeSpin || openPopupHelper.DynamicBetOnGames || openPopupHelper.CasinoDynamicWager || openPopupHelper.DynamicSportFreeBet || openPopupHelper.DynamicSportWager) {
                    UpdateDynamicBonuses();
                }
            }, 2500);

            SwanimInt();
        }

    }

    function UpdateTreasury() {
        let medalCount = parseInt($(".js_" + openPopupHelper.PrizeId + " .medal_comb_count").text());
        let rangeWidth = 0;
        if (medalCount == openPopupHelper.Counts) {
            rangeWidth = 100
        } else {
            rangeWidth = (openPopupHelper.Counts * 100) / medalCount;
        }

        $(".js_" + openPopupHelper.PrizeId).find('.medals_progress_bar').css('width', rangeWidth + '%');
        $("#js_" + openPopupHelper.PrizeId).text(openPopupHelper.Counts);

    }

    function UpdateBetcoinGroup(result) {

        $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry);
        $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry);
        $(".js_totoalPoints").empty().append(Promotions.ClientActiveEntry);

        $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);
        $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);

        if (Promotions.exchangeRate > 1) {
            let changingPoint = Promotions.exchangeRate;
            if (changingPoint <= (Promotions.ClientActiveEntry - Promotions.exchangeRate)) {
                $(".js_plus_btn").removeClass("disabled");
            } else {
                $(".js_plus_btn").addClass("disabled");
            }

            if (Promotions.exchangeRate > 1) {
                if (Promotions.ClientActiveEntry < changingPoint) {
                    $(".js_exchange_btn").addClass("disabled");
                } else {
                    $(".js_exchange_btn").removeClass("disabled");
                    $(".js_exchange_popup").removeClass('dis_none');
                }

                $(".js_exchange_popup").text(Math.trunc(Promotions.ClientActiveEntry / Promotions.exchangeRate));
            }
        }

    }

    function UpdateDynamicBonuses() {
        if (openPopupHelper.DynamicFreeSpin) {

           // document.getElementById('js_spin_exchange_number').innerText = openPopupHelper.RemainingBonusAmount;
            document.getElementById('js_spin_exchange_number').innerText = openPopupHelper.RemainingBonusAmountFormat;
            document.getElementById('js_freeSpin_11').innerText = openPopupHelper.RemainingBonusAmount;
            document.getElementById('js_freeSpin_format_11').innerText = openPopupHelper.RemainingBonusAmountFormat;
           // document.getElementById('js_bonus_infoUpdate_spin').innerText = openPopupHelper.RemainingBonusAmount;
            document.getElementById('js_bonus_infoUpdate_spin').innerText = openPopupHelper.RemainingBonusAmountFormat;

            $("#js_open_spin_exchange").removeClass('disabled');
            BlockOrdering()
        }
        if (openPopupHelper.DynamicBetOnGames) {

            document.getElementById('js_betongames_exchange_number').innerText = openPopupHelper.RemainingBonusAmount;
            document.getElementById('js_bog_15').innerText = openPopupHelper.RemainingBonusAmount;
            document.getElementById('js_bog_format_15').innerText = openPopupHelper.RemainingBonusAmountFormat;
            document.getElementById('js_bonus_infoUpdate_betongames').innerText = openPopupHelper.RemainingBonusAmount;

            $("#js_open_betongames_exchange").removeClass('disabled');
            BlockOrdering();
        }

        if (openPopupHelper.CasinoDynamicWager) {

            document.getElementById('js_wager_number').innerText = openPopupHelper.RemainingBonusAmount;
            document.getElementById('js_wager_14').innerText = openPopupHelper.RemainingBonusAmount;
            document.getElementById('js_wager_format_14').innerText = openPopupHelper.RemainingBonusAmountFormat;
            document.getElementById('js_bonus_infoUpdate_wager').innerText = openPopupHelper.RemainingBonusAmount;

            $("#js_open_exchange_14").removeClass('disabled');
            BlockOrdering();
        }

        if (openPopupHelper.DynamicSportFreeBet) {

            document.getElementById('js_sportBet_exchange_number').innerText = openPopupHelper.RemainingBonusAmount;
            document.getElementById('js_sport_13').innerText = openPopupHelper.RemainingBonusAmount;
            document.getElementById('js_sport_format_13').innerText = openPopupHelper.RemainingBonusAmountFormat;
            document.getElementById('js_bonus_infoUpdate_sportBet').innerText = openPopupHelper.RemainingBonusAmount;

            $("#js_open_exchange_13").removeClass('disabled');
            BlockOrdering();
        }

        if (openPopupHelper.DynamicSportWager) {

            document.getElementById('js_sportWager_exchange_number').innerText = openPopupHelper.RemainingBonusAmount;
            document.getElementById('js_sport_24').innerText = openPopupHelper.RemainingBonusAmount;
            document.getElementById('js_sport_format_24').innerText = openPopupHelper.RemainingBonusAmountFormat;
            document.getElementById('js_bonus_infoUpdate_sport_wager').innerText = openPopupHelper.RemainingBonusAmount;

            $("#js_open_exchange_24").removeClass('disabled');
            BlockOrdering();
        }

    }
    function SecondWheelAnimation2(prizeId) {

        if (Promotions.SecondAnimationType) {

            if ($('#jSwheel_box__inner2 .flip_card_block.active').index() == 0) {
                LastprizePosition2 = 0;
            }
            prizePosition = $("#jSwheel_box__inner2 #" + prizeId).first().data('order') - 1;

            var segmentCount2 = Promotions.segmentCount2;

            if ($("#wheelcontent").hasClass("js_bonus_activation")) {
                segmentCount2 = Promotions.SecondBuyBonusegmentCount2;
            }
            let count = 0;

            if (prizePosition - LastprizePosition2 <= 0) {
                count = prizePosition - LastprizePosition2 + segmentCount2 * 2;
            } else {
                count = prizePosition - LastprizePosition2 + segmentCount2;
            }

            let caseV = 0;
            let speed = fWAnimaSpeedCounter2 / (count - 4);
            let speedSlow = fWAnimaSpeedCounter2 / 10;
            $('#js_has_wActiveBuyBonuse.play_cards_block').addClass('stylefoitem');
            $('#js_hasNot_wActiveBuyBonuse.play_cards_block').addClass('stylefoitem');
            let SwstartFunction2 = () => setTimeoutWithFrame(function () { SwAutoSpinSecond(); }, 100, Function.prototype);
            var animInt2 = function () {
                BoxSound.currentTime = 0;
                BoxSound.play();

                if ($('#jSwheel_box__inner2 .flip_card_block.active').index() + 1 == $('#jSwheel_box__inner2 .flip_card_block').length) {
                    $('#jSwheel_box__inner2 .flip_card_block.active').removeClass('active');
                    $('#jSwheel_box__inner2 .flip_card_block').eq(0).addClass('active');
                } else {
                    $('#jSwheel_box__inner2 .flip_card_block.active').removeClass('active').next().addClass('active');
                }
                caseV++;
                if (caseV == count) {
                    $('#jSwheel_box__inner2 .flip_card_block.active').addClass('flip_card_anim').animate({
                        opacity: 1,
                    }, fWAnimaSpeedCounter2 / 1.2, function () {

                        $('#jSwheel_box__inner2 .flip_card_block.active').removeClass('flip_card_anim');

                        if (Promotions.ClientActiveWheelEntry <= 0 && !$("#wheelcontent").hasClass("js_bonus_activation")) {

                            stopAutoSpinSw2 = true;

                            Promotions.hasWheelActiveBuyBonuse == "false";

                            SecondMachineButtonDisable();
                        }

                        if ($("#wheelcontent").hasClass("js_bonus_activation") && (parseInt($("#js_unused_active_bonus_count2").text()) == 0)) {

                            stopAutoSpinSw2 = true;

                            $("#js_sw_auto_spin2").css('display', 'block');
                            $("#js_sw_stop_auto_spin2").css('display', 'none');

                            Promotions.hasStandardActiveBuyBonus = false;

                            $("#wheelcontent").removeClass("js_bonus_activation");
                            $("#jSwheel_box__inner2").empty();
                            $("#js_second_animation").removeClass("bigBoxCount");
                            $("#js_second_animation").removeClass("midCount");
                            if (Promotions.segmentCount2 > 13) {
                                $("#js_second_animation").addClass("bigBoxCount");
                            } else if (Promotions.segmentCount2 > 7 && Promotions.segmentCount2 <= 13) {
                                $("#js_second_animation").addClass("midCount");
                            }
                            $('#js_hasNot_wActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner2");
                            $(".js_has_buyBonus").css('display', 'flex');
                            $(".js_active_bonus_text").css('display', 'none');
                            $(".js_active_bonus_text2").css('display', 'none');
                            $(".js_BuyBonus_Exchange2").css('display', 'flex');
                            $(".js_BuyBonus_Exchange1").css('display', 'flex');
                            $(".js_has_buyBonus").removeClass('border_none');

                            $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                            $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);

                            if (Promotions.ClientActiveWheelEntry <= 0) {
                                SecondMachineButtonDisable();
                            } else {
                                $("#wheel__spinBtn2").removeClass("disabled");
                                $(".js_availableSpins2").removeClass("dis_none");
                                $("#js_tab_second_spinCount").removeClass("dis_none");
                                $("#js_sw_auto_spin2").removeClass("disabled");
                                $("#js_sw_turboSpin2").removeClass("disabled");
                            }
                            if (Promotions.ClientActiveEntry > 0) {
                                $("#wheel__spinBtn").removeClass("disabled");
                                $(".js_availableSpins").removeClass("dis_none");
                                $("#js_tab_first_spinCount").removeClass("dis_none");
                                $("#js_sw_auto_spin").removeClass("disabled");
                                $("#js_sw_turboSpin").removeClass("disabled");
                            } else {
                                $("#wheel__spinBtn").addClass("disabled");
                                $(".js_availableSpins").addClass("dis_none");
                                $("#js_tab_first_spinCount").addClass("dis_none");
                                $("#js_sw_auto_spin").addClass("disabled");
                                $("#js_sw_turboSpin").addClass("disabled").removeClass("checked");
                            }

                            $("#js_sw_auto_spin2").css('display', 'block');
                            $("#js_sw_stop_auto_spin2").css('display', 'none');
                        }

                        if (!autoSpinSw2 || prizes == PrizeTypes.Group) {

                            if (parseInt($("#js_unused_active_bonus_count2").text()) == 0 &&
                                $("#wheelcontent").hasClass("js_bonus_activation2")) {

                                $("#js_sw_auto_spin2").css('display', 'block');
                                $("#js_sw_stop_auto_spin2").css('display', 'none');

                                Promotions.hasWheelActiveBuyBonuse == "false";

                                $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry);
                                $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry);

                            }

                            if (prizes == PrizeTypes.Group) {

                                $(".canvas-container").css('display', 'block');
                            }

                            openPopup();

                            Promotions.hasWheelActiveBuyBonuse == "false";

                        } else {


                            if ($("#wheelcontent").hasClass("js_bonus_activation") && parseInt($("#js_unused_active_bonus_count2").text()) == 0) {
                                stopAutoSpinSw2 = true;

                                Promotions.hasStandardActiveBuyBonus == "false";
                                $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry);
                                $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry);
                                $(".js_totoalPoints").empty().append(Promotions.ClientActiveEntry);

                                if (Promotions.ClientActiveEntry <= 0) {
                                    $("#js_stop_auto_spin").addClass("disabled");
                                    $("#spinnerCont").addClass("disabled");
                                    $("#js_fw_spin_btn").addClass("disabled");
                                    $("#js_auto_spin").addClass("disabled");
                                    $("#js_turboSpin").addClass("disabled").removeClass("checked");
                                }

                                $("#js_auto_spin").css('display', 'flex');
                                $("#js_stop_auto_spin").css('display', 'none');

                            }

                            SwstartFunction2();
                        }

                        $('.play_cards_block').removeClass('stylefoitem');
                        LastprizePosition2 = prizePosition;
                    });

                    setTimeout(function () {
                        if (openPopupHelper.UpdateTreasury) {
                            UpdateTreasury();
                        }

                        if (openPopupHelper.CurrentWheelKey) {
                            $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);
                            $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                            $(".js_totoalPoints").empty().append(Promotions.ClientActiveWheelEntry);
                            $("#wheel__spinBtn2").removeClass("disabled");
                            $(".js_availableSpins2").removeClass("dis_none");
                            $("#js_tab_second_spinCount").removeClass("dis_none");
                            $("#js_sw_stop_auto_spin2").removeClass("disabled");
                            $("#js_sw_auto_spin2").removeClass("disabled");
                            $("#js_sw_turboSpin2").removeClass("disabled");
                        }

                        if (openPopupHelper.NextWheelKey) {
                            $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);
                            $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                            $(".js_totoalPoints").empty().append(Promotions.ClientActiveWheelEntry);
                            $("#wheel__spinBtn2").removeClass("disabled");
                            $(".js_availableSpins2").removeClass("dis_none");
                            $("#js_tab_second_spinCount").removeClass("dis_none");
                            $("#js_sw_stop_auto_spin2").removeClass("disabled");
                            $("#js_sw_auto_spin2").removeClass("disabled");
                            $("#js_sw_turboSpin2").removeClass("disabled");
                        }


                        if (openPopupHelper.DynamicFreeSpin || openPopupHelper.DynamicBetOnGames || openPopupHelper.CasinoDynamicWager || openPopupHelper.DynamicSportFreeBet || openPopupHelper.DynamicSportWager) {
                            UpdateDynamicBonuses();
                        }
                    }, 2);

                } else if (caseV < count - 4) {
                    setTimeoutWithFrame(function () { animInt2(); }, speed, fn => cancel = fn)

                } else {
                    speedSlow = speedSlow + (fWAnimaSpeedCounter2 / 43);
                    setTimeoutWithFrame(function () { animInt2(); }, speedSlow, fn => cancel = fn)
                }
            };

            animInt2();

        }

        else {
            let SwstartFunction2 = () => setTimeoutWithFrame(function () { SwAutoSpinSecond(); }, 100, Function.prototype);
            var SwanimInt2 = function () {

                let position2 = 0;

                if ($("#wheelcontent").hasClass("js_bonus_activation")) {
                    position2 = $("#js_second_animation #" + prizeId).first().data('order') * Promotions.giftpositionBuyBonus2 + 90 + Promotions.giftpositionBuyBonus2 / 2;
                } else {
                    position2 = $("#js_second_animation #" + prizeId).first().data('order') * Promotions.giftposition2 + 90 + Promotions.giftposition2 / 2;
                }

                let spinDegree2 = position2 + 1080;

                $('#jSwheel_box__inner2').css({ transform: 'translate3d(0,0, 0) rotate(' + spinDegree2 + 'deg)' });
                $('#jSwheel_box__inner2').css({ transition: 'all 2.2s cubic-bezier(0.22, 0.14, 0.13, 0.94) 0s' });

                if (isSwTurboSpin2) {

                    WheeTurboSound.currentTime = 0;
                    WheeTurboSound.play();
                    $('#jSwheel_box__inner2').animate({ textIndent: 0 }, 500, function () {
                        $('#jSwheel_box__inner2').css({ transition: '' })
                        $('#jSwheel_box__inner2').css({ transform: 'translate3d(0, 0, 0) rotate(' + spinDegree2 % 360 + 'deg)' });

                        if (autoSpinSw2 && prizes != PrizeTypes.Group) {

                            if ($("#wheelcontent").hasClass("js_bonus_activation") && parseInt($("#js_unused_active_bonus_count2").text()) == 0) {
                                stopAutoSpinSw2 = true;
                                autoSpinSw2 = false;

                                Promotions.hasWheelActiveBuyBonuse == "false";
                                $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);
                                $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                                $(".js_totoalPoints2").empty().append(Promotions.ClientActiveWheelEntry);

                                if (Promotions.ClientActiveWheelEntry <= 0) {
                                    SecondMachineButtonDisable()
                                }

                                $("#js_sw_auto_spin2").css('display', 'block');
                                $("#js_sw_stop_auto_spin2").css('display', 'none');

                            } else if (!$("#wheelcontent").hasClass("js_bonus_activation") && Promotions.ClientActiveWheelEntry == 0) {

                                SecondMachineButtonDisable();

                                stopAutoSpinSw2 = true;
                                autoSpinSw2 = false;
                            }

                            SwstartFunction2();
                        } else {

                            if ($("#wheelcontent").hasClass("js_bonus_activation") && parseInt($("#js_unused_active_bonus_count2").text()) == 0) {
                                stopAutoSpinSw2 = true;
                                autoSpinSw2 = false;

                                Promotions.hasWheelActiveBuyBonuse == "false";
                                $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);
                                $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                                $(".js_totoalPoints2").empty().append(Promotions.ClientActiveWheelEntry);

                                if (Promotions.ClientActiveWheelEntry <= 0) {
                                    SecondMachineButtonDisable();
                                }

                                $("#js_sw_auto_spin2").css('display', 'block');
                                $("#js_sw_stop_auto_spin2").css('display', 'none');

                            }

                            openPopup();

                            if (Promotions.hasWheelActiveBuyBonuse) {
                                if (parseInt($("#js_tab_second_spinCount").text()) == 0 && Promotions.ClientActiveWheelEntry == 0) {
                                    $("#wheel__spinBtn2").addClass('disabled');
                                    $(".js_availableSpins2").addClass("dis_none");
                                    $("#js_tab_second_spinCount").addClass("dis_none");
                                    $("#js_sw_auto_spin2").addClass('disabled');
                                    $("#js_sw_turboSpin2").addClass('disabled');
                                }
                            } else {
                                if (Promotions.ClientActiveWheelEntry == 0) {
                                    $("#wheel__spinBtn2").addClass('disabled');
                                    $(".js_availableSpins2").addClass("dis_none");
                                    $("#js_tab_second_spinCount").addClass("dis_none");
                                    $("#js_sw_auto_spin2").addClass('disabled');
                                    $("#js_sw_turboSpin2").addClass('disabled');
                                }
                            }

                        }
                    });
                } else {

                    WheelSound.currentTime = 0;
                    WheelSound.play();
                    $('#jSwheel_box__inner2').animate({ textIndent: 0 }, 3500, function () {
                        $('#jSwheel_box__inner2').css({ transition: '' })
                        $('#jSwheel_box__inner2').css({ transform: 'translate3d(0, 0, 0) rotate(' + spinDegree2 % 360 + 'deg)' });

                        if (autoSpinSw2 && prizes != PrizeTypes.Group) {
                            if ($("#wheelcontent").hasClass("js_bonus_activation") && parseInt($("#js_unused_active_bonus_count2").text()) == 0) {
                                stopAutoSpinSw2 = true;
                                autoSpinSw2 = false;

                                Promotions.hasWheelActiveBuyBonuse == "false";
                                $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);
                                $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                                $(".js_totoalPoints2").empty().append(Promotions.ClientActiveWheelEntry);

                                if (Promotions.ClientActiveWheelEntry <= 0) {
                                    SecondMachineButtonDisable();
                                }

                                $("#js_sw_auto_spin2").css('display', 'block');
                                $("#js_sw_stop_auto_spin2").css('display', 'none');

                            }
                            else if (!$("#wheelcontent").hasClass("js_bonus_activation") && Promotions.ClientActiveWheelEntry == 0) {
                                SecondMachineButtonDisable();

                                stopAutoSpinSw2 = true;
                                autoSpinSw2 = false;
                            }
                            SwstartFunction2();
                        } else {
                            if ($("#wheelcontent").hasClass("js_bonus_activation") && parseInt($("#js_unused_active_bonus_count2").text()) == 0) {
                                stopAutoSpinSw2 = true;
                                autoSpinSw2 = false;

                                Promotions.hasWheelActiveBuyBonuse == "false";
                                $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);
                                $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                                $(".js_totoalPoints2").empty().append(Promotions.ClientActiveWheelEntry);

                                if (Promotions.ClientActiveWheelEntry <= 0) {
                                    SecondMachineButtonDisable();
                                }

                                $("#js_sw_auto_spin2").css('display', 'block');
                                $("#js_sw_stop_auto_spin2").css('display', 'none');

                            }

                            openPopup();
                            if (Promotions.hasWheelActiveBuyBonuse) {
                                if (parseInt($("#js_tab_second_spinCount").text()) == 0 && Promotions.ClientActiveWheelEntry == 0) {
                                    $("#wheel__spinBtn2").addClass('disabled');
                                    $(".js_availableSpins2").addClass("dis_none");
                                    $("#js_tab_second_spinCount").addClass("dis_none");
                                    $("#js_sw_auto_spin2").addClass('disabled');
                                    $("#js_sw_turboSpin2").addClass('disabled');
                                }
                            } else {
                                if (Promotions.ClientActiveWheelEntry == 0) {
                                    $("#wheel__spinBtn2").addClass('disabled');
                                    $(".js_availableSpins2").addClass("dis_none");
                                    $("#js_tab_second_spinCount").addClass("dis_none");
                                    $("#js_sw_auto_spin2").addClass('disabled');
                                    $("#js_sw_turboSpin2").addClass('disabled');
                                }
                            }

                        }
                    });
                }
            }
            setTimeout(function () {
                if (openPopupHelper.UpdateTreasury) {
                    UpdateTreasury();
                }

                if (openPopupHelper.CurrentWheelKey || openPopupHelper.NextWheelKey) {
                    $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);
                    $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                    $(".js_totoalPoints").empty().append(Promotions.ClientActiveWheelEntry);
                    $("#wheel__spinBtn2").removeClass("disabled");
                    $(".js_availableSpins2").removeClass("dis_none");
                    $("#js_tab_second_spinCount").removeClass("dis_none");
                    $("#js_sw_stop_auto_spin2").removeClass("disabled");
                    $("#js_sw_auto_spin2").removeClass("disabled");
                    $("#js_sw_turboSpin2").removeClass("disabled");
                }


                if (openPopupHelper.DynamicFreeSpin || openPopupHelper.DynamicBetOnGames || openPopupHelper.CasinoDynamicWager || openPopupHelper.DynamicSportFreeBet || openPopupHelper.DynamicSportWager) {
                    UpdateDynamicBonuses();
                }
            }, 2500);

            SwanimInt2();
        }
    }
    function setTimeoutWithFrame(fn, delay, registerCancel) {
        const start = new Date().getTime();
        const loop = () => {
            const delta = new Date().getTime() - start;
            if (delta >= delay) {
                fn();
                registerCancel(Function.prototype);
                return;
            }
            const raf = requestAnimationFrame(loop);
            registerCancel(() => cancelAnimationFrame(raf));
        };
        const raf = requestAnimationFrame(loop);
        registerCancel(() => cancelAnimationFrame(raf));
    }

    function startTournamentCountDown() {
        var end = new Date(Promotions.promotionStartDate).getTime();
        var _second = 1000;
        var _minute = _second * 60;
        var _hour = _minute * 60;
        var _day = _hour * 24;
        var timer;
        function showRemaining() {
            var now = new Date().getTime();
            var distance = end - now;
            if (distance <= 0) {
                clearInterval(timer);
                setTimeout(function () {
                    window.location.reload();
                }, 1500);
                return;
            }
            var days = Math.floor(distance / _day);
            var hours = Math.floor((distance % _day) / _hour);
            var minutes = Math.floor((distance % _hour) / _minute);
            var seconds = Math.floor((distance % _minute) / _second);

            document.getElementById('js_countdown').innerHTML = '<div style="display:none">' + days + '<span> օր </span> </div>';
            document.getElementById('js_countdown').innerHTML += '<div>' + hours + '<span>  h </span> </div>';
            document.getElementById('js_countdown').innerHTML += '<div>' + minutes + '<span> m </span> </div>';
            document.getElementById('js_countdown').innerHTML += '<div>' + seconds + '<span> s </span> </div>';
        }
        timer = setInterval(showRemaining, 1000);
    }
    function ShowWarnMessage(message) {
        let html = '<div id="js_pr_warnMsg" class="popup_promo autoopen_clicked justify-content-center align-items-center d-flex">' +
            '<div class="spinner_popup">' +
            '<div class="spinner_popup_content"><div class="popup_header border-none d-flex justify-content-between align-items-center" > <span class="close_popup_button" id="js_pr_warnMsg_close"></span></div></div>' +
            '<div class="popup_body text-center"><svg xmlns = "http://www.w3.org/2000/svg" width = "97" height = "97" viewBox = "0 0 97 97" fill = "none" class="popup_img">' +
            '<path fill-rule="evenodd" clip-rule="evenodd" d="M48.4961 89.1154C70.9274 89.1154 89.1115 70.9313 89.1115 48.5C89.1115 26.0687 70.9274 7.88462 48.4961 7.88462C26.0648 7.88462 7.88071 26.0687 7.88071 48.5C7.88071 70.9313 26.0648 89.1154 48.4961 89.1154ZM48.4961 96.5C75.0058 96.5 96.4961 75.0097 96.4961 48.5C96.4961 21.9903 75.0058 0.5 48.4961 0.5C21.9864 0.5 0.496094 21.9903 0.496094 48.5C0.496094 75.0097 21.9864 96.5 48.4961 96.5Z" fill="#E3E3E3"/>' +
            '<path d="M48.2498 61.4521C45.427 61.4521 42.957 63.7617 42.957 66.4012C42.957 69.0408 45.427 71.3503 48.2498 71.3503C51.0726 71.3503 53.5426 69.0408 53.5426 66.4012C53.8955 63.7617 51.4255 61.4521 48.2498 61.4521Z" fill="#E3E3E3"/>' +
            '<path d="M47.1913 25.8193C44.7213 26.4792 42.957 28.7887 42.957 31.4283C42.957 33.078 43.3099 34.7277 43.3099 36.3774C43.6627 42.3163 44.0156 48.5851 44.3684 54.524C44.3684 56.5037 46.1327 58.1534 48.2498 58.1534C50.3669 58.1534 52.1312 56.5037 52.1312 54.524C52.1312 53.2043 52.1312 52.2145 52.1312 50.8947C52.484 46.9354 52.484 42.9761 52.8369 39.0169C52.8369 36.3773 53.1897 34.0678 53.1897 31.4283C53.1897 30.4384 53.1897 29.7786 52.8369 28.7887C52.1312 26.4792 49.6612 25.1594 47.1913 25.8193Z" fill="#E3E3E3"/>' +
            '</svg> ' +
            '<p class="popup_text">' + message + '</p></div>' +
            ' <div class="popup_footer d-flex justify-content-end"><button class="btn_popup btn_popup__primary js_warn_button" id="js_warn_button">STOP</button></div></div></div>';
        $("body").append(html);
    }

    function SwAutoSpin() {
        autoSpinSw = false;
        prizeClicked = false;

        if (!stopAutoSpinSw) {
            counter++
            autoSpinSw = true;
            GetPrize();
        } else {
            $(".spinner_block_box").removeClass('animate_spin');
            $('#autoopen_cards_ended').css('display', 'flex');
            $('body').addClass('js_popup_active');
        }
    }

    function SwAutoSpinSecond() {
        autoSpinSw2 = false;
        prizeClicked = false;
        if (!stopAutoSpinSw2) {
            counter++
            autoSpinSw2 = true;
            GetPrizeSecond();
        } else {
            $(".spinner_block_box").removeClass('animate_spin');
            $('#autoopen_cards_ended').css('display', 'flex');
            $('body').addClass('js_popup_active');
        }
    }

    function MysteryBoxAnimation(prizeId) {

        if ($('#mysteryBoxContent .flip_card_block.active').index() == 0) {
            LastprizePosition = 0;
        }
        prizePosition = $("#" + prizeId).first().data('order') - 1;
        var segmentCount = Promotions.segmentCount;

        let count = 0;

        if (prizePosition - LastprizePosition <= 0) {
            count = prizePosition - LastprizePosition + segmentCount * 2;
        } else {
            count = prizePosition - LastprizePosition + segmentCount;
        }

        let caseV = 0;
        let speed = fWAnimaSpeedCounter / (count - 4);
        let speedSlow = fWAnimaSpeedCounter / 10;
        $('.mysteryBox_list').addClass('stylefoitem');
        $('#mysteryBoxContent').addClass('notclickabel');
        $('.mysteryBox_list').removeClass('clicked');

        var animMysteryInt = function () {
            BoxSound.currentTime = 0;
            BoxSound.play();
            if ($('#mysteryBoxContent .flip_card_block.active').index() + 1 == $('#mysteryBoxContent .flip_card_block').length) {
                $('#mysteryBoxContent .flip_card_block.active').removeClass('active');
                $('#mysteryBoxContent .flip_card_block').eq(0).addClass('active');
            } else {
                $('#mysteryBoxContent .flip_card_block.active').removeClass('active').next().addClass('active');
            }
            caseV++;
            if (caseV == count) {
                $('#mysteryBoxContent .flip_card_block.active').addClass('flip_card_anim').animate({
                    opacity: 1,
                }, fWAnimaSpeedCounter / 1.2, function () {

                    $('#mysteryBoxContent .flip_card_block.active').removeClass('flip_card_anim');

                    if (Promotions.ClientActiveEntry <= 0) {

                        stopAutoSpinSw = true;

                        Promotions.hasActiveBonuse == "false";
                        Promotions.hasWheelActiveBuyBonuse == "false";

                        $("#wheel__spinBtn").addClass("disabled");
                        $(".js_availableSpins").addClass("dis_none");
                        $("#js_tab_first_spinCount").addClass("dis_none");
                        $("#js_sw_turboSpin").addClass("disabled").removeClass("checked");
                        $("#js_sw_auto_spin").addClass("disabled");
                        $("#js_sw_auto_spin").css('display', 'block');
                        $("#js_sw_stop_auto_spin").css('display', 'none');
                    }

                    if (Promotions.ClientActiveEntry >= 2 * Promotions.exchangeRate) {
                        $(".js_exchange_btn").removeClass("disabled");
                        $(".js_exchange_popup").removeClass('dis_none');
                        let changingPoint = Promotions.exchangeRate;
                        if (changingPoint <= (Promotions.ClientActiveEntry - Promotions.exchangeRate)) {
                            $(".js_plus_btn").removeClass("disabled");
                        } else {
                            $(".js_plus_btn").addClass("disabled");
                        }

                        if (Promotions.exchangeRate > 1) {

                            if (Promotions.ClientActiveEntry < changingPoint) {
                                $('.js_exchange_rate').text(Number(changingPoint) - Number(Promotions.exchangeRate));
                                $('.js_exchange_result').text(Number($('.js_exchange_result')[0].textContent) - 1);
                            }
                            $(".js_exchange_popup").text(Math.trunc(Promotions.ClientActiveEntry / Promotions.exchangeRate));
                        }

                    } else if (Promotions.ClientActiveEntry >= Promotions.exchangeRate) {
                        $(".js_exchange_btn").removeClass("disabled");
                        $(".js_exchange_popup").removeClass('dis_none');
                        $(".js_plus_btn").addClass("disabled");
                        $(".js_minus_btn").addClass("disabled");
                        $('.js_exchange_result').text("1");
                        $(".js_exchange_popup").text(1);
                    } else {
                        $(".js_exchange_btn  ").addClass("disabled");
                        $(".js_plus_btn").addClass("disabled");
                        $(".js_minus_btn").addClass("disabled");
                        $(".js_exchange_popup").text(0);
                    }


                    $('.mysteryBox_item.active').addClass('opened');

                    let MysteryAudioSrc = Promotions.CDNURL + '/Audio/mystery_box_open_sound.mp3';
                    let MysterySound = new Howl({
                        src: [MysteryAudioSrc],

                    });
                    setTimeout(function () {
                        MysterySound.currentTime = 0;
                        MysterySound.play();
                        openPopup();
                        $('#mysteryBoxContent .mysteryBox_item').removeClass('active1');
                        $('#mysteryBoxContent .mysteryBox_item').removeClass('opened');

                        if (parseInt($("#js_tab_mysteryBox_spinCount").text()) == 0) {
                            $("#js_random").addClass("disabled");
                            $("#js_open_btn").addClass("disabled");
                            $("#js_tab_mysteryBox_spinCount").addClass("dis_none");
                        }

                    }, 1000); //  after 1 seconds   
                
                    $('.play_cards_block').removeClass('stylefoitem');
                    $('#mysteryBoxContent').removeClass('notclickabel');
                    $('.mysteryBox_list:first-child').addClass('clicked');
                    LastprizePosition = prizePosition;
                });

            } else if (caseV < count - 4) {
                setTimeoutWithFrame(function () { animMysteryInt(); }, speed, fn => cancel = fn)

            } else {
                speedSlow = speedSlow + (fWAnimaSpeedCounter / 43);
                setTimeoutWithFrame(function () { animMysteryInt(); }, speedSlow, fn => cancel = fn)
            }           
        };

        setTimeout(function () {
            if (openPopupHelper.UpdateTreasury) {
                UpdateTreasury();
            }           

            if (openPopupHelper.CurrentWheelKey) {
                $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry);
                $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry);
                $(".js_totoalPoints").empty().append(Promotions.ClientActiveEntry);
                $("#wheel__spinBtn").removeClass("disabled");
                $(".js_availableSpins").removeClass("dis_none");
                $("#js_tab_first_spinCount").removeClass("dis_none");
                $("#js_sw_stop_auto_spin").removeClass("disabled");
                $("#js_sw_auto_spin").removeClass("disabled");
                $("#js_sw_turboSpin").removeClass("disabled");
            }

            if (openPopupHelper.NextWheelKey) {
                $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);
                $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                $(".js_totoalPoints").empty().append(Promotions.ClientActiveWheelEntry);
                $("#wheel__spinBtn2").removeClass("disabled");
                $(".js_availableSpins2").removeClass("dis_none");
                $("#js_tab_second_spinCount").removeClass("dis_none");
                $("#js_sw_stop_auto_spin2").removeClass("disabled");
                $("#js_sw_auto_spin2").removeClass("disabled");
                $("#js_sw_turboSpin2").removeClass("disabled");
            }

            if (openPopupHelper.DynamicFreeSpin || openPopupHelper.DynamicBetOnGames || openPopupHelper.CasinoDynamicWager || openPopupHelper.DynamicSportFreeBet || openPopupHelper.DynamicSportWager) {
                UpdateDynamicBonuses();
            }
        }, 2500);


        animMysteryInt();
    }
    function GetPrizeMysteryBox(isRandom) {

        if (prizeClicked) {
            return
        }

        openPopupHelper.name = "";
        openPopupHelper.RemainingBonusAmount = "";
        openPopupHelper.RemainingBonusAmountFormat = "";
        openPopupHelper.type = 0;
        openPopupHelper.PrizeId = 0;
        openPopupHelper.Counts = 0;
        openPopupHelper.UpdateTreasury = false;
        openPopupHelper.Keys = [];
        openPopupHelper.DynamicFreeSpin = false;
        openPopupHelper.DynamicBetOnGames = false;
        openPopupHelper.DynamicSportFreeBet = false;
        openPopupHelper.DynamicSportWager = false;
        openPopupHelper.CasinoDynamicWager = false;
        openPopupHelper.Betcoin = false;
        openPopupHelper.CurrentWheelKey = false;
        openPopupHelper.widgetClone = false;
        openPopupHelper.NextWheelKey = false;
        prizeClicked = true;

        $.ajax({
            type: "POST",
            url: "/PromotionV1/CheckPrize",
            data: { PromotionId: Promotions.promotionId, PromoEntryId: Promotions.MysteryBoxEntryId, WheelId: "2", IsAutoPlay: false, DeviceType: Promotions.deviceTypeGivePrize },
            success: function (result) {           
                if (result.Success == true) {
                    for (var i = 0; i < result.ClosedPeriods.length; i++) {
                        if (result.ClosedPeriods[i].EntryTypeId == 1) {
                            var ClientStandartEntry = result.ClosedPeriods[i];
                        }
                        if (result.ClosedPeriods[i].EntryTypeId == 4) { //Wheel
                            var ClientWheelEntry = result.ClosedPeriods[i];
                            Promotions.ClientActiveWheelEntry = ClientWheelEntry.TotalPoints;
                        }
                        if (result.ClosedPeriods[i].EntryTypeId == 2) { //MysteryBox
                            var ClientMysteryBoxEntry = result.ClosedPeriods[i];
                        }
                    }

                    Promotions.AppPoints = ClientStandartEntry.AppPoints;

                    $("#js_tab_mysteryBox_spinCount").empty().append(ClientMysteryBoxEntry.TotalPoints);
                    Promotions.MysteryBoxPoints = ClientMysteryBoxEntry.TotalPoints;

                    if (Promotions.exchangeRate > 1) {
                        let changingPoint = Promotions.exchangeRate;
                        if (changingPoint <= (Promotions.ClientActiveEntry - Promotions.exchangeRate)) {
                            $(".js_plus_btn").removeClass("disabled");
                        } else {
                            $(".js_plus_btn").addClass("disabled");
                        }

                        if (Promotions.exchangeRate > 1) {
                            if (ClientStandartEntry.TotalPoints < changingPoint) {
                                $(".js_exchange_btn  ").addClass("disabled");
                            } else {
                                $(".js_exchange_btn  ").removeClass("disabled");
                            }

                            $(".js_exchange_popup").text(Math.trunc(ClientStandartEntry.TotalPoints / Promotions.exchangeRate));
                        }
                    }

                    prizes = result.PrizeType;

                    if (Promotions.isMobAppAndIos) {
                        Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints + ClientStandartEntry.AppPoints; //Standard   
                    } else {
                        Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints; //Standard   
                    }

                    if (ClientWheelEntry != null) {
                        Promotions.ClientActiveWheelEntry = ClientWheelEntry.TotalPoints; //wheel          
                    }

                    openPopupHelper.Keys = result.Keys;
                    switch (prizes) {
                        case PrizeTypes.DynamicFreeSpin:
                            openPopupHelper.type = PromotionPopupsTypes.DynamicFreeSpin
                            openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                            openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                            openPopupHelper.DynamicFreeSpin = true;
                            break;
                        case PrizeTypes.FreeSpins:
                            openPopupHelper.type = PromotionPopupsTypes.FreeSpins
                            break;
                        case PrizeTypes.BetCoins:
                            if (ClientWheelEntry != null) {
                                if (ClientWheelEntry.TotalPoints > 0) {
                                    Promotions.ClientActiveWheelEntry = ClientWheelEntry.TotalPoints;
                                    $("#wheel__spinBtn2").removeClass('disabled');
                                    $(".js_availableSpins2").removeClass("dis_none");
                                    $("#js_tab_second_spinCount").removeClass("dis_none");
                                    $("#js_sw_auto_spin2").removeClass('disabled');
                                    $("#js_sw_turboSpin2").removeClass('disabled');
                                }
                            }
                            if (ClientStandartEntry != null) {
                                if (Promotions.isMobAppAndIos) {
                                    if (ClientStandartEntry.TotalPoints + ClientStandartEntry.AppPoints > 0) {
                                        Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints + ClientStandartEntry.AppPoints;
                                        $("#wheel__spinBtn").removeClass('disabled');
                                        $(".js_availableSpins").removeClass("dis_none");
                                        $("#js_tab_first_spinCount").removeClass("dis_none");
                                        $("#js_sw_auto_spin").removeClass('disabled');
                                        $("#js_sw_turboSpin").removeClass('disabled');
                                    }
                                } else {
                                    if (ClientStandartEntry.TotalPoints > 0) {
                                        Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints;
                                        $("#wheel__spinBtn").removeClass('disabled');
                                        $(".js_availableSpins").removeClass("dis_none");
                                        $("#js_tab_first_spinCount").removeClass("dis_none");
                                        $("#js_sw_auto_spin").removeClass('disabled');
                                        $("#js_sw_turboSpin").removeClass('disabled');
                                    } 
                                }
                                
                            }

                            if (result.ClientBetCoins == 0) {

                                if (result.BetCoinRuleTypeId == BetCoinRuleType.Prize) {
                                    openPopupHelper.type = PromotionPopupsTypes.BetCoinPrizeFinal;
                                    if (result.PrizeSubType == PrizeTypes.DynamicSportFreeBet) {
                                        openPopupHelper.DynamicSportFreeBet = true;
                                        openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                        openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                    } else if (result.PrizeSubType == PrizeTypes.CasinoDynamicWager) {
                                        openPopupHelper.CasinoDynamicWager = true;
                                        openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                        openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                    } else if (result.PrizeSubType == PrizeTypes.DynamicBetOnGames) {
                                        openPopupHelper.DynamicBetOnGames = true;
                                        openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                        openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                    } else if (result.PrizeSubType == PrizeTypes.DynamicSportWager) {
                                        openPopupHelper.DynamicSportWager = true;
                                        openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                        openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                    } else if (result.PrizeSubType == PrizeTypes.DynamicFreeSpin) {
                                        openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                        openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                        openPopupHelper.DynamicFreeSpin = true;
                                    }
                                } else {
                                    openPopupHelper.type = PromotionPopupsTypes.BetcoinFinal;
                                }
                                UpdateBetcoinGroup(result);

                            } else {
                                openPopupHelper.type = PromotionPopupsTypes.BetCoin;
                                if (result.BetCoinRuleTypeId == BetCoinRuleType.Prize) {
                                    openPopupHelper.type = PromotionPopupsTypes.BetCoinPrize;
                                }
                            }

                            openPopupHelper.Counts = result.ClientBetCoins;
                            openPopupHelper.UpdateTreasury = true;
                            openPopupHelper.Betcoin = true;
                            openPopupHelper.PrizeId = result.PrizeGroupId;
                            break;

                        case PrizeTypes.DynamicSportFreeBet:
                            openPopupHelper.DynamicSportFreeBet = true;
                            openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                            openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                            openPopupHelper.type = PromotionPopupsTypes.DynamicSportFreeBet
                            break;
                        case PrizeTypes.CurrentWheelKey:
                            if (!$("#spinnerCont").hasClass("js_bonus_activation")) {
                                openPopupHelper.CurrentWheelKey = true;
                            }
                            if (Promotions.isMobAppAndIos) {
                                Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints + ClientStandartEntry.AppPoints; //Standard   
                            } else {
                                Promotions.ClientActiveEntry = ClientStandartEntry.TotalPoints; //Standard   
                            }

                            openPopupHelper.type = PromotionPopupsTypes.CurrentWheelKey
                            break;
                        case PrizeTypes.NextWheelKey:
                            openPopupHelper.NextWheelKey = true;
                            openPopupHelper.type = PromotionPopupsTypes.NextWheelKey;
                            $("#wheel__spinBtn2").removeClass("disabled");
                            $(".js_availableSpins2").removeClass("dis_none");
                            $("#js_tab_second_spinCount").removeClass("dis_none");
                            $("#js_sw_stop_auto_spin2").removeClass("disabled");
                            $("#js_sw_auto_spin2").removeClass("disabled");
                            $("#js_sw_turboSpin2").removeClass("disabled");
                            break;
                        case PrizeTypes.Money:
                            openPopupHelper.type = PromotionPopupsTypes.Money
                            break;
                        case PrizeTypes.FreeAmount:
                            openPopupHelper.type = PromotionPopupsTypes.FreeAmount
                            break;
                        case PrizeTypes.FreeBet:
                            openPopupHelper.type = PromotionPopupsTypes.FreeBet
                            break;
                        case PrizeTypes.CasinoFreeBet:
                            openPopupHelper.type = PromotionPopupsTypes.CasinoFreeBet
                            break;
                        case PrizeTypes.SportWager:
                            openPopupHelper.type = PromotionPopupsTypes.SportWager
                            break;
                        case PrizeTypes.SportRealWager:
                            openPopupHelper.type = PromotionPopupsTypes.SportRealWager
                            break;
                        case PrizeTypes.GeneralRealMoney:
                            openPopupHelper.type = PromotionPopupsTypes.GeneralRealMoney
                            break;
                        case PrizeTypes.SportFreeBet:
                            openPopupHelper.type = PromotionPopupsTypes.SportFreeBet
                            break;
                        case PrizeTypes.CasinoWager:
                            openPopupHelper.type = PromotionPopupsTypes.CasinoWager
                            break;
                        case PrizeTypes.CasinoDynamicWager:
                            openPopupHelper.CasinoDynamicWager = true;
                            openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                            openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormats;
                            openPopupHelper.type = PromotionPopupsTypes.CasinoDynamicWager
                            break;
                        case PrizeTypes.DynamicBetOnGames:
                            openPopupHelper.type = PromotionPopupsTypes.DynamicBetOnGames
                            openPopupHelper.DynamicBetOnGames = true;
                            openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                            openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                            break;
                        case PrizeTypes.DynamicSportWager:
                            openPopupHelper.type = PromotionPopupsTypes.DynamicSportWagerBonus;
                            openPopupHelper.DynamicSportWager = true;
                            openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                            openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                            break;
                        case PrizeTypes.BalanceMultiplier:
                            openPopupHelper.type = PromotionPopupsTypes.BalanceMultiplier
                            break;
                        case PrizeTypes.Combination:

                            if (result.CombPrizeGroupName == null || result.CombPrizeGroupName == "") {
                                openPopupHelper.type = PromotionPopupsTypes.Combination
                            } else if (result.PrizeSubType == PrizeTypes.SportFreeBet) {
                                openPopupHelper.type = PromotionPopupsTypes.CombinationGroupSportFreeBet
                            } else {
                                openPopupHelper.widgetClone = true;
                                openPopupHelper.type = PromotionPopupsTypes.CombinationLetter
                            }

                            openPopupHelper.PrizeId = result.PrizeGroupId;
                            openPopupHelper.Counts = (result.CombinationPrizes).PrizeCount;
                            openPopupHelper.UpdateTreasury = true;
                            break;
                        case PrizeTypes.Material:
                            openPopupHelper.type = PromotionPopupsTypes.Material
                            break;
                        case PrizeTypes.Group:

                            if (result.IsExchangablePrize) {
                                openPopupHelper.type = PromotionPopupsTypes.ExchangeablePrize;
                                break;
                            } else if ((result.PrizeName).length == 1) {
                                if (!result.IsExchangablePrize) {
                                    openPopupHelper.widgetClone = true;
                                }
                                openPopupHelper.type = PromotionPopupsTypes.GroupMoneyLetter;
                                break;
                            } else if (result.PrizeSubType == PrizeTypes.SportFreeBet) {
                                openPopupHelper.type = PromotionPopupsTypes.GroupSportFreeBet;
                            } else if (result.PrizeSubType == PrizeTypes.Material) {
                                openPopupHelper.type = PromotionPopupsTypes.GroupMaterial;
                            } else if (result.PrizeSubType == PrizeTypes.Money && !(result.CombPrizeGroupName == null || result.CombPrizeGroupName == "")) {
                                openPopupHelper.type = PromotionPopupsTypes.GroupMoneyLetter;
                            } else if (result.PrizeSubType == PrizeTypes.Money && (result.PrizeName).length > 1) {
                                openPopupHelper.type = PromotionPopupsTypes.Group;
                            } else if (result.PrizeSubType == PrizeTypes.DynamicSportFreeBet) {
                                openPopupHelper.DynamicSportFreeBet = true;
                                openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                openPopupHelper.type = PromotionPopupsTypes.GroupDynamicSportFreeBet;
                            } else if (result.PrizeSubType == PrizeTypes.CasinoDynamicWager) {
                                openPopupHelper.CasinoDynamicWager = true;
                                openPopupHelper.RemainingBonusAmount = result.RemainingBonusAmount;
                                openPopupHelper.RemainingBonusAmountFormat = result.RemainingBonusAmountFormat;
                                openPopupHelper.type = PromotionPopupsTypes.GroupCasinoDynamicWager;
                            } else if (result.PrizeSubType == PrizeTypes.CasinoWager) {
                                openPopupHelper.type = PromotionPopupsTypes.GroupCasinoWager;
                            } else {
                                openPopupHelper.type = PromotionPopupsTypes.Group;
                            }

                            openPopupHelper.UpdateTreasury = true;
                            openPopupHelper.PrizeId = result.PrizeGroupId;
                            openPopupHelper.BigPrizeId = result.BigPrizeGroupId;
                            openPopupHelper.Counts = (result.CombinationPrizes).PrizeCount;
                            break;
                        case PrizeTypes.NoWin:
                            openPopupHelper.type = PromotionPopupsTypes.NoWin
                            break;

                        default:
                            prizeClicked = false;
                            break;
                    }

                    if (autoSpinSw) {
                        if (prizes == PrizeTypes.Group) {
                            $("#js_sw_auto_spin").css('display', 'block');
                            $("#js_sw_stop_auto_spin").css('display', 'none');
                            stopAutoSpinSw = true;
                            autoSpinSw = false;
                        }
                    }

                    if ($("#js_client_history").hasClass('active')) {
                        $('#js_client_history').trigger('click');

                    }
                    $('#tab3').removeClass('updated');
                    $('#tab4').removeClass('updated');
                    pageCount = 1;
                    pageCountAll = 1;
                    historyclicked = false;

                    openPopupHelper.name = $("#" + result.PrizeGroupId + " img").attr("src");

                    if ((result.PrizeType == PrizeTypes.Group || (result.PrizeType == PrizeTypes.Combination && result.GroupPrizeName != "" && result.GroupPrizeName != null)) ||
                        (result.ClientBetCoins == 0 && PrizeTypes.BetCoins == result.PrizeType && result.BetCoinRuleTypeId == BetCoinRuleType.Prize)) {
                        if (result.ImageURL != null) {
                            openPopupHelper.name = Promotions.CDNURL + result.ImageURL;
                        }

                    }
                    if (isRandom) {
                        $('#mysteryBoxContent .mysteryBox_item').removeClass('active1')
                        MysteryBoxAnimation(result.PrizeGroupId);
                    } else {
                        $('.mysteryBox_item.active1').addClass('opened');
                    }

                    setMysteryPopupText(result, isRandom);

                    if (openPopupHelper.NextWheelKey == true && !isRandom) {
                        $(".js_availableSpins2").empty().append(Promotions.ClientActiveWheelEntry);
                        $("#js_tab_second_spinCount").empty().append(Promotions.ClientActiveWheelEntry);
                        $(".js_totoalPoints").empty().append(Promotions.ClientActiveWheelEntry);
                        $("#wheel__spinBtn2").removeClass("disabled");
                        $(".js_availableSpins2").removeClass("dis_none");
                        $("#js_tab_second_spinCount").removeClass("dis_none");
                        $("#js_sw_stop_auto_spin2").removeClass("disabled");
                        $("#js_sw_auto_spin2").removeClass("disabled");
                        $("#js_sw_turboSpin2").removeClass("disabled");
                    }                   

                    setTimeout(function () {

                        if (openPopupHelper.UpdateTreasury) {
                            UpdateTreasury();
                        }

                        if (parseInt($("#js_tab_mysteryBox_spinCount").text()) == 0) {
                            $("#js_random").addClass("disabled");
                            $("#js_open_btn").addClass("disabled");
                            $("#js_tab_mysteryBox_spinCount").addClass("dis_none");
                            $("#mysteryBoxContent").addClass("notclickabel");
                            $('.mysteryBox_list').removeClass('clicked');
                        }

                    }, 1500); //  after 1 seconds   

                    if (openPopupHelper.CurrentWheelKey && !isRandom) {
                        $(".js_availableSpins").empty().append(Promotions.ClientActiveEntry);
                        $("#js_tab_first_spinCount").empty().append(Promotions.ClientActiveEntry);
                        $(".js_totoalPoints").empty().append(Promotions.ClientActiveEntry);
                        $("#wheel__spinBtn").removeClass("disabled");
                        $(".js_availableSpins").removeClass("dis_none");
                        $("#js_tab_first_spinCount").removeClass("dis_none");
                        $("#js_sw_stop_auto_spin").removeClass("disabled");
                        $("#js_sw_auto_spin").removeClass("disabled");
                        $("#js_sw_turboSpin").removeClass("disabled");
                    }


                    if ((openPopupHelper.DynamicFreeSpin || openPopupHelper.DynamicBetOnGames || openPopupHelper.CasinoDynamicWager || openPopupHelper.DynamicSportFreeBet || openPopupHelper.DynamicSportWager) && !isRandom) {
                        UpdateDynamicBonuses();
                    }

                } else {
                    setPopupErrText(result.Message);

                }
                historyclicked = false;
            },
        });
    }

    $('#js_sw_auto_spin').click(function () {
        if (prizeClicked) {
            ShowWarnMessage("You have an activated action. Stop it to continue");
        }
        else {
            isSecondWheel = false;
            counter = 0;
            $('#autoopen_clicked').css('display', 'flex');
            $('body').addClass('js_popup_active');
            document.getElementById("js_animate").scrollIntoView(false);
        }
    });

    $("#js_sw_stop_auto_spin").on("click", function () {
        $("#js_sw_auto_spin").css('display', 'block');
        $("#js_sw_stop_auto_spin").css('display', 'none');
        isSecondWheel = false;
        stopAutoSpinSw = true;    
    });

    $('#js_sw_auto_spin2').click(function () {
        if (prizeClicked) {
            ShowWarnMessage("You have an activated action. Stop it to continue");
        }
        else {
            isSecondWheel2 = false;
            counter = 0;
            $('#autoopen_clicked').css('display', 'flex');
            $('body').addClass('js_popup_active');
            document.getElementById("js_animate").scrollIntoView(false);
        }
    });

    $("#js_sw_stop_auto_spin2").on("click", function () {
        $("#js_sw_auto_spin2").css('display', 'block');
        $("#js_sw_stop_auto_spin2").css('display', 'none');
        isSecondWheel2 = false;
        stopAutoSpinSw2 = true;
    });

    $("#js_confirm_auto_spin").on("click", function () {
        promoStartSound.pause();
        if ($("#js_secondMathis").hasClass("swiper-slide-thumb-active")) {
            stopAutoSpinSw2 = false;
            if (Promotions.ClientActiveWheelEntry == 1) {

                if (!$("#wheelcontent").hasClass("js_bonus_activation")) {
                    GetPrizeSecond();
                } else {
                    var availableSpinsWheel = $("#js_unused_active_bonus_count2").text();
                    if (availableSpinsWheel < 2) {
                        GetPrizeSecond();
                    } else {
                        SwAutoSpinSecond();
                    }
                }

            } else {
                SwAutoSpinSecond();
            }
            $("#js_sw_auto_spin2").css('display', 'none');
            $("#js_sw_stop_auto_spin2").css('display', 'block');
            $('#autoopen_clicked').css('display', 'none');
            $('body').removeClass('js_popup_active');

        } else {
            stopAutoSpinSw = false;
            if (Promotions.ClientActiveEntry == 1) {
                if (!$("#spinnerCont").hasClass("js_bonus_activation")) {
                    GetPrize();
                } else {
                    var availableSpinsStandard = $("#js_unused_active_bonus_count").text();
                    if (availableSpinsStandard < 2) {
                        GetPrize();
                    } else {
                        SwAutoSpin();
                    }
                }

            } else {
                SwAutoSpin();
            }
            $("#js_sw_auto_spin").css('display', 'none');
            $("#js_sw_stop_auto_spin").css('display', 'block');
            $('#autoopen_clicked').css('display', 'none');
            $('body').removeClass('js_popup_active');
        }
    });
    $(document).on('click', '.js_fw_spin_btn_popup_shake', function () {
        ClosePopup();
        $('body').removeClass('js_popup_active');

        if (typeof swiper2 != "undefined") {
            swiper2.slideTo(0, 0, true);
        }        
        $("#wheel__spinBtn").trigger("click");

    });

    $(document).on('click', '.js_fw_spin_btn_popup_shake2', function () {
        ClosePopup();
        $('body').removeClass('js_popup_active');
        if (typeof swiper2 != "undefined") {
            swiper2.slideTo(1, 0, true);
        }
       
        $("#wheel__spinBtn2").trigger("click");

    });

    $(document).on('click', '.js_dice_block', function () {
        if ((Promotions.isMobileView || Promotions.isMobAppAndIos) && parseInt(Promotions.ShakeCount) > 0) {
            $('#app_open_popup').hide();
            $('body').removeClass('js_popup_active');
            if (typeof swiper2 != "undefined") {
                swiper2.slideTo(2, 0, true);
            }
        }
    });
    $(document).on('click', '.js_gift_block', function () {
        if ((Promotions.isMobileView || Promotions.isMobAppAndIos) && parseInt(Promotions.AppPoints) > 0) {
            $('#app_open_popup').hide();
            $('body').removeClass('js_popup_active');
            if (typeof swiper2 != "undefined") {
                swiper2.slideTo(0, 0, true);
            }
        }
    });



    $(document).on('click', '#js_close_Shake_Popup ', function () {
        ClosePopup();
        $(".canvas-container").css('display', 'none');
        ShakeStarted = false;

    });
    $('#js_autoopen_ended_close').click(function () {
        isAnimationstart = false;
        ClosePopup();
        $('#autoopen_cards_ended').css('display', 'none');
        $('body').removeClass('js_popup_active');
    });

    $('#js_auto_spin_popup_close').click(function () {
        $('#autoopen_clicked').css('display', 'none');
        $('body').removeClass('js_popup_active');
    });

    $(document).on('click', '#js_prize_history', function () {

        $("#autoopen_cards_ended").fadeOut();
        $('body').removeClass('js_popup_active');

        if (!$('#js_client_history').hasClass('active')) {
            $('.js_client_history').trigger("click");
        }

        $(window).scrollTop(($('#remove_menu_active').offset().top - 400));
    });
    function setCookieHours(name, value, hours) {
        const d = new Date();
        d.setTime(d.getTime() + hours * 60 * 60 * 1000);
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    $(window).on("load", function () {

        $('body').removeClass('js_popup_active');

        if ((parseInt(Promotions.AppPoints) > 0 || parseInt(Promotions.ShakeCount) > 0) && getCookie("appGifPopup") == '' && (Promotions.isMobileView || Promotions.isMobAppAndIos)) {
            $("html, body").animate({ scrollTop: $("#js_animate").offset().top }, 600);
           // $('.js_open_app_popup').trigger('click');

           if (Promotions.AppPoints == 0) {
               $(".js_gift_block img").addClass("disabled")
           }
           if (Promotions.ShakeCount == 0) {
               $(".js_dice_block img").addClass("disabled")
           }

           $('.ds_info').show();
           $('.ds_popup_title').removeClass('dis_none');
           $('.ds_qr').hide();
           $('.js_qrTitle').addClass('dis_none');
           $("#app_open_popup").css('display', 'flex');
           document.getElementById("js_animate").scrollIntoView(false);
           $('body').addClass('js_popup_active');
        }

        if (Promotions.BlockedForPromotion != 'False') {
            $("#popup_flex_box").addClass("error_popup");
            $(".spinner_popup_error").show();
            $('.js_error').html($('#js_ConectionProbDec').val().replace('#{ErrorCode}', 40));
            $("#popup_flex_box").css("display", "flex");
            $('body').addClass('js_popup_active');
        }

        if (Promotions.isLoggedin && Promotions.BlockForBetsandDeposits != 40) {
            BlockOrdering();
        }
        if (Promotions.BlockForBetsandDeposits == 40) {
            $("#popup_flex_box").addClass("error_popup");
            $(".spinner_popup_error").show();
            $('.js_error').html($('#js_ConectionProbDec').val().replace('#{ErrorCode}', 40));
            //js_ConectionProbDec
            $("#popup_flex_box").css("display", "flex");
            $('body').addClass('js_popup_active');
        }
        if ($('.range_element').length > 0) {
            setRange();           
        }

        if (Promotions.isLoggedin) {
            SetActiveElement();
        }

        if (!Promotions.hasStandardActiveBuyBonus) {
            $("#jSwheel_box__inner").empty();

            $("#js_first_animation").removeClass("bigBoxCount");
            $("#js_first_animation").removeClass("midCount");
            if (Promotions.segmentCount > 13) {
                $("#js_first_animation").addClass("bigBoxCount");
            } else if (Promotions.segmentCount > 7 && Promotions.segmentCount <= 13) {
                $("#js_first_animation").addClass("midCount");
            }

            $('#js_hasNot_sActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner");
            $("#jSwheel_box__inner").removeAttr("style");
        }
        if (!Promotions.hasWheelActiveBuyBonuse) {
            $("#jSwheel_box__inner2").empty();

            $("#js_second_animation").removeClass("bigBoxCount");
            $("#js_second_animation").removeClass("midCount");
            if (Promotions.segmentCount2 > 13) {
                $("#js_second_animation").addClass("bigBoxCount");
            } else if (Promotions.segmentCount2 > 7 && Promotions.segmentCount2 <= 13) {
                $("#js_second_animation").addClass("midCount");
            }

            $('#js_hasNot_wActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner2");
            $("#jSwheel_box__inner2").removeAttr("style");
        }

        if (Promotions.hasStandardActiveBuyBonus || Promotions.hasWheelActiveBuyBonuse) {
            $(".js_has_buyBonus").css('display', 'none');

            $(".js_has_buyBonus").addClass('border_none');

            if (Promotions.hasWheelActiveBuyBonuse) {
                $(".js_active_bonus_text2").css('display', 'flex');
                if (typeof swiper2 != "undefined") {
                    swiper2.slideNext();
                }
                
                $("#jSwheel_box__inner2").empty();

                $("#js_second_animation").removeClass("bigBoxCount");
                $("#js_second_animation").removeClass("midCount");
                if (Promotions.SecondBuyBonusegmentCount2 > 13) {
                    $("#js_second_animation").addClass("bigBoxCount");
                } else if (Promotions.SecondBuyBonusegmentCount2 > 7 && Promotions.SecondBuyBonusegmentCount2 <= 13) {
                    $("#js_second_animation").addClass("midCount");
                }
                $('#js_has_wActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner2");
                $("#jSwheel_box__inner2").removeAttr("style");

                $("#wheel__spinBtn").addClass("disabled");
                $(".js_availableSpins").addClass("dis_none");
                $("#js_tab_first_spinCount").addClass("dis_none");
                $("#js_sw_auto_spin").addClass("disabled");
                $("#js_sw_turboSpin").addClass("disabled").removeClass("checked");

            } else {
                $(".js_active_bonus_text").css('display', 'flex');
                $(".js_active_bonus_text2").closest('.js_BuyBonus_Exchange').removeClass('exchange_box_border');
                $("#jSwheel_box__inner").empty();
                $("#js_first_animation").removeClass("bigBoxCount");
                $("#js_first_animation").removeClass("midCount");
                if (Promotions.FirstBuyBonusegmentCount > 13) {
                    $("#js_first_animation").addClass("bigBoxCount");
                } else if (Promotions.FirstBuyBonusegmentCount > 7 && Promotions.FirstBuyBonusegmentCount <= 13) {
                    $("#js_first_animation").addClass("midCount");
                }
                $('#js_has_sActiveBuyBonuse').clone().appendTo("#jSwheel_box__inner");
                $("#jSwheel_box__inner").removeAttr("style");
                $("html, body").animate({ scrollTop: $("#js_firstMathis").offset().top }, 600);

                SecondMachineButtonDisable();
            }
        }
        prizeClicked = false;
    });

    if (Promotions.ShowCountDown && Promotions.ClientActiveEntry == 0 && Promotions.isLoggedin) {
        startTournamentCountDown()
    }
    $('#wheel__spinBtn').click(function () {
        if (prizeClicked) {
            //ShowWarnMessage("You have an activated action. Stop it to continue");
        } else {
            if (!autoSpinSw) {
                isSecondWheel = true;
                promoStartSound.pause();
                GetPrize();
            }
        }

    })

    $('#js_open_btn').click(function () {
        if ($(".mysteryBox_item").hasClass('active1')) {
            if (!prizeClicked) {
                isMysteryBox = true;
                promoStartSound.pause();
                GetPrizeMysteryBox(false);
            }
        }

    })
    $('#js_random').click(function () {
        if (!prizeClicked) {
            isMysteryBox = true;
            promoStartSound.pause();
            GetPrizeMysteryBox(true);
        }
    })

    $('#wheel__spinBtn2').click(function () {
        if (prizeClicked) {
            // ShowWarnMessage("You have an activated action. Stop it to continue");
        } else {
            if (!autoSpinSw2) {
                promoStartSound.pause();
                isSecondWheel2 = true;
                GetPrizeSecond();
            }
        }

    })
    var timer;
    $("#js_sw_turboSpin").on("click", function () {

        $('.tooltipTurbo-box').fadeIn();
        clearTimeout(timer); // Clear any existing timer
        timer = setTimeout(function () {
            $('.tooltipTurbo-box').fadeOut(400);
        }, 4000); // Hide the popup after 4 seconds

        if ($(this).hasClass('checked')) {
            $('.tooltipTurbo_deActive').show();
            $('.tooltipTurbo_active').hide();
            $(this).removeClass('checked');
            isSwTurboSpin = false;
            fWAnimaSpeedCounter = 3000 / 1;
        } else {
            $('.tooltipTurbo_deActive').hide();
            $('.tooltipTurbo_active').show();
            $(this).addClass('checked');
            isSwTurboSpin = true;
            fWAnimaSpeedCounter = 3000 / 9;
        }

    });

    function CloseWarnMessage() {
        $("#js_pr_warnMsg").remove();
    }

    $(document).on('click', '#js_warn_button', function () {
        CloseWarnMessage();
        stopAutoSpinSw = true;
        stopAutoSpinSw2 = true;
        $("#js_auto_spin").css('display', 'flex');
        $("#js_stop_auto_spin").css('display', 'none');
        $("#js_sw_auto_spin").css('display', 'block');
        $("#js_sw_stop_auto_spin").css('display', 'none');
    });

    $(document).on('click', '#js_pr_warnMsg_close', function () {
        CloseWarnMessage();
    });

    $("#js_sw_turboSpin2").on("click", function () {

        $('.tooltipTurbo-box').fadeIn();
        clearTimeout(timer); // Clear any existing timer
        timer = setTimeout(function () {
            $('.tooltipTurbo-box').fadeOut(400);
        }, 4000); // Hide the popup after 4 seconds

        if ($(this).hasClass('checked')) {
            $('.tooltipTurbo_deActive').show();
            $('.tooltipTurbo_active').hide();
            $(this).removeClass('checked');
            isSwTurboSpin2 = false;
            fWAnimaSpeedCounter2 = 3000 / 1;
        } else {
            $('.tooltipTurbo_deActive').hide();
            $('.tooltipTurbo_active').show();
            $(this).addClass('checked');
            isSwTurboSpin2 = true;
            fWAnimaSpeedCounter2 = 3000 / 9;
        }

    });

    $(document).on("click", "#js_close_popup_button", function () {
        ClosePopup();
    });

    $(document).on("click", ".js_close_popup_button_big", function () {
        ClosePopup();
    });

    $(document).on('click', '#js_see_button', function (e) {

        ClosePopup();
        if (Promotions.isMobileView) {
            window.location.href = '/Bonus/NewBonuses';
        } else {
            $(".bonusesDialog").first().trigger("click");
        }

    });

    $(".js_join_btn").on("click", function (e) {

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'join_status',
            'status': true
        });

        $.ajax({
            type: "POST",
            data: { Id: parseInt(Promotions.PromoId) },
            url: "/PromotionV1/Join",
            success: function (result) {
                if (result.Success || (result.Message.length > 0 && result.Message[0].Key == 338)) {
                    document.location.reload();
                } else {
                    setPopupErrText(result.Message);
                }

            }
        });
    });

    $('#js_voice_btn').click(function () {
        $(this).toggleClass('voice_off');
        if ($("#js_voice_btn").hasClass("voice_off")) {
            promoStartSound.pause();
        } else {
            promoStartSound.play();
        }
    });

    var videoUrl = $("#js_ytb_url").val();
    $("#ytb_btn").click(function () {
        $('#ytb_video').html('<iframe width="100%" height="350" src="' + videoUrl + '"></iframe>');
        $("#js_popup_ytb").css('display', 'flex');
        $('body').addClass('js_popup_active');
    });

    $(document).on('click', '.js_ytb_popup_close', function () {
        var iframes = $(".iframe_content iframe");
        var ifurl = $(".iframe_content iframe").attr('src');
        iframes.attr('src', ifurl);

        $("#js_popup_ytb").css('display', 'none');
        $('body').removeClass('js_popup_active');
    });

    /*Exchange*/
    $(document).on("click", '.exchangeable_point', function () {
        $("#js_popup_exchanger_active").css('display', 'flex');
        document.getElementById("js_animate").scrollIntoView(false);
        $('body').addClass('js_popup_active');
    });

    $(document).on("click", '.js_open_app_popup', function () {

        if (Promotions.AppPoints == 0) {
            $(".js_gift_block img").addClass("disabled")
        }
        if (Promotions.ShakeCount == 0) {
            $(".js_dice_block img").addClass("disabled")
        }

        $('.ds_info').show();
        $('.ds_popup_title').removeClass('dis_none');
        $('.ds_qr').hide();
        $('.js_qrTitle').addClass('dis_none');
        $("#app_open_popup").css('display', 'flex');
        document.getElementById("js_animate").scrollIntoView(false);
        $('body').addClass('js_popup_active');
    });

    $(document).on('click', '#js_exchange_popup_close', function () {
        $("#js_popup_exchanger_active").css('display', 'none');
        $('body').removeClass('js_popup_active');
    });
    function ExchangePoints(wheelPoint) {
        $.ajax({
            type: "POST",
            url: "/PromotionV1/ExchangePoints",
            data: { PromotionId: Promotions.promotionId, EntryId: Promotions.activeClientEntryId, WheelPoints: wheelPoint, DeviceType: Promotions.deviceTypeGivePrize },
            success: function (result) {
                if (result.Success == true) {
                    var FwTotalPoints = 0;
                    var SwTotalPoints = 0;

                    for (var i = 0; i < result.ClosedPeriods.length; i++) {

                        if (result.ClosedPeriods[i].EntryId == Promotions.activeClientEntryId) {
                            FwTotalPoints = result.ClosedPeriods[i].TotalPoints;
                            Promotions.ClientActiveEntry = FwTotalPoints;
                        }

                        if (result.ClosedPeriods[i].EntryId == Promotions.SecondActiveEntryId) {
                            SwTotalPoints = result.ClosedPeriods[i].TotalPoints;
                            Promotions.ClientActiveWheelEntry = SwTotalPoints;
                        }
                    }

                    if (result.FwTotalPoints / Promotions.exchangeRate < 1) {
                        $(".exchange_count").css('display', 'none');
                    } else {
                        $(".js_exchange_popup").text(Math.trunc(FwTotalPoints / Promotions.exchangeRate));
                    }

                    if (!$("#spinnerCont").hasClass("js_bonus_activation")) {
                        $("#js_tab_first_spinCount").text(FwTotalPoints);
                        $(".js_availableSpins").text(FwTotalPoints);
                    }

                    if (!$("#wheelcontent").hasClass("js_bonus_activation")) {
                        $("#js_tab_second_spinCount").text(SwTotalPoints);
                        $(".js_availableSpins2").text(SwTotalPoints);
                        $("#js_tab_second_spinCount").text(SwTotalPoints);
                    }
                    $(".js_totoalPoints").text(FwTotalPoints);
                    if (SwTotalPoints > 0) {
                        if (!$("#spinnerCont").hasClass("js_bonus_activation")) {
                            $("#wheel__spinBtn2").removeClass("disabled");
                            $(".js_availableSpins2").removeClass("dis_none");
                            $("#js_tab_second_spinCount").removeClass("dis_none");
                            $("#js_sw_auto_spin2").removeClass("disabled");
                            $("#js_sw_stop_auto_spin2").removeClass("disabled");
                            $("#js_sw_turboSpin2").removeClass("disabled");
                            $("#js_sw_auto_spin2").css('display', 'block');
                            $("#js_stop_auto_spin2").css('display', 'none');
                        }
                    }
                    if (FwTotalPoints <= 0) {
                        $("#wheel__spinBtn").removeClass("disabled");
                        $(".js_availableSpins").removeClass("dis_none");
                        $("#js_tab_first_spinCount").removeClass("dis_none");
                        $("#js_sw_stop_auto_spin").removeClass("disabled");
                        $("#js_sw_turboSpin").removeClass("disabled");
                        $("#js_auto_spin").css('display', 'flex');
                        $("#js_stop_auto_spin").css('display', 'none');
                        $(".js_exchange_btn").addClass("disabled");
                        $(".js_exchange_popup").addClass('dis_none');
                    } else if (FwTotalPoints < Promotions.exchangeRate) {
                        $(".js_exchange_btn").addClass("disabled");
                        $(".js_exchange_popup").addClass('dis_none');
                        $(".js_plus_btn").addClass("disabled");
                        $(".js_minus_btn").addClass("disabled");
                    } else if (FwTotalPoints < 2 * Promotions.exchangeRate) {
                        $(".js_plus_btn").addClass("disabled");
                        $(".js_minus_btn").addClass("disabled");
                    }
                    $('.js_exchange_rate').text(Promotions.exchangeRate);
                    $('.js_exchange_result').text("1");
                    $('.js_minus_btn').addClass("disabled");

                } else {
                    $('#js_popup_exchanger_active').css('display', 'none');
                    setPopupErrText(result.Message);
                }
            },
        });
    }



    $(document).on('click', '.js_plus_btn', function () {
        let result = Number(Promotions.exchangeRate) + Number($('.js_exchange_rate')[0].textContent);
        let exchangeResult = $('.js_exchange_result')[0].textContent;
        exchangeResult++;
        $('.js_exchange_rate').text(result);
        $('.js_exchange_result').text(exchangeResult);
        if (Number(Promotions.ClientActiveEntry - result) < Promotions.exchangeRate) {
            $('.js_plus_btn').addClass('disabled');
        }
        if (exchangeResult > 1) {
            $('.js_minus_btn').removeClass('disabled');
        }
    });


    $(document).on('click', '.js_prize_exchange_popup_confirm', function () {

        ClosePopup();
        let prizeType = $(this).closest('.spinner_popup').find('input:checked').val();
        let PrizeWinnerId = $(this).closest('.spinner_popup').find('.PrizeWinnerId').val();
        let ExchangeId = $(this).closest('.spinner_popup').find('.ExchangeId').val();

        if (typeof prizeType == "undefined") {
            alert('Select type');
        } else {
            CollectBigPrize(prizeType, PrizeWinnerId, ExchangeId);
        }

    });

    $(document).on('click', '.widget_box_btn', function () {
        let popupId = $(this).attr('data-widgetId');
        $("#js_wdg_exchange_" + popupId).css('display', 'flex');
        document.getElementById("js_animate").scrollIntoView(false);
        $('body').addClass('js_popup_active');

    });


    function CollectBigPrize(prizeType, PrizeWinnerId, ExchangeId) {

        if (CollectBigPrize_inProgress) {
            return;
        }

        $(".js_prize_exchange_popup").css('display', 'none');
        $('body').removeClass('js_popup_active');

        CollectBigPrize_inProgress = true;

        /* $('#js_totoMoto_exchange').hide();*/

        $.ajax({
            type: "POST",
            url: "/PromotionV1/ExchangePrize",
            data: { PromotionId: Promotions.promotionId, PrizeWinnerId: PrizeWinnerId, Type: prizeType },
            success: function (result) {
                if (result.Success == true) {
                    $('#wdg_' + ExchangeId + ' a.widget_box_btn').hide();
                } else {
                    $('#wdg_' + ExchangeId + ' a.widget_box_btn').hide();
                }

                CollectBigPrize_inProgress = false;
            },
        });

    }


    $(document).on('click', '.js_minus_btn', function () {
        let result = Number($('.js_exchange_rate')[0].textContent) - Number(Promotions.exchangeRate);
        let exchangeResult = $('.js_exchange_result')[0].textContent;
        exchangeResult--;
        $('.js_exchange_rate').text(result);
        $('.js_exchange_result').text(exchangeResult);
        if (result == Promotions.exchangeRate) {
            $('.js_minus_btn').addClass('disabled');
        }
        if (exchangeResult => 1) {
            $('.js_plus_btn').removeClass('disabled');
        }
    });

    $(document).on('click', '.js_exchange_btn ', function () {
        let wheelPoint = $('.js_exchange_result')[0].textContent;
        $("#js_popup_exchanger_active").css('display', 'none');
        ExchangePoints(wheelPoint)
        $('body').removeClass('js_popup_active')
    });

    $(document).on('click', '.js_verification ', function () {
        if (Promotions.isMobileView) {
            var url = Promotions.profileurl;
            window.location.href = url;
        } else {
            $(".profileDialog").first().click();
        }
    });

    $('.js_close_buy_bonus').click(function () {
        $('#buy_bonus_popup').hide();
        //    $('body').removeClass('ofh');
        $('body').removeClass('js_popup_active');
    });

    $('.js_close_app_popup').click(function () {
        $('#app_open_popup').hide();
        //    $('body').removeClass('ofh');
        $('body').removeClass('js_popup_active');
        $('.ds_info').show();
        $('.ds_popup_title').removeClass('dis_none');
        $('.ds_qr').hide();
        $('.js_qrTitle').addClass('dis_none');

        setCookieHours("appGifPopup", "cookieValue", 4);
    });

    $(document).on('click', '.js_sw_spin_btn_popup', function () {
        ClosePopup();
        if (typeof swiper2 != "undefined") {
            if (!$(".swiper-wrapper .swiper-slide:nth-child(2)").hasClass('active')) {
                swiper2.slideTo(1, 1, true);
            }
        }
       
        $("#js_popup_exchanger_active").css('display', 'none');
        $("#wheel__spinBtn2").trigger("click");

    });

    $(document).on('click', '.js_sw_spin_btn_popup2', function () {
        ClosePopup();
        if (typeof swiper2 != "undefined") {
            if (!$(".swiper-wrapper .swiper-slide:nth-child(1)").hasClass('active')) {
                swiper2.slideTo(0, 1, true);
            }
        }
        
        $("#js_popup_exchanger_active").css('display', 'none');
        $("#wheel__spinBtn").trigger("click");

    });

    $(document).on('click', '.js_fw_spin_btn_popup', function () {
        ClosePopup();
        $("#wheel__spinBtn").trigger("click");
    });

    $(document).on('click', '#js_deposit', function () {
        ClosePopup();
        $('#buy_bonus_popup').hide();
    });

    $(document).on('click', '.js_auto_spin_popup', function () {
        ClosePopup();
        $("#js_sw_auto_spin").trigger("click");
    });

    /*DynamicBonus*/
    $(document).on('click', '#js_open_exchange_11:not(".disabled")', function () {
     
        /*        $("#js_bonus_infoUpdate_spin").text())));*/
        //var amount = new Intl.NumberFormat('en-US').format($("#js_bonus_infoUpdate_spin").text());
        var amount = $("#js_bonus_infoUpdate_spin").text().replaceAll(' ', '').replaceAll(',', '');
        $("#js_bonus_infoUpdate_spin").text(setAmountFormat(amount.replaceAll(' ', '').replaceAll(',', '')));     
        let bonusImg = $(this).find('img').attr('src');
        $(".js_img_spin").attr('src', bonusImg);

        $('#spin_exchange_popup').show();
        $('body').addClass('js_popup_active');
        document.getElementById("js_animate").scrollIntoView(false);
        $('.spin_exchange_select_games').empty();
        $(".spin_exchange_heading").show();
        $(".spin_exchange_content").show();

        if (parseInt($("#js_freeSpin_11").text()) != 0) {

            $("#js_spin_exchange_number").text(setAmountFormat(amount.replaceAll(' ', '').replaceAll(',', '')));
            $('#js_spin_minus').removeClass('disabled');
            $('#js_spin_plus').addClass('disabled');

        } else {

            $('#js_spin_minus').addClass('disabled');
            $('#js_spin_plus').addClass('disabled');
        }

        if (prizeClicked) {
            return
        }
        prizeClicked = true;
        $.ajax({
            type: "POST",
            url: "/PromotionV1/GetPromotionDynamicFreeSpinBonuses",
            data: { PromotionId: Promotions.promotionId, PromotionEntryId: Promotions.activeClientEntryId },
            success: function (result) {
                var html = '';
                let DynamicFreeSpin = parseFloat((document.getElementById('js_bonus_infoUpdate_spin').innerText).replaceAll(' ', '').replaceAll(',', ''));   
                let FreeSpinCount = 0;
                let gameviewstatus = "";
                let checked = "";
                let k = 0;
                let FreSpineCountNumber = 0;
                let FreeSpinText = "";
                for (var i = 0; i < result.length; i++) {
                    FreeSpinText = "";
                    let MinBetAmount = result[i].Amount;
                    checked = "";
                    gameviewstatus = "";

                    if (DynamicFreeSpin / MinBetAmount >= 1) {
                        if (k == 0) {
                            k++;
                            checked = `checked = "checked"`;
                        }
                        FreSpineCountNumber = parseInt(DynamicFreeSpin / MinBetAmount);
                        if (FreSpineCountNumber > parseInt(Promotions.MaxBonusSpinCount)) {
                            FreSpineCountNumber = parseInt(Promotions.MaxBonusSpinCount);
                        }
                        FreeSpinCount = `<span class="FreeSpinCount">` + FreSpineCountNumber + `</span>`;

                    } else {
                        gameviewstatus = "disabled";
                        FreeSpinCount = `<span class="FreeSpinCount">0</span>`;
                    }
                    FreeSpinText = Promotions.FreeSpinAmount;
                    FreeSpinText = FreeSpinText.replace("#{Amount}", result[i].Amount);
                    FreeSpinText = FreeSpinText.replace("#{Currency}", Promotions.currency);
                    if (result[i].State != GameStatus.Maintenance) {

                        html +=
                            '<div class="spin_exchange_game_item ' + gameviewstatus + '">' +
                            '<label class="select_game_radio" ><input type="radio" ' + checked + '  name="selectGamespin" value="' + result[i].Id + '" data-role="none" data-amount = "' + result[i].Amount + '" data-url = "' + result[i].Url + '" /><div class="select_game-box"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                            '<path d = "M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill = "var(--spin-game-selected-icon-color)" /></svg><span class="select_game-name">' + result[i].ProductName + '</span></div>' +
                            '<img src ="' + result[i].ImageUrl + '" alt="game_img" /></label >' +
                            '<p class="select_games_text">' + FreeSpinCount + " " + FreeSpinText + ' </p></div>';

                    }
                    else {
                        html +=
                            '<div class="spin_exchange_game_item disabled maintenance">' +
                            '<label class="select_game_radio" ><input type="radio" name="selectGamespin" value="' + result[i].Id + '" data-role="none" data-amount = "0" /><div class="select_game-box"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                            '<path d = "M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill = "var(--spin-game-selected-icon-color)" /></svg><span class="select_game-name">' + result[i].ProductName + '</span></div>' +
                            '<img src ="' + result[i].ImageUrl + '" alt="game_img" /></label >' +
                            '<p class="select_games_text">' + "notavailable" + '</p></div>';
                    }
                }

                $('.spin_exchange_select_games').append(html);
                $("#js_treasury").addClass("js_popup_opened");
                $('body').addClass('js_popup_active');
                document.getElementById("js_treasury").scrollIntoView(false);

                prizeClicked = false;
            }
        })
    })

    /*Betongames exchange functionality*/
    $(document).on('click', '#js_open_exchange_15:not(".disabled")', function () {
        
        //$("#js_bonus_infoUpdate_betongames").text(($("#js_bonus_infoUpdate_betongames").text()).replace(",", ".").replace("/", "."));
        //$("#js_betongames_exchange_number").text(($("#js_betongames_exchange_number").text()).replace(",", ".").replace("/", "."));


        var amount = $("#js_bonus_infoUpdate_betongames").text().replaceAll(' ', '').replaceAll(',', '');
        $("#js_bonus_infoUpdate_betongames").text(setAmountFormat(amount.replaceAll(' ', '').replaceAll(',', '')));     

        let bonusImg = $(this).find('img').attr('src');
        $(".js_img_spin").attr('src', bonusImg);

        if (!$('#js_open_betongames_exchange').hasClass('disable')) {

            if (parseInt($("#js_bog_15").text()) != 0) {

                $("#js_betongames_exchange_number").text(setAmountFormat(amount.replaceAll(' ', '').replaceAll(',', '')));
                $('#js_betongames_minus').removeClass('disabled');
                $('#js_betongames_plus').addClass('disabled');

            } else {

                $('#js_betongames_minus').addClass('disabled');
                $('#js_betongames_plus').addClass('disabled');
            }
            $('#betongames_exchange_popup').show();
            $('body').addClass('js_popup_active');
            document.getElementById("js_animate").scrollIntoView(false);
        }

        $('.betongames_exchange_select_games').empty();
        $(".betongames_exchange_heading").show();
        $(".betongames_exchange_content").show();

        if (prizeClicked) {
            return
        }
        prizeClicked = true;
        $.ajax({
            type: "POST",
            url: "/PromotionV1/GetPromotionDynamicBOGBonuses",
            data: { PromotionId: Promotions.promotionId, PromotionEntryId: Promotions.activeClientEntryId },
            success: function (result) {
                var html = '';
                let DynamicBogSpin = parseFloat((document.getElementById('js_bonus_infoUpdate_betongames').innerText).replaceAll(' ', '').replaceAll(',', ''));
                let BogSpinCount = 0;
                let gameviewstatus = "";
                let checked = "";
                let k = 0;
                let FreSpineCountNumber = 0;
                let FreeBetText = "";
                for (var i = 0; i < result.length; i++) {

                    let MinBetAmount = result[i].Amount;
                    checked = "";
                    gameviewstatus = "";

                    if (DynamicBogSpin / MinBetAmount >= 1) {
                        if (k == 0) {
                            k++;
                            checked = `checked = "checked"`;
                        }
                        FreSpineCountNumber = parseInt(DynamicBogSpin / MinBetAmount);

                        BogSpinCount = `<span class="FreeSpinCount">` + FreSpineCountNumber + `</span>`;

                    } else {
                        gameviewstatus = "disabled";
                        BogSpinCount = `<span class="FreeSpinCount">0</span>`;
                    }

                    FreeBetText = Promotions.FreeBetAmount;
                    FreeBetText = FreeBetText.replace("#{Amount}", result[i].Amount);
                    FreeBetText = FreeBetText.replace("#{Currency}", Promotions.currency);

                    if (result[i].State != GameStatus.Maintenance) {

                        html +=
                            '<div class="betongames_exchange_game_item ' + gameviewstatus + '">' +
                            '<label class="select_game_radio" ><input type="radio" ' + checked + '  name="selectGamebetongames" value="' + result[i].Id + '" data-role="none" data-amount = "' + result[i].Amount + '"data-freespintypeid = "' + result[i].FreeSpinTypeId + '" data-url = "' + result[i].Url + '" /><div class="select_game-box"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                            '<path d = "M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill = "var(--spin-game-selected-icon-color)" /></svg><span class="select_game-name">' + result[i].ProductName + '</span></div>' +
                            '<img src ="' + result[i].ImageUrl + '" alt="game_img" /></label >' +
                            '<p class="select_games_text">' + BogSpinCount + ' ' + " " + FreeBetText + ' </p></div>';

                    }
                    else {
                        html +=
                            '<div class="betongames_exchange_game_item disabled maintenance">' +
                            '<label class="select_game_radio" ><input type="radio" name="selectGamebetongames" value="' + result[i].Id + '"data-freespintypeid = "' + result[i].FreeSpinTypeId + '" data-role="none" data-amount = "0" /><div class="select_game-box"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                            '<path d = "M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill = "var(--spin-game-selected-icon-color)" /></svg><span class="select_game-name">' + result[i].ProductName + '</span></div>' +
                            '<img src ="' + result[i].ImageUrl + '" alt="game_img" /></label >' +
                            '<p class="select_games_text">' + "notavailable" + '</p></div>';
                    }
                }

                $('.betongames_exchange_select_games').append(html);
                $("#js_treasury").addClass("js_popup_opened");
                $('body').addClass('js_popup_active');
                document.getElementById("js_treasury").scrollIntoView(false);

                prizeClicked = false;
            }
        })

    })

    /*wanger exchange functionality*/
    $(document).on('click', '#js_open_exchange_14:not(".disabled")', function () {
        //$("#js_bonus_infoUpdate_wager").text(($("#js_bonus_infoUpdate_wager").text()).replace(",", ".").replace("/", "."));
        //$("#js_wager_number").text(($("#js_wager_number").text()).replace(",", ".").replace("/", "."));
        
        var amount = $("#js_bonus_infoUpdate_wager").text().replaceAll(' ', '').replaceAll(',', '');
        $("#js_bonus_infoUpdate_wager").text(setAmountFormat(amount.replaceAll(' ', '').replaceAll(',', '')));     
        $("#js_wager_number").text(setAmountFormat(amount.replaceAll(' ', '').replaceAll(',', '')));     
        let bonusImg = $(this).find('img').attr('src');
        $("#wager_popup .js_img_spin").attr('src', bonusImg);
        var decrease = parseFloat(Promotions.dynamicBonusCasinoAmount);

        if (!$('#js_open_wager_popup').hasClass('disabled')) {

            if (parseInt($("#wager_block_amount").text()) < decrease) {
                $("#js_wager_number").text(setAmountFormat(($("#js_wager_14").text()).replaceAll(' ', '').replaceAll(',', '')));
                var decrease = parseFloat(Promotions.dynamicBonusCasinoAmount);   
                if (parseFloat($("#js_wager_14").text()) > decrease) {
                    $('#js_minus_wager').removeClass('disabled');
                }
             
            }

            $('#wager_popup').show();
            $('body').addClass('js_popup_active');
            document.getElementById("js_animate").scrollIntoView(false);

        }

        $('.wager_game_item').empty();

        wager_exchang = parseInt((document.getElementById('js_bonus_infoUpdate_wager').innerText).replaceAll(' ', '').replaceAll(',', ''));
        max_wager_exchang = parseInt((document.getElementById('js_bonus_infoUpdate_wager').innerText).replaceAll(' ', '').replaceAll(',', ''));
        
        if (wager_exchang == 0) {
            document.getElementById("js_plus_wager").classList.add("disabled");
            document.getElementById("js_minus_wager").classList.add("disabled");        
        } else {
            document.getElementById("js_plus_wager").classList.add("disabled");
            
            var decrease = 1;
            decrease = parseFloat(Promotions.dynamicBonusCasinoAmount);
            if (wager_exchang > decrease) {
                $('#js_minus_wager').removeClass('disabled');
            } else {
                $('#js_minus_wager').addClass('disabled');
            }  
        }

        if (prizeClicked) {
            return
        }
        prizeClicked = true;
        $.ajax({
            type: "POST",
            url: "/PromotionV1/GetPromotionDynamicCasinoWagerBonuses",
            data: { PromotionId: Promotions.promotionId, PromotionEntryId: Promotions.activeClientEntryId },
            success: function (result) {

                $('.confirm_wager').removeClass('disabled');
                var htmlWager = '';
                var className = '';
                var classchecked = '';
                let ClientEvrntSelectedAmount = parseInt(($('#js_wager_exchange_number').text()).replaceAll(' ', '').replaceAll(',', ''));

                for (var i = 0; i < result.length; i++) {

                    className = '';
                    classchecked = '';
                    if (result[i].State == 3) {
                        className += " disabled maintenance";
                        $('.confirm_wager').addClass('disabled');
                    } else if (ClientEvrntSelectedAmount == 0) {
                        className = 'disabled';
                    }

                    if (result.length == 1) {
                        $("#wager_popup .spinner_popup").addClass('one_item');
                    }

                    var BonusDescriptionsList = result[i].BonusDescriptions;
                    var CasinoDynamicWagerTitle = "";

                    for (var j = 0; j < BonusDescriptionsList.length; j++) {
                        switch (BonusDescriptionsList[j].LanguageId) {
                            case lang:
                                CasinoDynamicWagerTitle = BonusDescriptionsList[j].BonusName;
                                break;
                        }
                    }
                    if (i == 0) {
                        classchecked = 'checked';
                    }

                    let periodInfo = "";

                    if ((parseInt(result[i].Period)) % 24 == 0) {
                        periodInfo = (parseInt(result[i].Period)) / 24 + ' ' + Promotions.Day;
                    } else {
                        if (parseInt((parseInt(result[i].Period)) / 24) > 0) {
                            periodInfo = parseInt((parseInt(result[i].Period)) / 24) + ' ' + Promotions.Day + ' ' + (parseInt(result[i].Period) - parseInt((parseInt(result[i].Period)) / 24) * 24) + ' ' + Promotions.hour;
                        } else {
                            periodInfo = (parseInt(result[i].Period) - parseInt((parseInt(result[i].Period)) / 24) * 24) + ' ' + Promotions.hour;
                        }

                    }

                    htmlWager += '<label class="wager_game_radio ' + className + ' ' + classchecked + ' ">';
                    htmlWager += '<input type = "radio" data-role="none" name = "coefficientSelect" value=' + result[i].Id + ' ' + classchecked + '>';
                    htmlWager += '<span class="radio_icon ">';
                    htmlWager += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">';
                    htmlWager += '<path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12ZM4 12C4 16.4 7.6 20 12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4C7.6 4 4 7.6 4 12Z" fill = "var(--spin-game-empty-bg-color)" />';
                    htmlWager += '<path class="path-check" d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="var(--spin-game-selected-icon-color)" />';
                    htmlWager += '</svg>';

                    htmlWager += '</span>';
                    htmlWager += '<span class="wager_item">';
                    htmlWager += '<span class="d-block wager_game--bet">';
                    htmlWager += '<span><strong>' + CasinoDynamicWagerTitle + '  </strong></span></span>';
                    htmlWager += '<span class="d-block wager_game--info">';
                    htmlWager += '<span class="d-flex wager_game--item">';
                    htmlWager += '<span>' + Promotions.NumberOfWagering + ' </span>';
                    htmlWager += '<span class="wager_number">' + result[i].WageringTurnoverFactor + '  </span></span>';

                    htmlWager += '<span class="d-flex wager_game--item">';
                    htmlWager += '<span>' + Promotions.ActivationPeriod + ' </span>';
                    htmlWager += '<span class="wager_number">' + periodInfo + '</span></span></span></span></label >';

                }

                $('.wager_game_item').empty();
                $('.wager_game_item').append(htmlWager);
                $("#js_treasury").addClass("js_popup_opened");
                document.getElementById("js_treasury").scrollIntoView(false);

                prizeClicked = false;
            }
        })

    })

    /*    Sportexchange start*/
    $(document).on('click', '#js_open_exchange_13:not(".disabled")', function () {
     //   $("#js_bonus_infoUpdate_sportBet").text(($("#js_bonus_infoUpdate_sportBet").text()).replace(",", ".").replace("/", "."));
//$("#js_sportBet_exchange_number").text(($("#js_sportBet_exchange_number").text()).replace(",", ".").replace("/", "."));

        var amount = $("#js_bonus_infoUpdate_sportBet").text().replaceAll(' ', '').replaceAll(',', '');
        $("#js_bonus_infoUpdate_sportBet").text(setAmountFormat(amount.replaceAll(' ', '').replaceAll(',', '')));     
        $("#js_sportBet_exchange_number").text(setAmountFormat(amount.replaceAll(' ', '').replaceAll(',', '')));     
        let bonusImg = $(this).find('img').attr('src');
        $("#sportBet_popup .js_img_spin").attr('src', bonusImg);
        var decrease = 1;

        decrease = parseFloat(Promotions.dynamicBonusSportAmount);

        $('.spin_exchange_select_games').empty();
        $(".spin_exchange_heading").show();
        $(".spin_exchange_content").show();

        sportBet_exchang = parseFloat((document.getElementById('js_sportBet_exchange_number').innerText).replaceAll(' ', '').replaceAll(',', ''));
        max_sportBet_exchang = parseFloat((document.getElementById('js_bonus_infoUpdate_sportBet').innerText).replaceAll(' ', '').replaceAll(',', ''));

        if (sportBet_exchang < decrease) {
            document.getElementById("js_plus_sport").classList.add("disabled");
            document.getElementById("js_minus_sport").classList.add("disabled");
        } else {
            document.getElementById("js_plus_sport").classList.add("disabled");

            var decrease = 1;
            decrease = parseFloat(Promotions.dynamicBonusSportAmount);
            if (sportBet_exchang > decrease) {
                $('#js_minus_sport').removeClass('disabled');
            } else {
                $('#js_minus_sport').addClass('disabled');
            }          
        }

        if (prizeClicked) {
            return
        }
        prizeClicked = true;
        $.ajax({
            type: "POST",
            url: "/PromotionV1/GetPromotionDynamicSportBetBonuses",
            data: { PromotionId: Promotions.promotionId, PromotionEntryId: Promotions.activeClientEntryId },
            success: function (result) {
                var htmlSport = '';
                var className = '';
                var classchecked = '';
                let ClientEvrntSelectedAmount = parseInt(($('#js_sportBet_exchange_number').text()).replaceAll(' ', '').replaceAll(',', ''));
                if (ClientEvrntSelectedAmount == 0) {
                    className = 'disabled';
                }
                for (var i = 0; i < result.length; i++) {
                    classchecked = '';
                    if (i == 0) {
                        classchecked = 'checked';
                    }

                    if (result.length == 1) {
                        $("#sportBet_popup .spinner_popup").addClass('one_item');
                    }


                    let periodInfo = "";

                    if ((parseInt(result[i].Period)) % 24 == 0) {
                        periodInfo = (parseInt(result[i].Period)) / 24 + ' ' + Promotions.Day;
                    } else {
                        if (parseInt((parseInt(result[i].Period)) / 24) > 0) {
                            periodInfo = parseInt((parseInt(result[i].Period)) / 24) + ' ' + Promotions.Day + ' ' + (parseInt(result[i].Period) - parseInt((parseInt(result[i].Period)) / 24) * 24) + ' ' + Promotions.hour;
                        } else {
                            periodInfo = (parseInt(result[i].Period) - parseInt((parseInt(result[i].Period)) / 24) * 24) + ' ' + Promotions.hour;
                        }

                    }

                    htmlSport += '<label class="sportBet_game_radio ' + className + ' ' + classchecked + '">';
                    htmlSport += '<input type = "radio" data-role="none" name = "coefficientSelect" value = ' + result[i].Id + ' ' + classchecked + '>';
                    htmlSport += '<span class="radio_icon">';
                    htmlSport += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">';
                    htmlSport += '<path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12ZM4 12C4 16.4 7.6 20 12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4C7.6 4 4 7.6 4 12Z" fill = "var(--spin-game-empty-bg-color)" />';
                    htmlSport += '<path class="path-check" d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="var(--spin-game-selected-icon-color)" />';
                    htmlSport += '</svg>';
                    htmlSport += '</span>';
                    htmlSport += '<span class="sportBet_item">';

                    if (result[i].AllowedBetTypeId == 1) {//OnlySingleAndMulti                  
                        htmlSport += ' <span class="d-block sportBet_game--bet"><span><strong>' + Promotions.Single + ' </strong>' + '' + '</span>';
                        if (result[i].IsOneTimeBet) {
                            htmlSport += '<span class="d-block sportBet_game--txt">' + Promotions.Partialdraw + '</span > </span > ';
                        } else {
                            htmlSport += '<span class="d-block sportBet_game--txt">' + Promotions.Totaldraw + '</span> </span > ';
                        }

                        htmlSport += '<span class="d-block sportBet_game--info"><span class="d-flex sportBet_game--item"><span>' + Promotions.Minimumodd + '</span><span class="sportBet_number">' + result[i].MinOdd + '</span></span>';
                    } else if (result[i].AllowedBetTypeId == 2) { //OnlySingle 
                        htmlSport += '<span class="d-block sportBet_game--bet"><span><strong>' + Promotions.Single + '</strong > ' + '' + '</span > ';
                        htmlSport += '<span class="d-block sportBet_game--txt">' + Promotions.Partialdraw + '</span> </span > ';
                        htmlSport += '<span class="d-block sportBet_game--info"><span class="d-flex sportBet_game--item"><span>' + Promotions.Minimumodd + '</span><span class="sportBet_number">' + result[i].MinOdd + '</span></span>';
                    } else { //OnlyMulti 
                        htmlSport += ' <span class="d-block sportBet_game--bet"><span><strong>' + Promotions.Express + '</strong> ' + '' + '</span>';
                        htmlSport += '<span class="d-block sportBet_game--txt">' + Promotions.Partialdraw + '</span> </span > ';

                        if (result[i].ExpressOdd == 1) {
                            htmlSport += '<span class="d-block sportBet_game--info"><span class="d-flex sportBet_game--item"><span>' + 'oddTypeTotal' + '</span><span class="sportBet_number">' + result[i].MinOdd + '</span></span>';
                        } else {
                            htmlSport += '<span class="d-block sportBet_game--info"><span class="d-flex sportBet_game--item"><span>' + 'oddTypeEach' + '</span><span class="sportBet_number">' + result[i].MinOdd + '</span></span>';
                        }
                    }

                    if (result[i].AllowedBetTypeId == 3) {
                        htmlSport += '<span class="d-flex sportBet_game--item"><span>' + Promotions.eventsNumber + '</span><span class="sportBet_number">' + result[i].Round + '</span></span>';
                    }

                    htmlSport += '<span class="d-flex sportBet_game--item"><span>' + Promotions.ActiveDate + '</span><span class="sportBet_number">' + periodInfo + '</span ></span ></span ></span ></label > ';


                }
                $('#sportBet_popup').show();
                $("#js_treasury").addClass("js_popup_opened");
                document.getElementById("js_treasury").scrollIntoView(false);
                $('body').addClass('js_popup_active');
                $('.sportBet_game_item').empty();
                $('.sportBet_game_item').append(htmlSport);

                prizeClicked = false;
            }
        })

    })



    $(document).on('click', '#js_open_exchange_24:not(".disabled")', function () {
        //$("#js_bonus_infoUpdate_sport_wager").text(($("#js_bonus_infoUpdate_sport_wager").text()).replace(",", ".").replace("/", "."));
        //$("#sportWager_popup #js_sportWager_exchange_number").text(($("#sportWager_popup #js_sportWager_exchange_number").text()).replace(",", ".").replace("/", "."));
        var amount = $("#js_bonus_infoUpdate_sport_wager").text();
        $("#js_bonus_infoUpdate_sport_wager").text(setAmountFormat(amount.replaceAll(' ', '').replaceAll(',', '')));
        $("##sportWager_popup #js_sportWager_exchange_number").text(setAmountFormat(amount.replaceAll(' ', '').replaceAll(',', '')));     

        let bonusImg = $(this).find('img').attr('src');
        $("#sportWager_popup .js_img_spin").attr('src', bonusImg);

        $('#sportWager_popup .spin_exchange_select_games').empty();
        $("#sportWager_popup .spin_exchange_heading").show();
        $("#sportWager_popup .spin_exchange_content").show();

        sportBet_exchang = parseInt(($("#sportWager_popup #js_sportWager_exchange_number").text()).replaceAll(' ', '').replaceAll(',', ''));
        max_sportBet_exchang = parseInt(($("#sportWager_popup #js_bonus_infoUpdate_sport_wager").text()).replaceAll(' ', '').replaceAll(',', ''));

        if (sportBet_exchang == 0) {
            document.getElementById("js_plus_SportWager").classList.add("disabled");
            document.getElementById("js_minus_SportWager").classList.add("disabled");
        } else {
            document.getElementById("js_plus_SportWager").classList.add("disabled");
            $('#js_minus_SportWager').removeClass('disabled');
        }

        if (prizeClicked) {
            return
        }
        prizeClicked = true;
        $.ajax({
            type: "POST",
            url: "/PromotionV1/GetPromotionDynamicSportwagerBonuses",
            data: { PromotionId: Promotions.promotionId, PromotionEntryId: Promotions.activeClientEntryId },
            success: function (result) {
                var htmlSport = '';
                var className = '';
                var classchecked = '';
                let ClientEvrntSelectedAmount = parseInt(($('#js_sportWager_exchange_number').text()).replaceAll(' ', '').replaceAll(',', ''));
                if (ClientEvrntSelectedAmount == 0) {
                    className = 'disabled';
                }
                for (var i = 0; i < result.length; i++) {
                    classchecked = '';
                    if (i == 0) {
                        classchecked = 'checked';
                    }

                    if (result.length == 1) {
                        $("#sportWager_popup .spinner_popup").addClass('one_item');
                    }


                    let periodInfo = "";

                    if ((parseInt(result[i].Period)) % 24 == 0) {
                        periodInfo = (parseInt(result[i].Period)) / 24 + ' ' + Promotions.Day;
                    } else {
                        if (parseInt((parseInt(result[i].Period)) / 24) > 0) {
                            periodInfo = parseInt((parseInt(result[i].Period)) / 24) + ' ' + Promotions.Day + ' ' + (parseInt(result[i].Period) - parseInt((parseInt(result[i].Period)) / 24) * 24) + ' ' + Promotions.hour;
                        } else {
                            periodInfo = (parseInt(result[i].Period) - parseInt((parseInt(result[i].Period)) / 24) * 24) + ' ' + Promotions.hour;
                        }

                    }

                    htmlSport += '<label class="sportWager_game_radio ' + className + ' ' + classchecked + '">';
                    htmlSport += '<input type = "radio" data-role="none" name = "coefficientSelect" value = ' + result[i].Id + ' ' + classchecked + '>';
                    htmlSport += '<span class="radio_icon">';
                    htmlSport += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">';
                    htmlSport += '<path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12ZM4 12C4 16.4 7.6 20 12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4C7.6 4 4 7.6 4 12Z" fill = "var(--spin-game-empty-bg-color)" />';
                    htmlSport += '<path class="path-check" d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="var(--spin-game-selected-icon-color)" />';
                    htmlSport += '</svg>';
                    htmlSport += '</span>';
                    htmlSport += '<span class="sportBet_item">';

                    if (result[i].AllowedBetTypeId == 1) {//OnlySingleAndMulti                  
                        htmlSport += ' <span class="d-block sportWager_game--bet"><span><strong>' + Promotions.Single + ' </strong>' + '' + '</span>';
                        if (result[i].IsOneTimeBet) {
                            htmlSport += '<span class="d-block sportWager_game--txt">' + Promotions.Partialdraw + '</span > </span > ';
                        } else {
                            htmlSport += '<span class="d-block sportWager_game--txt">' + Promotions.Totaldraw + '</span> </span > ';
                        }

                        htmlSport += '<span class="d-block sportWager_game--info"><span class="d-flex sportWager_game--item"><span>' + Promotions.Minimumodd + '</span><span class="sportBet_number">' + result[i].MinOdd + '</span></span>';
                    } else if (result[i].AllowedBetTypeId == 2) { //OnlySingle 
                        htmlSport += '<span class="d-block sportWager_game--bet"><span><strong>' + Promotions.Single + '</strong > ' + '' + '</span > ';
                        htmlSport += '<span class="d-block sportWager_game--txt">' + Promotions.Partialdraw + '</span> </span > ';
                        htmlSport += '<span class="d-block sportWager_game--info"><span class="d-flex sportWager_game--item"><span>' + Promotions.Minimumodd + '</span><span class="sportBet_number">' + result[i].MinOdd + '</span></span>';
                    } else { //OnlyMulti 
                        htmlSport += ' <span class="d-block sportWager_game--bet"><span><strong>' + Promotions.Express + '</strong> ' + '' + '</span>';
                        htmlSport += '<span class="d-block sportWager_game--txt">' + Promotions.Partialdraw + '</span> </span > ';

                        if (result[i].ExpressOdd == 1) {
                            htmlSport += '<span class="d-block sportWager_game--info"><span class="d-flex sportWager_game--item"><span>' + 'oddTypeTotal' + '</span><span class="sportBet_number">' + result[i].MinOdd + '</span></span>';
                        } else {
                            htmlSport += '<span class="d-block sportWager_game--info"><span class="d-flex sportWager_game--item"><span>' + 'oddTypeEach' + '</span><span class="sportBet_number">' + result[i].MinOdd + '</span></span>';
                        }
                    }

                    if (result[i].AllowedBetTypeId == 3) {
                        htmlSport += '<span class="d-flex sportWager_game--item"><span>' + Promotions.eventsNumber + '</span><span class="sportBet_number">' + result[i].Round + '</span></span>';
                    }

                    htmlSport += '<span class="d-flex sportWager_game--item"><span>' + Promotions.ActiveDate + '</span><span class="sportBet_number">' + periodInfo + '</span ></span ></span ></span ></label > ';


                }
                $('#sportWager_popup').show();
                $("#js_treasury").addClass("js_popup_opened");
                document.getElementById("js_treasury").scrollIntoView(false);
                $('body').addClass('js_popup_active');
                $('.sportWager_game_item').empty();
                $('.sportWager_game_item').append(htmlSport);

                prizeClicked = false;
            }
        })

    })

    $(document).on('click', '#spin_exchange_popup .select_game_radio', function () {
        let el = $(this);
        let MinBetAmount = parseFloat(el.find('input').data('amount'));
        let MaxExAmount = parseFloat(($("#js_bonus_infoUpdate_spin").text()).replaceAll(' ', '').replaceAll(',', ''));
        let currentAmount = parseFloat(($("#js_spin_exchange_number").text()).replaceAll(' ', '').replaceAll(',', ''));

        if ((currentAmount + MinBetAmount) <= MaxExAmount) {
            $('#js_spin_plus').removeClass('disabled');
        } else {
            $('#js_spin_plus').addClass('disabled');
        }

        if ((currentAmount - MinBetAmount) > MinBetAmount) {
            $('#js_spin_minus').removeClass('disabled');
        }

        if ((currentAmount - MinBetAmount) < MinBetAmount) {
            $('#js_spin_minus').addClass('disabled');
        }
    })

    $(document).on('click', '#betongames_exchange_popup .select_game_radio', function () {

        let el = $(this);
        let MinBetAmount = parseFloat(el.find('input').data('amount'));
        let MaxExAmount = parseFloat($("#js_bonus_infoUpdate_betongames").text());
        let currentAmount = parseFloat($("#js_betongames_exchange_number").text());

        if ((currentAmount + MinBetAmount) <= MaxExAmount) {
            $('#js_betongames_plus').removeClass('disabled');
        } else {
            $('#js_betongames_plus').addClass('disabled');
        }

        if ((currentAmount - MinBetAmount) > MinBetAmount) {
            $('#js_betongames_minus').removeClass('disabled');
        }

        if ((currentAmount - MinBetAmount) < MinBetAmount) {
            $('#js_betongames_minus').addClass('disabled');
        }
    })

    $('.js_spin_exchange_close').click(function () {
        $("#js_spin_exchange_number").text(setAmountFormat(($("#js_bonus_infoUpdate_spin").text()).replaceAll(' ', '').replaceAll(',', '')));
        $('#spin_exchange_popup').hide();
        $("#js_treasury").removeClass("js_popup_opened");
        $('body').removeClass('js_popup_active');

    })

    $('.js_bog_exchange_close').click(function () {
        $("#js_betongames_exchange_number").text($("#js_bonus_infoUpdate_betongames").text());
        $('#betongames_exchange_popup').hide();
        $("#js_treasury").removeClass("js_popup_opened");
        $('body').removeClass('js_popup_active');

    })

    $('.js_wager_exchange_close').click(function () {
        $("#js_wager_number").text($("#js_bonus_infoUpdate_wager").text());
        $('#wager_popup').hide();
        $("#js_treasury").removeClass("js_popup_opened");
        $('body').removeClass('js_popup_active');

    })

    $('.js_sport_exchange_close').click(function () {
        $("#js_sportBet_exchange_number").text($("#js_bonus_infoUpdate_sportBet").text());
        $('#sportBet_popup').hide();
        $("#js_treasury").removeClass("js_popup_opened");
        $('body').removeClass('js_popup_active');

    })
    $('.js_sport_wager_exchange_close').click(function () {
        $("#js_sportWager_exchange_number").text($("#js_bonus_infoUpdate_sport_wager").text());
        $('#sportWager_popup').hide();
        $("#js_treasury").removeClass("js_popup_opened");
        $('body').removeClass('js_popup_active');

    })

    $(document).on('click', '.js_shake_popup_close', function () {
        $("#js_popup_shake").css('display', 'none');
        $('body').removeClass('js_popup_active');

    });

    $(document).on('click', '.js_prize_exchange_popup_close', function () {
        $(this).closest('.popup_flex_box').css('display', 'none');
        $('body').removeClass('js_popup_active');

    });

    $(document).on("change", ".wager_select_games input[type = radio]", function () {
        $('.wager_select_games input[type = radio]').each(function () {
            $(this).closest('.wager_game_radio').removeClass('disabledWager');
            $(this).closest('.wager_game_radio').removeClass('checked');
            if (!$(this).is(":checked")) {
                $(this).closest('.wager_game_radio').addClass('disabledWager');
            } else {
                $("#js_wager_number").text(setAmountFormat(($("#js_bonus_infoUpdate_wager").text()).replaceAll(' ', '').replaceAll(',', '')));
                $("#js_plus_wager").addClass("disabled");
                let MaxExAmount = parseFloat($("#js_bonus_infoUpdate_wager").text());
                if (MaxExAmount > 0 && (MaxExAmount - parseFloat(Promotions.dynamicBonusCasinoAmount)) > 0) {
                    $('#js_minus_wager').removeClass('disabled');
                }
                $(this).closest('.wager_game_radio').addClass('checked');
            }
        })

    });

    $(document).on('click', '#js_see_button_sport', function (e) {
        ClosePopup();
        if (Promotions.isMobileView) {
            window.location.href = '/Bonus/NewBonuses';
        } else {
            $(".bonusesDialog").first().trigger("click");
        }
    });

    $(document).on('click', '#js_see_button_Wager', function (e) {
        ClosePopup();
        $('#js_open_exchange_14').trigger('click');
    })

    $(document).on('click', '#js_see_button_freespin', function (e) {
        ClosePopup();
        $('#js_open_exchange_11').trigger('click');
    })
    $(document).on('click', '#js_see_button_bog', function (e) {
        ClosePopup();
        $('#js_open_exchange_15').trigger('click');
    })

    $(document).on('click', '#js_see_button_exchange_sport', function (e) {
        ClosePopup();
        $('#js_open_exchange_13').trigger('click');
        $('body').removeClass('ofh');
        $('body').removeClass('js_popup_active');
    })
    $(document).on('click', '#js_see_button_exchange_sportWager', function (e) {
        ClosePopup();
        $('#js_open_exchange_24').trigger('click');
        $('body').removeClass('ofh');
        $('body').removeClass('js_popup_active');
    })


});//DOCUMENT READY

$(document).ready(function () {
    //Dice start

    $("#js_hasShake").click(function () {

        $("#js_popup_shake").css('display', 'none');

        if (typeof swiper2 != "undefined") {
            swiper2.slideTo(3, 0, true);
        }       

        if (!$('#dice_Tab').hasClass('slick-disabled')) {
            var elems = document.querySelectorAll("#dice_Tab");
            var elems2 = document.querySelectorAll(".cards_spin_tab");

            [].forEach.call(elems, function (el) {
                el.classList.remove("slick-arrow");
                el.classList.remove("slick-disabled");
                el.classList.remove("active");
            });

            var classNames = "active";

            $("#dice_Tab").addClass(classNames);
            $('.active').addClass('slick-arrow');
            $('.active').addClass('slick-disabled');

            var activeSlide = $(this).data("position");
            [].forEach.call(elems2, function (el2) {
                el2.classList.remove("slick-current");
                el2.classList.remove("slick-active");
            });


            $("[data-slick-index=" + activeSlide + "]").attr('aria-hidden', false);
            $('.slick-track').css({ transform: 'translate3d(' + (-390) * activeSlide + 'px, 0px, 0px)' });
        }

        $("html, body").animate({ scrollTop: $("#js_animate").offset().top }, 600);


        if (navigator.userAgent.match(/(\(iPod|\(iPhone|\(iPad)/)) {
            if (PromotionParams.isMobAppAndIos) {
                permission();
            }
        } else {

            $("#roll").addClass('onlyshake');
            $("#roll").removeAttr('id');
            $(".phone__circle-txt").empty();
        }

    });


    $("#roll:not(.onlyshake)").click(function () {

        if (prizeClicked) {
            ShowWarnMessage("WarnMessageClick");
        } else if (parseInt($("#js_dicePoints").text()) > 0 && !ShakeStarted) {
            $(this).addClass("phone__shaked");   
            ShakeStart();
        }
    });



    function phoneShake() {
        if (prizeClicked) {
            ShowWarnMessage("WarnMessageClick");
        } else if (parseInt($("#js_dicePoints").text()) > 0 && !ShakeStarted) {
            $(this).addClass("phone__shaked");
            ShakeStart();
        }
    }

    if (parseInt($("#js_dicePoints").text()) > 0) {

        $.shake({
            callback: function () {
                phoneShake();
            }
        });
    }

    $(document).on('click', '#js_Standard_block', function () {

        $(".cards_spin_buttons .cards_spin_button:nth-child(1)").trigger("click");

        ShakeStarted = false;

    });
    if (typeof swiper2 != "undefined") {
        swiper2.on('slideChange', function (e) {
            var dataId = swiper2.activeIndex;
            if (dataId == Promotions.DiceTab && Promotions.HasShake) {
                if (parseInt($("#js_dicePoints").text()) > 0) {
                    if (navigator.userAgent.match(/(\(iPod|\(iPhone|\(iPad)/)) {
                        permission();
                    } else {

                        $("#roll").addClass('onlyshake');
                        $("#roll").removeAttr('id');
                        $(".phone__circle-txt").empty();
                    }

                }
            }
        });
    }
  

    let AudioSrc = Promotions.CDNURL + 'Audio/Dice.mp3';
    var DiceSound = new Howl({
        src: [AudioSrc],

    });

    if (Promotions.isMobAppAndIos) {

        $("#js_3Mathis").click(function () {

            if (parseInt($("#js_dicePoints").text()) > 0) {

                if (navigator.userAgent.match(/(\(iPod|\(iPhone|\(iPad)/)) {
                    permission();
                } else {

                    $("#roll").addClass('onlyshake');
                    $("#roll").removeAttr('id');
                    $(".phone__circle-txt").empty();
                }

            }

        });
        $("#js_animate").click(function () {

            if (parseInt($("#js_dicePoints").text()) > 0) {

                if (navigator.userAgent.match(/(\(iPod|\(iPhone|\(iPad)/)) {
                    permission();
                } else {

                    $("#roll").addClass('onlyshake');
                    $("#roll").removeAttr('id');
                    $(".phone__circle-txt").empty();
                }

            }

        });
        $("#js_animate").click(function () {

            if (parseInt($("#js_dicePoints").text()) > 0) {

                if (navigator.userAgent.match(/(\(iPod|\(iPhone|\(iPad)/)) {
                    permission();
                } else {

                    $("#roll").addClass('onlyshake');
                    $("#roll").removeAttr('id');
                    $(".phone__circle-txt").empty();
                }

            }

        });

        if (typeof swiper2 != "undefined") {
            swiper2.on('slideChange', function (e) {
                var dataId = swiper2.activeIndex;
                if (dataId == 2) {
                    if (parseInt($("#js_dicePoints").text()) > 0) {

                        if (navigator.userAgent.match(/(\(iPod|\(iPhone|\(iPad)/)) {
                            permission();
                        } else {

                            $("#roll").addClass('onlyshake');
                            $("#roll").removeAttr('id');
                            $(".phone__circle-txt").empty();
                        }

                    }
                }
            });
        }     

        function permission() {
            if (typeof (DeviceMotionEvent) !== "undefined" && typeof (DeviceMotionEvent.requestPermission) === "function") {
                DeviceMotionEvent.requestPermission()
                    .then(response => {
                        if (response == "granted") {
                            window.addEventListener("devicemotion", (e) => {
                                //document.getElementById('permission info').innerText = e.acceleration.x;
                                $("#roll").addClass('onlyshake');
                                $("#roll").removeAttr('id');
                                $(".phone__circle-txt").empty();
                            })
                        }
                    })
                    .catch(console.error)
            }
        }

        function ShakeStart() {

            if (ShakeStarted || !$('#js_3Mathis').hasClass('swiper-slide-thumb-active')) {
                return
            }

            $("#wheel__spinBtn2").addClass("disabled");
            $("#js_sw_stop_auto_spin2").addClass("disabled");
            $("#js_sw_auto_spin2").addClass("disabled");
            $("#js_sw_turboSpin2").addClass("disabled");

            $("#wheel__spinBtn").addClass("disabled");
            $("#js_sw_stop_auto_spin").addClass("disabled");
            $("#js_sw_auto_spin").addClass("disabled");
            $("#js_sw_turboSpin").addClass("disabled");

            ShakeStarted = true;

            $(".dice-display-one,.dice-display-two").removeClass('active');

            $(".dice-box.dice-one").removeAttr('class').addClass("dice-box dice-one");
            $(".dice-box.dice-two").removeAttr('class').addClass("dice-box dice-two");
            var Points = parseInt($('.js_availableSpins').first().text());
            var Points2 = parseInt($('.js_availableSpins2').first().text());
            $.ajax({
                type: "POST",
                url: "/PromotionV1/DoShake",
                data: { PromotionId: Promotions.promotionId },
                success: function (result) {
                    if (result.Success == true) {

                        openPopupHelper.Dice1 = 6;
                        openPopupHelper.Dice2 = 6;
                        openPopupHelper.Rulinfo = result.EntryPoints[0];
                        openPopupHelper.Keys = result.Keys;

                        $("#js_dicePoints, .js_availableDice").text(parseInt($("#js_dicePoints").text()) - 1);
                        Promotions.ShakeCount = parseInt($("#js_dicePoints").text());
                        
                        $(".js_appPointCounts").text(parseInt(Promotions.ShakeCount) + parseInt(Promotions.AppPoints));


                        if (parseInt($("#js_dicePoints").text()) == 0) {
                            $('#roll').addClass('disabled');
                            $("#js_dicePoints, .js_availableDice").addClass('dis_none');
                        }

                        openPopupHelper.Dice1 = result.Dice1;
                        openPopupHelper.Dice2 = result.Dice2;

                        openPopupHelper.name = "lost";

                        if (openPopupHelper.Dice1 == openPopupHelper.Dice2) {

                            openPopupHelper.name = "win";

                            for (var i = 0; i < result.EntryPoints.length; i++) {
                                if (result.EntryPoints[i].PromotionEntryId == Promotions.activeClientEntryId) { //standard
                                    Promotions.ClientActiveEntry = parseInt(result.EntryPoints[i].Points) + parseInt(Promotions.ClientActiveEntry);
                                    Points = Promotions.ClientActiveEntry;

                                }

                                if (result.EntryPoints[i].PromotionEntryId == Promotions.SecondActiveEntryId) { //standard
                                    Promotions.ClientActiveWheelEntry = parseInt(result.EntryPoints[i].Points) + parseInt(Promotions.ClientActiveWheelEntry);
                                    Points2 = Promotions.ClientActiveWheelEntry;

                                }


                            }
                        }

                        const game = {

                            score: document.querySelector('.score'),
                            dice: [dice("one"), dice("two")],

                            roll() {
                                game.callEach("roll");
                                game.callEach("spin");
                                $('.dice-display').toggleClass('active');
                                setTimeout(game.callEach, 820, "show");
                            },

                            callEach(call) {
                                game.dice.forEach(dice => dice[call]())
                            },

                            //js_dicePoints_small
                        };
                        game.roll();
                        setShakePopupText();

                        setTimeout(function () {
                            if (openPopupHelper.name == "win") {
                                if (Promotions.exchangeRate > 1) {
                                    if (Points >= 2 * Promotions.exchangeRate) {
                                        $(".js_exchange_btn  ").removeClass("disabled");
                                        let changingPoint = $('.js_exchange_rate')[0].textContent;
                                        if (changingPoint <= (Points - Promotions.exchangeRate)) {
                                            $(".js_plus_btn").removeClass("disabled");
                                        } else {
                                            $(".js_plus_btn").addClass("disabled");
                                        }
                                        if (Points < changingPoint) {
                                            $('.js_exchange_rate').text(Number(changingPoint) - Number(Promotions.exchangeRate));
                                            $('.js_exchange_result').text(Number($('.js_exchange_result')[0].textContent) - 1);
                                        }
                                        $(".js_exchange_popup").text(Math.trunc(Points / Promotions.exchangeRate));

                                    } else if (Points >= Promotions.exchangeRate) {

                                        $(".js_exchange_btn  ").removeClass("disabled");
                                        $(".js_plus_btn").addClass("disabled");
                                        $(".js_minus_btn").addClass("disabled");
                                        $('.js_exchange_rate').text(Promotions.exchangeRate);
                                        $('.js_exchange_result').text("1");
                                        $(".js_exchange_popup").text(1);
                                    }
                                }
                                $('#js_tab_second_spinCount').text(Points2);
                                $('.js_availableSpins2').text(Points2);
                                UpdatePoints(Points, false);
                            }

                            openPopup();

                            if (parseInt($("#js_dicePoints").text()) == 0) {

                                $(".dice-display-one,.dice-display-two").removeClass('active');

                                $(".dice-box.dice-one").removeAttr('class').addClass("dice-box dice-one");
                                $(".dice-box.dice-two").removeAttr('class').addClass("dice-box dice-two");

                                $(".phone__shaked").addClass('disabled');

                            }

                            $(".phone__shaked ").removeClass('phone__shaked');

                        }, 3200);

                        setTimeout(function () {

                            if (parseInt($("#js_dicePoints").text()) == 0) {

                                $(".dice-display-one,.dice-display-two").removeClass('active');

                                $(".dice-box.dice-one").removeAttr('class').addClass("dice-box dice-one");
                                $(".dice-box.dice-two").removeAttr('class').addClass("dice-box dice-two");

                                $(".phone__shaked").addClass('disabled');
                                $('#roll').addClass('disabled');
                            }

                        }, 3300);


                    } else {

                        setPopupErrText(result.Message);
                    }

                },


            });
        }

        function setShakePopupText() {
            $("#popupTxt").remove();
            $("#prizeInfo").html();
            openPopupHelper.type = PromotionPopupsTypes.DiceLostMessage;
            if (openPopupHelper.name == "win") {
                openPopupHelper.type = PromotionPopupsTypes.DiceWinMessage;
            }

            $.ajax({
                type: "POST",
                url: "/PromotionV1/GetPopups",
                data: { TypeId: openPopupHelper.type, defoult: Promotions.DefaultLen },
                success: function (result) {
                    console.log(result);
                    var description = result.Description;

                    let Keys = openPopupHelper.Keys[0];
                    for (var key in Keys) {
                        description = description.replaceAll(key, Keys[key]);
                    }

                    if (openPopupHelper.name == "win") {
                        imgName = "dice-x1.png";
                    }
                    var html =
                        '<div class ="popup_header d-flex justify-content-between align-items-center">';
                    if (openPopupHelper.name == "win") {
                        html += '<h2 class="popup_title">' + result.Title + '</h2>';
                    } else {
                        html += '<h2 class="popup_title">' + result.Title + '</h2>';
                    }
                    html += '<span class="close_popup_button" id="js_close_popup_button"></span>';
                    html += '</div>';


                    html += '<div class ="popup_body text-center">';
                    html += '<div class="popup-diceImg"><div class="popup-diceFace popup-diceFace-0' + openPopupHelper.Dice1 + '" ></div> <div class="popup-diceFace popup-diceFace-0' + openPopupHelper.Dice2 + '"></div></div>';

                    html += '<div class="popup_text dice-popup_text">' + description + '</div>';

                    html += '</div>';


                    html += '<div class ="popup_footer d-flex justify-content-end">';

                    if (openPopupHelper.name == "win") {
                        let rull = openPopupHelper.Rulinfo;
                        if (rull.PromotionEntryId == Promotions.SecondActiveEntryId) {
                            html += '<button type = "button" class="btn_popup btn_popup__primary js_fw_spin_btn_popup_shake2" >' + result.Button1 + '</button>';
                        } else {
                            html += '<button type = "button" class="btn_popup btn_popup__primary js_fw_spin_btn_popup_shake" >' + result.Button1 + '</button>';
                        }


                    } else {
                        html += '<button type = "button" class="btn_popup btn_popup__primary" id = "js_close_Shake_Popup">' + result.Button1 + '</button>';
                    }
                    html += '</div>';

                    $("#prizeInfopop").html(html);
                    $(".spinner_popup_error").hide();
                    $("#popup_flex_box").removeClass("error_popup");
                    $(".spinner_popup").removeClass("not_prize_popup");
                    prizeClicked = false;
                    ShakeStarted = false;

                },
            });

            historyclicked = false;
        }

        /*dice animation*/

        const FACE_NAMES = ",top,left,front,back,right,bottom".split(",");

        const dice = name => {

            const el = document.querySelector(".dice-" + name);
            const animate = name => (el.classList.remove(state), el.classList.add(name), name);
            var value, side, state = "idle";
            DiceSound.currentTime = 0;
            DiceSound.play();
            side = openPopupHelper.Dice1;

            if (name == "one") {
                side = openPopupHelper.Dice2;
            }

            return {
                get val() { return "" + value },

                roll() { value = side },
                show() {
                    state = animate("show-" + FACE_NAMES[value])

                },

                spin() { state = animate("spin"), $('.dice-display').toggleClass('active'); },
            };
        }

    }


    //Dice End  

    //Initialize Swiper
    var prizeSwiper = new Swiper(".prizeSwiper", {

        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });


    //start news info box
    $(document).on('click', '.news_info-button', function () {
        $(".news_info-box").css('display', 'block');
    });
    $(document).on('click', '.news_info-close', function () {
        $(".news_info-box").css('display', 'none');
    });

    //start confirmInfo tooltip
    $(document).on('click', '.confirmInfo-btn', function () {
        $(".confirmInfo_tooltip").css('display', 'block');
    });
    $(document).on('click', '.confirmInfo_tooltip-close', function () {
        $(".confirmInfo_tooltip").css('display', 'none');
    });


    $(document).on('click', '.js_notify_to_parent', function (e) {
        let data = {};
        switch (this.dataset.type.toLowerCase()) {
            case 'cw_gamelaunch':
                data = {
                    type: this.dataset.type,
                    value: { gameUrl: this.dataset.gameUrl, lobbyUrl: this.dataset.lobbyUrl }
                }
                break;
            default:
                data = {
                    type: this.dataset.type,
                    value: this.dataset.val
                }
                break;
        }

        notifyToParent(data);
    });

   
});

function notifyToParent(data) {
    //Promotion.parentSystem possible values: website,mobileapp
    if (data != undefined && data.type != undefined) {
        switch (Promotions.parentSystem) {
            case 'website':
                //let w = window.parent || window;
                //w.postMessage({ type: data.type, value: data.value }, '*');
                if (typeof window !== 'undefined' && typeof window.postMessage === 'function') {
                    let w = typeof window.parent?.postMessage === 'function' ? window.parent : window;
                    w.postMessage({ type: data.type, value: data.value }, '*');
                }
                break;
            case 'mobileapp':
                let url = `/NativeApp?type=${data.type}`;
                if (data.value != undefined && data.value != '') {
                    if (data.type.toLowerCase() == 'cw_gamelaunch') {
                        url += `&gameUrl=${data.value.gameUrl}&lobbyUrl=${data.value.lobbyUrl}`;
                    } else {
                        url += `&value=${data.value}`;
                    }
                }
                window.open(url, '_blank');
                break;
            default:
                console.warn('Not supported parent system. ', parentSystem);
                break;
        }
    } else {
        console.warn('Wrong data! ', data);
    }
};
function handelBodyHeightChange(clientHeight) {
    let data = {
        type: 'cw_changeHeight',
        value: clientHeight + 'px'
    };
    notifyToParent(data);
};