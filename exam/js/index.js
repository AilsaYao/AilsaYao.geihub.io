/**
 * Created by yaoyao on 2016/9/22.
 * 这是核心JS
 */
//左侧导航动画功能
$(function(){
    $(".baseUI>li>ul").slideUp("fast");

    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function(){
        $(".baseUI>li>ul").slideUp("fast");
        $(this).next().slideDown();
    });
    //默认第一个展开
    $(".baseUI>li>a").eq(0).trigger("click");

    //背景改变
    $(".baseUI ul>li").off("click");
    $(".baseUI ul>li").on("click",function(){
        if(!$(this).hasClass("current")){
            $(".baseUI ul>li").removeClass("current");
            $(this).addClass("current");
        }
    });

    //默认点击第一个a  模拟点击全部题目
    $(".baseUI ul>li").eq(0).find("a").trigger("click");
});


//angular
angular.module("app",["ng","ngRoute","app.subjectModule","app.paperModule"])
    .controller("mainController",["$scope",function($scope){

    }])
    .config(["$routeProvider",function($routeProvider){
        //a href="#/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0"   params中
        $routeProvider.when("/SubjectList/dpId/:dpId/topicId/:topicId/levelId/:levelId/typeId/:typeId",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectController"
        }).when("/SubjectAdd",{
            templateUrl:"tpl/subject/subjectAdd.html",
            controller:"subjectController"
        }).when("/SubjectDel/id/:id",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectDelController"
        }).when("/SubjectCheck/id/:id/state/:state",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectCheckController"
        }).when("/PaperList",{
            templateUrl:"tpl/paper/paperManager.html",
            controller:"paperListController"
        }).when("/PaperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
            templateUrl:"tpl/paper/paperAdd.html",
            controller:"paperAddController"
        }).when("/PaperAddSubject",{
            templateUrl:"tpl/paper/subjectList.html",
            controller:"subjectController"
        });
    }]);
