function changeSportRoute() {
    let documentPath = document.location.pathname.toLowerCase().split('/');
    let qsparam = setSportRouting();
    let path = setPath(documentPath);
    qsparam = qsparam == undefined || qsparam == "" ? {} : qsparam;

    let dispatchPrematchEvnt = {
        type: 3,
        message: {
            path: path,
            qs: qsparam
        }
    };
    let dispatchEventDetailsEvnt = {
        type: 3,
        message: {
            path: path,
            hashData: qsparam
        }
    };

    SportFrame.setSportAppRoute(path.includes('event-details') || path.includes('team-details') || path.includes('search') ? dispatchPrematchEvnt : dispatchEventDetailsEvnt);
};
function setSportRouting() {
    let urlParams = window.location.search;
    let url = window.location.href;
    let qs = '';
    let counter = 0;
    const searchParams = new URLSearchParams(urlParams);
    
    let hashData = searchParams.get('data');
    if (hashData) {
        return hashData;
    }

    if (url.includes('event-details') || url.includes('team-details') || url.includes('search')) {
        searchParams.forEach((key, value) => {
            counter++;
            if (value.toLowerCase() == 'competitorid') {
                value = 'competitorId';
            }
            if (value.toLowerCase() == 'eventid') {
                value = 'eventId';
            }
            if (value.toLowerCase() == 'resultpage') {
                value = 'resultPage';
            }
            qs += `"${value}":"${key}"`;
            if (counter != Array.from(searchParams).length) {
                qs += ','
            }
        });
        qs = '{ ' + qs + '}';
        return JSON.parse(qs);
    }
    else {
        const numbers = urlParams.match(/\d+/g);
        if (numbers) {

            if (numbers.length == 1) {
                qs = `{"${numbers[0]}":{}}`;
            } else {
                for (var i = 0; i < numbers.length; i++) {
                    if (i == 0) {
                        qs += `{"${numbers[0]}"`;
                    } else if (i == 1) {
                        qs += `: {"${numbers[1]}"` + ': [';
                    } else {
                        qs += i == numbers.length - 1 ? numbers[i] : numbers[i] + ',';
                    }
                }
                qs += ']}}';
            }

            return qs = {
                q: qs
            }
        }
    }
    return qs;
};
function getSportRouting(sp_data) {
    if (sp_data && sp_data.type == 'sportAppEventDispatch') {
        let dataType = sp_data.data.type;
        let metaData = ''
        switch (dataType) {
            case 3:
                let allowReplace = sp_data.data.message != undefined && sp_data.data.message.action != undefined && sp_data.data.message.action.toLowerCase() == 'replace';
                let url = '';
                let qs = '';
                let pathname = sp_data.data.message.pathname == '/' ? '/' + document.documentElement.lang + "/sport" : '/' + document.documentElement.lang + "/sport" + sp_data.data.message.pathname;
                if (typeof sp_data.data.message.qs === 'object' && Object.keys(sp_data.data.message.qs).length !== 0 && sp_data.data.message.pathname.includes('team-details')) {

                    if (sp_data.data.message.qs.competitorId != undefined) {
                        qs += 'competitorId=' + sp_data.data.message.qs.competitorId
                    }
                    if (sp_data.data.message.qs.eventId != undefined) {
                        qs += qs == '' ? 'eventId' : '&eventId=' + sp_data.data.message.qs.eventId;
                    }
                }
                else if (typeof sp_data.data.message === 'object' && sp_data.data.message.qs && sp_data.data.message.pathname.includes('search')) {
                    qs = sp_data.data.message.qs;
                }
                else if (typeof sp_data.data.message.qs === 'object' && Object.keys(sp_data.data.message.qs).length !== 0) {
                    if (sp_data.data.message.qs.sport != undefined) {
                        qs += 'sport=' + sp_data.data.message.qs.sport
                    }
                    if (sp_data.data.message.qs.country != undefined) {
                        qs += qs == '' ? 'country' : '&country=' + sp_data.data.message.qs.country;
                    }
                    if (sp_data.data.message.qs.champ != undefined) {
                        qs += qs == '' ? 'champ' : '&champ=' + sp_data.data.message.qs.champ;
                    }
                    if (sp_data.data.message.qs.event != undefined) {
                        qs += qs == '' ? 'event' : '&event=' + sp_data.data.message.qs.event;
                    }
                    if (sp_data.data.message.qs.live != undefined) {
                        qs += qs == '' ? 'live' : '&live=' + sp_data.data.message.qs.live;
                    }
                    if (sp_data.data.message.qs.chat != undefined) {
                        qs += qs == '' ? 'chat' : '&chat=' + sp_data.data.message.qs.chat;
                    }
                    if (sp_data.data.message.qs.supertip != undefined) {
                        qs += qs == '' ? 'supertip' : '&supertip=' + sp_data.data.message.qs.supertip;
                    }
                    if (sp_data.data.message.qs.resultPage != undefined) {
                        qs += qs == '' ? 'resultPage' : '&resultPage=' + sp_data.data.message.qs.resultPage;
                    }
                } else if (typeof sp_data.data.message.qs == 'string') {
                    let queryStr = sp_data.data.message.qs;
                    try {
                        queryStr = decodeURIComponent(queryStr);
                    } catch (e) {
                        console.log(e);
                    }
                    qs = cratePreMatchRouting(queryStr);

                    if (sp_data.data.message.hashData) {
                        qs += '&data=' + sp_data.data.message.hashData;
                    }
                }
                url = qs == '' ? pathname : pathname + '/?' + qs;
                changePageUrlWithoutRefreshing(url, url, allowReplace);
                setActiveClassToPrMenuItems('js_menu_links');
                if (pathname.includes('event-details') && typeof sp_data.data.message.additionalData === 'object') {
                    metaData = sp_data.data.message.additionalData.sportCurrentName + ' | ' + sp_data.data.message.additionalData.tournamentCurrentName + ' | ' + sp_data.data.message.additionalData.eventCurrentName;
                }
                else if (pathname.includes('team-details') && typeof sp_data.data.message.additionalData === 'object') {
                    metaData = sp_data.data.message.additionalData.sportName + ' | ' + sp_data.data.message.additionalData.sportCurrentName + ' | ' + sp_data.data.message.additionalData.competitorName + ' | ' + sp_data.data.message.additionalData.competitorCurrentName;
                }
                else if (typeof sp_data.data.message.additionalData === 'object' && sp_data.data.message.qs && Object.keys(sp_data.data.message.qs).length !== 0) {
                    if (sp_data.data.message.additionalData.coutryName) {
                        for (var i = 0; i < sp_data.data.message.additionalData.coutryName.length; i++) {
                            metaData += sp_data.data.message.additionalData.coutryName[i] + ' | ';
                        }
                    }
                    if (sp_data.data.message.additionalData.sportName) {
                        for (var i = 0; i < sp_data.data.message.additionalData.sportName.length; i++) {
                            metaData += sp_data.data.message.additionalData.sportName[i] + ' | ';
                        }
                    }
                    if (sp_data.data.message.additionalData.champName) {
                        for (var i = 0; i < sp_data.data.message.additionalData.champName.length; i++) {
                            metaData += sp_data.data.message.additionalData.champName[i] + ' | ';
                        }
                    }
                    metaData = metaData.slice(0, -2);
                }
                else if (typeof spOnNavigateCallback == 'function') {
                    metaData = spOnNavigateCallback(pathname);
                }
                if (metaData != '') {
                    document.title = metaData;
                }
                break;
            case 4:
                let metaPath = documentPath[2] == undefined ? '' : documentPath[2];
                if (metaPath.includes('event-details') && typeof sp_data.data.message.additionalData === 'object') {
                    metaData = sp_data.data.message.additionalData.sportCurrentName + ' | ' + sp_data.data.message.additionalData.tournamentCurrentName + ' | ' + sp_data.data.message.additionalData.eventCurrentName;
                }
                else if (metaPath.includes('team-details') && typeof sp_data.data.message.additionalData === 'object') {
                    metaData = sp_data.data.message.additionalData.sportName + ' | ' + sp_data.data.message.additionalData.sportCurrentName + ' | ' + sp_data.data.message.additionalData.competitorName + ' | ' + sp_data.data.message.additionalData.competitorCurrentName;
                }
                else if (typeof sp_data.data.message.additionalData === 'object') {
                    if (sp_data.data.message.additionalData.coutryName) {
                        for (var i = 0; i < sp_data.data.message.additionalData.coutryName.length; i++) {
                            metaData += sp_data.data.message.additionalData.coutryName[i] + ' | ';
                        }
                    }
                    if (sp_data.data.message.additionalData.sportName) {
                        for (var i = 0; i < sp_data.data.message.additionalData.sportName.length; i++) {
                            metaData += sp_data.data.message.additionalData.sportName[i] + ' | ';
                        }
                    }
                    if (sp_data.data.message.additionalData.champName) {
                        for (var i = 0; i < sp_data.data.message.additionalData.champName.length; i++) {
                            metaData += sp_data.data.message.additionalData.champName[i] + ' | ';
                        }
                    }
                    metaData = metaData.slice(0, -2);
                }
                else if (typeof spOnNavigateCallback == 'function') {
                    metaData = spOnNavigateCallback(metaPath);
                }
                if (metaData != '') {
                    document.title = metaData;
                }
                break;
        }
    }
};

let qsparam = setSportRouting();
qsparam = qsparam == undefined || qsparam == "" ? {} : qsparam;
let documentPath = document.location.pathname.toLowerCase().split('/');
let path = setPath(documentPath);
let initialRoutePrematch = {
    path: path,
    hashData: qsparam,
    qs: qsparam
};

let initialRouteEventDetails = {
    path: path,
    qs: qsparam
};

var SportHelper = SportHelper || (function () {
    return {
        init: function (args) {
            args.params.push(['initialRoute', path.includes('event-details') || path.includes('team-details') || path.includes('search') ? initialRouteEventDetails : initialRoutePrematch]);
            if (args.type.toLocaleLowerCase() == 'africanview') {
                args.params.push(['sportsBookView', 'africanView']);
            }
            SportFrame.frame(args.params);
        }
    }
})();