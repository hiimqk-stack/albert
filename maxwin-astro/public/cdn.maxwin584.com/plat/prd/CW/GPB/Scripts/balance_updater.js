var BalanceUpdater = {
    PlayerId: 0,
    _intervalId: null,
    _isRunning: false,
    _updateInterval: null,
    start: function () {
        if (this._isRunning)
            return;
        this._intervalId = setInterval(this.getBalanceAmount.bind(this), this._updateInterval);
        this._isRunning = true;
    },

    tryUpdateStatus: function () {
        var t = this;

        if (this._isRunning) {
            return ;
        }

        if (t._intervalId) {
            clearTimeout(t._intervalId);
        }

        $.ajax( {
            url: '/Common/GetLoginStatus',
            type: 'post',
            dataType: 'json',
            success: function (data) {
                if ((typeof regClicked === 'undefined' || !regClicked) && data && data.Reload == "Reload") {
                    document.location.reload();
                } else {
                    t._intervalId = setTimeout(t.tryUpdateStatus.bind(t), 60000);
                }
            }
        });
    },

    stop: function () {
        clearInterval(this._intervalId);
        this._isRunning = false;
    },

    getBalanceAmount: function () {
        var self = this;

        if (this.PlayerId > 0) {

            var sportUrl = false;
            if (location.pathname.toLowerCase().includes('sport') && !location.pathname.toLowerCase().includes('virtualsports')) {
               sportUrl = true;
            }

            var params = $.param({
                isSportUrl: sportUrl
            });
          
            $.ajax( {
                url: '/Common/GetBalanceStatus?' + params,
                type: 'post',
                dataType: 'json',
                success: function (data, text, request) {
                    self.onBalanceStatus(data);
                    responsibleGamingChecks(data);
                    if (data.CheckActivity && typeof checkActivity == 'function') {
                        checkActivity();
                    }
                }
            });
        }
    },

    onBalanceStatus: function (data) {
        if (data.Balance) {
            if (window.lblPersianBalance) {
                window.lblPersianBalance.innerText = toPersianDigit(data.Balance1.toFixed(2));

            } else if (window.lblBalance){
                window.lblBalance.innerText = data.Balance;
            }
            if (window.lblPersianBonusBalance) {
                if (data.Bonus1 != 0) {
                    window.lblPersianBonusBalance.innerHTML = toPersianDigit(data.Bonus1.toFixed(2));
                    window.bonusPersianBalanceCont.classList.remove('hidden');
                } else {
                    window.bonusPersianBalanceCont.classList.add('hidden');
                }
            }
            if (window.lblPersianWithdrBalance) {
                window.lblPersianWithdrBalance.innerHTML = toPersianDigit(data.Withdrawable1.toFixed(2))
            }
            if (window.lblBonusBalance) {
                if (!isNaN(data.Bonus1)) {
                    if (data.Bonus1 != 0) {
                        window.lblBonusBalance.innerHTML = data.Bonus1.toFixed(2);
                        window.bonusBalanceCont.classList.remove('hidden');
                    } else {
                        window.bonusBalanceCont.classList.add('hidden');
                    }
                } else {
                    window.bonusBalanceCont.classList.remove('hidden');
                    window.lblBonusBalance.innerHTML = data.Bonus1;
                }
            }
            if (window.lblBonusBalanceNew) {
                if (!isNaN(data.Bonus1)) {
                    if (data.Bonus1 != 0) {
                        window.lblBonusBalanceNew.innerHTML = data.Bonus1.toFixed(2);
                        window.bonusBalanceCont.classList.remove('hidden');
                    } else {
                        window.bonusBalanceCont.classList.add('hidden');
                    }
                } else {
                    window.bonusBalanceCont.classList.remove('hidden');
                    window.lblBonusBalanceNew.innerHTML = data.Bonus1;
                }
            }
            if (data.CommonBalance && window.lblCommonBalance) {
                window.lblCommonBalance.innerText = data.CommonBalance;
            }
            if (data.SportBalance && window.lblSportBalance) {
                window.lblSportBalance.innerText = data.SportBalance;
            }
        } else if (data.LogOut == "1") {
            document.location.reload();
        }
    }
};
function responsibleGamingChecks(data) {
    var showRealityCheckPopup = data.ShowRealityCheckPopup;
    if (showRealityCheckPopup == 'yes') {
        getRealityCheckPopupInfo();
    }
}
function toPersianDigit(balance) {
    var persianBalance = balance.toString();
    persianBalance = persianBalance.replace(/0/g, '۰');
    persianBalance = persianBalance.replace(/1/g, '۱');
    persianBalance = persianBalance.replace(/2/g, '۲');
    persianBalance = persianBalance.replace(/3/g, '۳');
    persianBalance = persianBalance.replace(/4/g, '۴');
    persianBalance = persianBalance.replace(/5/g, '۵');
    persianBalance = persianBalance.replace(/6/g, '۶');
    persianBalance = persianBalance.replace(/7/g, '۷');
    persianBalance = persianBalance.replace(/8/g, '۸');
    persianBalance = persianBalance.replace(/9/g, '۹');
    return persianBalance;
}
