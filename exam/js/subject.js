/**
 * Created by yaoyao on 2016/9/22.
 *
 * 题库模块
 */
angular.module("app.subjectModule",["ng"])
    //审核控制器
    .controller("subjectCheckController",["$routeParams","$location","subjectService",
        function($routeParams,$location,subjectService){
                subjectService.checkSubject($routeParams.id,$routeParams.state,function(data){
                    alert(data);
                });

        $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
        }])
    //删除题目控制器
    .controller("subjectDelController",["$routeParams","$location","subjectService",
        function($routeParams,$location,subjectService){
            //alert("删除");
            var flag = confirm("确认删除吗？");
            if(flag){
                //删除
                subjectService.delSubject($routeParams.id,function(data){
                    alert(data);
                });
            }
            //跳转
            $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
        }])
    //控制器
    .controller("subjectController",
        ["$scope","commentService","subjectService","$filter","$routeParams","$location",
        function($scope,commentService,subjectService,$filter,$routeParams,$location){

            $scope.params=$routeParams;

            //封装筛选数据时用的模板   通过菜单栏选择项从后台筛选所需数据
            var subjectModule =(function(){
                var obj = {};
                if($routeParams.typeId!=0){
                    obj['subject.subjectType.id']=$routeParams.typeId
                }
                if($routeParams.dpId!=0){
                    obj['subject.department.id']=$routeParams.dpId
                }
                if($routeParams.levelId!=0){
                    obj['subject.subjectLevel.id']=$routeParams.levelId
                }
                if($routeParams.topicId!=0){
                    obj['subject.topic.id']=$routeParams.topicId
                }
                return obj;
            })();
            //console.log(subjectModule);


            //调用方法加载题目属性信息，并且进行绑定
            $scope.isShow=true;


            //调用服务
            commentService.getAllType(function(data){
                //console.log(data);
                $scope.types=data;
            });
            commentService.getAllLevel(function(data){
                $scope.levels=data;
            });
            commentService.getAllTopic(function(data){
                $scope.topics=data;
            });
            commentService.getAllDepartment(function(data){
                $scope.departments=data;
            });

            //调用subjectService获取到的所有题目信息
            subjectService.getAllSubjects(subjectModule,function(data){
                $scope.subjects = data;

               //遍历所有的题目  计算出选择题的答案，并且将答案赋给answer
                data.forEach(function(subject){
                    var answer = [];
                    if(subject.subjectType && subject.subjectType.id != 3){
                        subject.choices.forEach(function(choice,index){
                            if(choice.correct){
                                //将索引转换为A/B/C/D
                                var no = $filter('indexToNo')(index);
                                answer.push(no);
                            }
                        });
                        //将计算出来的正确答案赋给subject.answer
                        subject.answer = answer.toString();
                    }

                });
                $scope.answer = data;
            });


            //这个是与subjectService.saveSubject中‘将参数转换为angular需要的数据格式’相对应
            //并且将subjectAdd.html中的ng-model改为ng-model="model.typeId"...
            /*$scope.model={
                typeId:1,
                dpId:1
                   //...
            }*/


            //subjectAdd菜单栏默认点击第一项  双向数据绑定
            $scope.subject={
                "subject.subjectType.id":1,
                "subject.subjectLevel.id":1,
                "subject.department.id":1,
                "subject.topic.id":1,
                "subject.stem":"",
                "subject.answer":"",
                "subject.analysis":"",
                choiceContent:[],
                choiceCorrect:[false,false,false,false]
            };

            //保存并继续
            $scope.save=function(){

                subjectService.saveSubject($scope.subject,function(data){
                    alert(data);//弹出保存成功
                });

                //这个subject不会改变
                var subject={
                    "subject.subjectType.id":1,
                    "subject.subjectLevel.id":1,
                    "subject.department.id":1,
                    "subject.topic.id":1,
                    "subject.stem":"",
                    "subject.answer":"",
                    "subject.analysis":"",
                    choiceContent:[],
                    choiceCorrect:[false,false,false,false]
                };
                //重置表单元素
                angular.copy(subject,$scope.subject);

            };

            //保存并关闭
            $scope.saveAndClose=function(){
                subjectService.saveSubject($scope.subject,function(data){
                    alert(data);
                });
                $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
            };


    }])
    //题目服务   封装操作题目的函数
    .service("subjectService",["$http","$httpParamSerializer",function($http,$httpParamSerializer){
        this.checkSubject=function(id,state,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    'subject.id':id,
                    'subject.checkState':state
                }
            }).success(function(data){
                handler(data);
            });
        };
        this.delSubject=function(id,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{
                    'subject.id':id
                }
            }).success(function(data){
                handler(data);
            });
        };
        this.getAllSubjects=function(params,handler){
            $http.get("data/subjects.json",{
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{
                params:params
            }).success(function(data){
                handler(data);
            });
        };
        this.saveSubject=function(shuju,handler){
            //将参数转换为angular需要的数据格式
           /* var obj = {};
            for(var key in shuju){
                var val=shuju[key];
                switch(key){
                    case "typeId" :
                        obj['subject.subjectType.id']=val;
                        break;
                    case "dpId" :
                        obj['subject.department.id']=val;
                        break;
                        ...
                }
            }*/
            //将对象数据转换为表单编码样式的数据
            shuju=$httpParamSerializer(shuju);
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",shuju,{
                headers:{
                    //转换设置提交数据的头部信息
                    //因为提交数据时Content-Type还是以JSON提交，所以必须要写这行代码
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            })
                .success(function(data){
                handler(data);
            });
        }
    }])
    //公共服务  用于获取题目相关信息
    .factory("commentService",["$http",function($http){
        return{
            getAllType:function(handler){
                $http.get("data/types.json")
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action")
                    .success(function(data){
                    handler(data);
                });
            },
            getAllLevel:function(handler){
                $http.get("data/levels.json")
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action")
                    .success(function(data){
                    handler(data);
                });
            },
            getAllTopic:function(handler){
                $http.get("data/topics.json")
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action")
                    .success(function(data){
                    handler(data);
                });
            },
            getAllDepartment:function(handler){
                $http.get("data/departmentes.json")
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action")
                    .success(function(data){
                    handler(data);
                });
            }
        }
    }])
    //过滤器
    .filter("selectTopics",function(){
        return function(input,id){
            //console.log(input,id);
            if(input){
                return input.filter(function(item){
                    return item.department.id==id;
                });
            }

        }
    })
    .filter("indexToNo",function(){
        return function(input){
            //return input==0?'A':(input==1?'B':(input==2?'C':'D'));
            var result ;
            switch(input){
                case 0:
                    result = 'A';
                    break;
                case 1:
                    result = 'B';
                    break;
                case 2:
                    result = 'C';
                    break;
                case 3:
                    result = 'D';
                    break;
                case 4:
                    result = 'E';
                    break;
                case 5:
                    result = 'F';
                    break;
            }
            return result;
        }
    })
    .directive("selectOption",function(){
        return{
            restrict:"A",
            link:function(scope,element){
                element.on("change",function () {
                    var type = element.attr("type");
                    var isCheck = element.prop("checked");
                    if(type=='radio'){
                        //alert($(this).val());
                        scope.subject.choiceCorrect=[false,false,false,false];
                        var index = $(this).val();
                        scope.subject.choiceCorrect[index]=true;

                    }else if(type=='checkbox'&&isCheck){
                        //alert(1);
                        var index = $(this).val();
                        scope.subject.choiceCorrect[index]=true;
                    }
                    //强制将scope更新
                    scope.$digest();


                });
            }
        }
    });