/**
 * Created by yaoyao on 2016/9/28.
 * 试卷模块
 */
angular.module("app.paperModule",["ng","app.subjectModule"])
    .controller("paperListController",["$scope",function($scope){

    }])
    .controller("paperAddController",["$scope","commentService","paperModel","$routeParams",
        function($scope,commentService,paperModel,$routeParams){
        //将查询草的所有方向绑定到作用域
        commentService.getAllDepartment(function(data){
            $scope.departments=data;
        });
        $scope.model=paperModel.model;

        var id = $routeParams.id;
        if(id!=0){
            paperModel.addSubjectId(id);
            paperModel.addSubject(angular.copy($routeParams));
        }
        //console.log($routeParams);//地址中传的变量
    }])
    .factory("paperModel",function(){
        return{
            model:{
                dId:1,
                title:"",
                desc:"",
                tt:"",
                at:"",
                scores:[],
                subjectIds:[],
                subjects:[]
            },
            addSubjectId:function(id){
                this.model.subjectIds.push(id);
            },
            addSubject:function(subject){
                this.model.subjects.push(subject);
            },
            addScore:function(index,score){
                this.model.scores[index]=score;
            }
        }
    });