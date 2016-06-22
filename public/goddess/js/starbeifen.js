var app = angular.module('vote', ['wilddog']);
app.controller('ivote', ['$scope', '$wilddogArray', function ($scope, $wilddogArray) {

    dd.device.base.getSettings({
        onSuccess: function (data) {
            if (data.language != "zh-Hans") {
                $scope.userLang = "en_US";
            }
        }
    });
    dd.ready(function () {
        dd.biz.navigation.setRight({
            show: true,
            control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
            text: '',//控制显示文本，空字符串表示显示默认文本
            onSuccess: function (result) {
                var url = "http://jz.fosun.com/vendor/bbs.html";
                var imgurl = "http://o7em07k23.bkt.clouddn.com/votezhshare.jpg";
                dd.biz.util.share({
                    type: 0,
                    url: url,
                    title: '为IT女神点赞，赢ClubMed大奖',
                    image: imgurl,
                    content: 'IT女神你做主，全民行动秀出你的赞，快来参与复星IT女神公选，为你心目中的IT女神点赞'
                })
            },
            onFail: function (err) {
            }
        });
    });
    fosun_oapi_login.getDDAccount(function (user) {
        $scope.email = user.email;
        $scope.mobile = user.mobile1;
        $scope.storage = window.localStorage;
        $scope.userLangEn = $scope.storage.getItem("userlang");
        if ($scope.userLang == 'en_US' || $scope.userLang == 'en_us' || $scope.userLang == 'en' || $scope.userLangEn == 'en_us' || $scope.userLangEn == 'en') {
            $scope.languageEn = true;
        } else {
            $scope.languageEn = false;
        }
        if (!$scope.languageEn) {
            window.showLoading("加载中");
        } else {
            window.showLoading("loading");
        }
        if($scope.email){
            $scope.pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、\\_ \\- ？]", "g");
            $scope.emailStr = $scope.email.replace($scope.pattern, '');

        }else{
            $scope.emailStr = $scope.mobile + "fosuncom";
        }


        $scope.persondata = new Wilddog('https://voteact.wilddogio.com/posts/' + $scope.emailStr + '/data');
        $scope.votedatenum = $wilddogArray($scope.persondata);
        $scope.ref = new Wilddog("https://voteact.wilddogio.com/data");
        $scope.votedata = $wilddogArray($scope.ref);
        window.setTimeout("window.hideLoading()", 500);
        $scope.voteOption = function (key) {
            var temp = $scope.votedata[key];
            if ($scope.emailStr) {
                temp.count++;
                $scope.votedatenum.$add(temp.name);

            } else {
                if (!$scope.languageEn) {
                    layer.open({
                        content: '请您移步至复星通，参与IT社区的各种讨论和精彩活动',
                        btn: ['关闭']
                    });
                } else {
                    layer.open({
                        content: 'Please move to Fosun, participation in the IT community discussions and exciting activities',
                        btn: ['close']
                    });
                }
            }
            $scope.votedata.$save(key);

        };
        $scope.checkEmail = function (rowData) {
            var temp = rowData;
            var emailResult = $scope.votedatenum.some(function (item, index, array) {
                return (item.$value == temp.name);
            });
            return emailResult;
        };
        $scope.checkCount = function (key) {
            var icount = 0;
            angular.forEach($scope.votedatenum, function (obj) {
                if (typeof obj === "object") {
                    icount = icount + 1;
                }
            });
            if (icount <= 4) {
                $scope.voteOption(key);
            } else {
                if (!$scope.languageEn) {
                    layer.open({
                        content: '别贪心，每人限投5票',
                        btn: ['关闭']
                    });
                } else {
                    layer.open({
                        content: 'Sorry, you can have 5 tickets at most',
                        btn: ['close']
                    });
                }

            }
        };
        $scope.gotoUrl = function (rowData) {
            var temp = rowData;
            dd.biz.util.openLink({
                url: temp.url,
                showMenuBar: true, //是否显示右上角按钮，默认true 显示 0.0.2
                credible: true, //是否可信的url，即白名单机制，可信的url支持调用jsapi，默认true 0.0.2
                enableShare: true, //是否启用默认分享(服务端抓取内容)，如果为false，则分享组件只有刷新动作; 默认true
                onSuccess: function () {

                },
                onFail: function (err) {
                }
            })

        };
        $scope.changeLanuage = function (key) {
            var switchLang = key;
            if (switchLang == 'en_us') {
                $scope.languageEn = true;
            } else if (switchLang == 'zh-cn') {
                $scope.languageEn = false;
            }
        };
    });
}]);


